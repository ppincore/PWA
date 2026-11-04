import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, filters: Record<string, string> = {}) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        ...(filters.type ? { type: filters.type.toUpperCase() as 'INCOME' | 'EXPENSE' } : {}),
        ...(filters.accountId ? { accountId: filters.accountId } : {}),
        ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
        ...(filters.search
          ? {
              description: {
                contains: filters.search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      include: { account: true, category: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const item = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { account: true, category: true },
    });

    if (!item) {
      throw new NotFoundException('Transaction not found');
    }

    return item;
  }

  async create(userId: string, dto: CreateTransactionDto) {
    const account = await this.prisma.account.findFirst({
      where: { id: dto.accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: dto.categoryId, userId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const amount = new Prisma.Decimal(dto.amount.toString());
    const nextBalance = this.calculateBalance(account.balance, dto.type, amount, 'apply');

    if (dto.type === 'EXPENSE' && nextBalance.lt(0)) {
      throw new BadRequestException('Insufficient funds on account');
    }

    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          userId,
          accountId: dto.accountId,
          categoryId: dto.categoryId,
          type: dto.type,
          amount,
          description: dto.description ?? '',
          date: new Date(dto.date),
        },
      });

      await tx.account.update({
        where: { id: dto.accountId },
        data: {
          balance: nextBalance,
        },
      });

      return transaction;
    });
  }

  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { account: true },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    const finalType = dto.type ?? existing.type;
    const finalAmount = new Prisma.Decimal((dto.amount ?? Number(existing.amount)).toString());
    const nextAccountBalance = this.calculateBalance(
      new Prisma.Decimal(existing.account.balance.toString()),
      existing.type,
      new Prisma.Decimal(existing.amount.toString()),
      'revert',
    );

    const newBalance = this.calculateBalance(nextAccountBalance, finalType, finalAmount, 'apply');

    if (finalType === 'EXPENSE' && newBalance.lt(0)) {
      throw new BadRequestException('Insufficient funds on account');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: { id },
        data: {
          accountId: dto.accountId ?? existing.accountId,
          categoryId: dto.categoryId ?? existing.categoryId,
          type: finalType,
          amount: finalAmount,
          description: dto.description ?? existing.description,
          date: dto.date ? new Date(dto.date) : existing.date,
        },
      });

      await tx.account.update({
        where: { id: dto.accountId ?? existing.accountId },
        data: {
          balance: newBalance,
        },
      });

      return updated;
    });
  }

  async remove(userId: string, id: string) {
    const item = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { account: true },
    });

    if (!item) {
      throw new NotFoundException('Transaction not found');
    }

    const revertedBalance = this.calculateBalance(
      new Prisma.Decimal(item.account.balance.toString()),
      item.type,
      new Prisma.Decimal(item.amount.toString()),
      'revert',
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.transaction.delete({ where: { id } });
      await tx.account.update({
        where: { id: item.accountId },
        data: {
          balance: revertedBalance,
        },
      });
    });

    return { success: true };
  }

  private calculateBalance(
    currentBalance: Prisma.Decimal,
    type: 'INCOME' | 'EXPENSE',
    amount: Prisma.Decimal,
    mode: 'apply' | 'revert',
  ) {
    const delta = new Prisma.Decimal(amount.toString());
    const next = new Prisma.Decimal(currentBalance.toString());

    if (mode === 'apply') {
      if (type === 'INCOME') {
        return next.plus(delta);
      }
      return next.minus(delta);
    }

    if (type === 'INCOME') {
      return next.minus(delta);
    }
    return next.plus(delta);
  }
}

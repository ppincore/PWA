import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTransferDto) {
    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException('Sender and recipient accounts must be different');
    }

    const fromAccount = await this.prisma.account.findFirst({
      where: { id: dto.fromAccountId, userId },
    });

    if (!fromAccount) {
      throw new NotFoundException('Source account not found');
    }

    const toAccount = await this.prisma.account.findFirst({
      where: { id: dto.toAccountId, userId },
    });

    if (!toAccount) {
      throw new NotFoundException('Target account not found');
    }

    const amount = new Prisma.Decimal(dto.amount.toString());
    const senderBalance = new Prisma.Decimal(fromAccount.balance.toString());
    if (senderBalance.lt(amount)) {
      throw new BadRequestException('Insufficient funds');
    }

    return this.prisma.$transaction(async (tx) => {
      const transfer = await tx.transfer.create({
        data: {
          userId,
          fromAccountId: dto.fromAccountId,
          toAccountId: dto.toAccountId,
          amount,
          description: dto.description ?? '',
          date: new Date(dto.date),
        },
      });

      await tx.account.update({
        where: { id: dto.fromAccountId },
        data: { balance: senderBalance.minus(amount) },
      });

      const targetBalance = new Prisma.Decimal(toAccount.balance.toString());
      await tx.account.update({
        where: { id: dto.toAccountId },
        data: { balance: targetBalance.plus(amount) },
      });

      return transfer;
    });
  }

  async findAll(userId: string) {
    return this.prisma.transfer.findMany({
      where: { userId },
      include: {
        fromAccount: true,
        toAccount: true,
      },
      orderBy: { date: 'desc' },
    });
  }
}

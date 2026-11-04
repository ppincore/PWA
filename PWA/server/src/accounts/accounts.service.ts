import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type,
        currency: dto.currency,
        balance: dto.balance.toString(),
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateAccountDto) {
    await this.findOne(userId, id);

    return this.prisma.account.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.balance !== undefined ? { balance: dto.balance.toString() } : {}),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.account.delete({
      where: { id },
    });
    return { success: true };
  }
}

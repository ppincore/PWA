jest.mock('@nestjs/common', () => ({
  Injectable: () => undefined,
  BadRequestException: class BadRequestException extends Error {},
  NotFoundException: class NotFoundException extends Error {},
}));

import { Prisma } from '@prisma/client';
import { TransactionsService } from '../src/transactions/transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      account: { findFirst: jest.fn(), update: jest.fn() },
      category: { findFirst: jest.fn() },
      transaction: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
      $transaction: jest.fn(async (fn) => fn({
        account: { update: prisma.account.update },
        transaction: {
          create: prisma.transaction.create,
          update: prisma.transaction.update,
          delete: prisma.transaction.delete,
        },
      })),
    };

    service = new TransactionsService(prisma);
  });

  it('adjusts account balance for expense operations', () => {
    const result = service['calculateBalance'](
      new Prisma.Decimal('1000'),
      'EXPENSE',
      new Prisma.Decimal('150.50'),
      'apply',
    );

    expect(result.toFixed(2)).toBe('849.50');
  });

  it('reverts income balance properly', () => {
    const result = service['calculateBalance'](
      new Prisma.Decimal('3500'),
      'INCOME',
      new Prisma.Decimal('500'),
      'revert',
    );

    expect(result.toFixed(2)).toBe('3000.00');
  });
});

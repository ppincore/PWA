import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string) {
    const [accounts, transactions, recentTransactions] = await Promise.all([
      this.prisma.account.findMany({ where: { userId } }),
      this.prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 8,
        include: { account: true, category: true },
      }),
    ]);

    const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance.toString()), 0);

    const income = transactions
      .filter((item) => item.type === 'INCOME')
      .reduce((sum, item) => sum + Number(item.amount.toString()), 0);

    const expense = transactions
      .filter((item) => item.type === 'EXPENSE')
      .reduce((sum, item) => sum + Number(item.amount.toString()), 0);

    return {
      totalBalance,
      income,
      expense,
      difference: income - expense,
      recentTransactions,
    };
  }

  async getIncomeExpense(userId: string) {
    const data = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1),
        },
      },
    });

    const map = new Map<string, { income: number; expense: number }>();

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, { income: 0, expense: 0 });
    }

    data.forEach((item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!map.has(key)) {
        return;
      }
      const current = map.get(key)!;
      if (item.type === 'INCOME') {
        current.income += Number(item.amount.toString());
      } else {
        current.expense += Number(item.amount.toString());
      }
    });

    return Array.from(map.entries()).map(([month, values]) => ({
      month,
      income: values.income,
      expense: values.expense,
    }));
  }

  async getCategories(userId: string) {
    const currentMonth = new Date();
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        date: { gte: start },
      },
      include: { category: true },
    });

    const grouped = new Map<string, number>();

    transactions.forEach((transaction) => {
      const label = transaction.category?.name ?? 'Other';
      const current = grouped.get(label) ?? 0;
      grouped.set(label, current + Number(transaction.amount.toString()));
    });

    return Array.from(grouped.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }

  async getBalanceHistory(userId: string) {
    const accounts = await this.prisma.account.findMany({ where: { userId } });
    const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance.toString()), 0);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1),
        },
      },
      orderBy: { date: 'asc' },
    });

    const history: Array<{ month: string; balance: number }> = [];

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthTransactions = transactions.filter((item) => {
        const itemDate = new Date(item.date);
        return `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}` === key;
      });

      const delta = monthTransactions.reduce((sum, item) => {
        if (item.type === 'INCOME') {
          return sum + Number(item.amount.toString());
        }
        return sum - Number(item.amount.toString());
      }, 0);

      history.push({
        month: key,
        balance: totalBalance + delta,
      });
    }

    return history;
  }
}

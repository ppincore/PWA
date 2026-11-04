export type User = {
  id: string;
  name: string;
  email: string;
};

export type Account = {
  id: string;
  name: string;
  type: string;
  currency: string;
  balance: number | string;
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon?: string;
  color?: string;
};

export type Transaction = {
  id: string;
  accountId: string;
  categoryId?: string | null;
  type: 'INCOME' | 'EXPENSE';
  amount: number | string;
  description?: string | null;
  date: string;
  account?: Account;
  category?: Category;
};

export type Transfer = {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number | string;
  description?: string | null;
  date: string;
};

export type OverviewData = {
  totalBalance: number;
  income: number;
  expense: number;
  difference: number;
  recentTransactions: Transaction[];
};

export type ChartPoint = {
  month: string;
  income: number;
  expense: number;
};

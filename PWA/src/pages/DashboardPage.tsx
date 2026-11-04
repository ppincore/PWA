import { ArrowDownRight, ArrowUpRight, CreditCard, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, Area, AreaChart, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { useGetCategoryStatsQuery, useGetIncomeExpenseQuery, useGetOverviewQuery } from '../shared/api/api';

export function DashboardPage() {
  const { data: overview } = useGetOverviewQuery();
  const { data: incomeExpense = [] } = useGetIncomeExpenseQuery();
  const { data: categoryStats = [] } = useGetCategoryStatsQuery();

  return (
    <div className="page-stack">
      <div className="header-row">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h2>Overview</h2>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card accent-green">
          <div className="stat-icon green"><TrendingUp size={18} /></div>
          <div>
            <span>Total balance</span>
            <strong>{Number(overview?.totalBalance ?? 0).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</strong>
          </div>
        </div>
        <div className="stat-card accent-blue">
          <div className="stat-icon blue"><ArrowUpRight size={18} /></div>
          <div>
            <span>Income</span>
            <strong>{Number(overview?.income ?? 0).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</strong>
          </div>
        </div>
        <div className="stat-card accent-red">
          <div className="stat-icon red"><ArrowDownRight size={18} /></div>
          <div>
            <span>Expenses</span>
            <strong>{Number(overview?.expense ?? 0).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</strong>
          </div>
        </div>
        <div className="stat-card accent-neutral">
          <div className="stat-icon neutral"><CreditCard size={18} /></div>
          <div>
            <span>Difference</span>
            <strong>{Number(overview?.difference ?? 0).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</strong>
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="panel">
          <h3>Income vs expenses</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={incomeExpense}>
                <defs>
                  <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="income" stroke="#22c55e" fill="url(#incomeFill)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expenseFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <h3>Expense categories</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

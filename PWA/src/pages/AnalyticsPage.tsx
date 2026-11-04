import { ResponsiveContainer, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { t } from '../i18n';
import { useGetBalanceHistoryQuery, useGetIncomeExpenseQuery } from '../shared/api/api';

export function AnalyticsPage() {
  const { data: monthly = [] } = useGetIncomeExpenseQuery();
  const { data: balanceHistory = [] } = useGetBalanceHistoryQuery();

  return (
    <div className="page-stack">
      <div className="header-row">
        <div>
          <span className="eyebrow">{t.analytics}</span>
          <h2>{t.statistics}</h2>
        </div>
      </div>

      <div className="chart-grid">
        <div className="panel">
          <h3>{t.monthlyReport}</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#22c55e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <h3>{t.balanceDynamics}</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={balanceHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="balance" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

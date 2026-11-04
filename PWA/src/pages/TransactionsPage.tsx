import { useState } from 'react';
import { t } from '../i18n';
import { useCreateTransactionMutation, useGetAccountsQuery, useGetCategoriesQuery, useGetTransactionsQuery } from '../shared/api/api';

export function TransactionsPage() {
  const { data: accounts = [] } = useGetAccountsQuery();
  const { data: categories = [] } = useGetCategoriesQuery({});
  const { data: transactions = [] } = useGetTransactionsQuery({});
  const [createTransaction] = useCreateTransactionMutation();

  const [form, setForm] = useState({ accountId: '', categoryId: '', type: 'EXPENSE', amount: '0', description: '', date: new Date().toISOString().slice(0, 10) });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createTransaction({
      accountId: form.accountId,
      categoryId: form.categoryId || undefined,
      type: form.type as 'INCOME' | 'EXPENSE',
      amount: Number(form.amount),
      description: form.description,
      date: form.date,
    }).unwrap();
  };

  return (
    <div className="page-stack">
      <div className="header-row">
        <div>
          <span className="eyebrow">{t.operations}</span>
          <h2>{t.operations}</h2>
        </div>
      </div>

      <div className="two-column-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h3>{t.newOperation}</h3>
          <div className="form-grid">
            <label>
              {t.account}
              <select value={form.accountId} onChange={(event) => setForm({ ...form, accountId: event.target.value })}>
                <option value="">{t.selectAccount}</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </label>
            <label>
              {t.type}
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option value="INCOME">{t.income}</option>
                <option value="EXPENSE">{t.expense}</option>
              </select>
            </label>
            <label>
              {t.category}
              <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
                <option value="">{t.noCategory}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label>
              {t.amount}
              <input type="number" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
            </label>
            <label>
              {t.date}
              <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
            </label>
            <label>
              {t.description}
              <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
          </div>
          <button className="primary" type="submit">{t.operations}</button>
        </form>

        <div className="panel list-panel">
          <h3>{t.recentOperations}</h3>
          {transactions.slice(0, 8).map((transaction) => (
            <div key={transaction.id} className="list-item">
              <div>
                <strong>{transaction.description || t.noDescription}</strong>
                <span>{transaction.type === 'INCOME' ? t.income : t.expense}</span>
              </div>
              <div className={transaction.type === 'INCOME' ? 'money good' : 'money bad'}>
                {transaction.type === 'INCOME' ? '+' : '-'}
                {Number(transaction.amount).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

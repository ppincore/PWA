import { useState } from 'react';
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
          <span className="eyebrow">Transactions</span>
          <h2>Operations</h2>
        </div>
      </div>

      <div className="two-column-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h3>New operation</h3>
          <div className="form-grid">
            <label>
              Account
              <select value={form.accountId} onChange={(event) => setForm({ ...form, accountId: event.target.value })}>
                <option value="">Select account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </label>
            <label>
              Type
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </label>
            <label>
              Category
              <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label>
              Amount
              <input type="number" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
            </label>
            <label>
              Date
              <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
            </label>
            <label>
              Description
              <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
          </div>
          <button className="primary" type="submit">Add operation</button>
        </form>

        <div className="panel list-panel">
          <h3>Recent operations</h3>
          {transactions.slice(0, 8).map((transaction) => (
            <div key={transaction.id} className="list-item">
              <div>
                <strong>{transaction.description || 'Operation'}</strong>
                <span>{transaction.type}</span>
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

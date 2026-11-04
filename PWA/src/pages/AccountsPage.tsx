import { useState } from 'react';
import { formatAccountType, t } from '../i18n';
import { useCreateAccountMutation, useGetAccountsQuery } from '../shared/api/api';

export function AccountsPage() {
  const { data = [], isLoading } = useGetAccountsQuery();
  const [createAccount] = useCreateAccountMutation();
  const [form, setForm] = useState({ name: '', type: 'CARD', currency: 'RUB', balance: '0' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createAccount({
      name: form.name,
      type: form.type,
      currency: form.currency,
      balance: Number(form.balance),
    }).unwrap();
    setForm({ name: '', type: 'CARD', currency: 'RUB', balance: '0' });
  };

  return (
    <div className="page-stack">
      <div className="header-row">
        <div>
          <span className="eyebrow">{t.accounts}</span>
          <h2>{t.myAccounts}</h2>
        </div>
      </div>

      <div className="two-column-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h3>{t.addAccount}</h3>
          <div className="form-grid">
            <label>
              {t.name}
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              {t.type}
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option value="CASH">{t.cash}</option>
                <option value="CARD">{t.card}</option>
                <option value="BANK">{t.bank}</option>
                <option value="SAVINGS">{t.savings}</option>
                <option value="OTHER">{t.other}</option>
              </select>
            </label>
            <label>
              {t.currency}
              <select value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}>
                <option value="RUB">RUB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </label>
            <label>
              {t.initialBalance}
              <input type="number" step="0.01" value={form.balance} onChange={(event) => setForm({ ...form, balance: event.target.value })} />
            </label>
          </div>
          <button className="primary" type="submit">{t.createAccount}</button>
        </form>

        <div className="panel list-panel">
          <h3>{t.accounts}</h3>
          {isLoading ? <p>{t.loading}</p> : data.map((account) => (
            <div key={account.id} className="list-item">
              <div>
                <strong>{account.name}</strong>
                <span>{formatAccountType(account.type)}</span>
              </div>
              <div className="money good">
                {Number(account.balance).toLocaleString('ru-RU', { style: 'currency', currency: account.currency })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

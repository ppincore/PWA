import { useState } from 'react';
import { formatCategoryType, t } from '../i18n';
import { useCreateCategoryMutation, useGetCategoriesQuery } from '../shared/api/api';

export function CategoriesPage() {
  const { data = [] } = useGetCategoriesQuery({});
  const [createCategory] = useCreateCategoryMutation();
  const [form, setForm] = useState({ name: '', type: 'EXPENSE' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createCategory({
      name: form.name,
      type: form.type as 'INCOME' | 'EXPENSE',
      icon: 'tag',
      color: '#8b5cf6',
    }).unwrap();
    setForm({ name: '', type: 'EXPENSE' });
  };

  return (
    <div className="page-stack">
      <div className="header-row">
        <div>
          <span className="eyebrow">{t.categories}</span>
          <h2>{t.incomeAndExpenses}</h2>
        </div>
      </div>

      <div className="two-column-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h3>{t.createCategory}</h3>
          <div className="form-grid">
            <label>
              {t.name}
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              {t.type}
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option value="EXPENSE">{t.expense}</option>
                <option value="INCOME">{t.income}</option>
              </select>
            </label>
          </div>
          <button className="primary" type="submit">{t.saveCategory}</button>
        </form>

        <div className="panel list-panel">
          <h3>{t.categories}</h3>
          {data.map((category) => (
            <div key={category.id} className="list-item">
              <div>
                <strong>{category.name}</strong>
                <span>{formatCategoryType(category.type)}</span>
              </div>
              <span className="chip">{formatCategoryType(category.type)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

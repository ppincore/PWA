import { useState } from 'react';
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
          <span className="eyebrow">Categories</span>
          <h2>Income and expenses</h2>
        </div>
      </div>

      <div className="two-column-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h3>Create category</h3>
          <div className="form-grid">
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              Type
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </label>
          </div>
          <button className="primary" type="submit">Save category</button>
        </form>

        <div className="panel list-panel">
          <h3>Categories</h3>
          {data.map((category) => (
            <div key={category.id} className="list-item">
              <div>
                <strong>{category.name}</strong>
                <span>{category.type}</span>
              </div>
              <span className="chip">{category.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

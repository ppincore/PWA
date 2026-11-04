import { useState } from 'react';
import { useLoginMutation, useRegisterMutation } from '../../shared/api/api';

export function AuthPanel() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = { email: form.email, password: form.password, ...(isRegister ? { name: form.name } : {}) };

    try {
      const result = isRegister
        ? await register(payload as { name: string; email: string; password: string }).unwrap()
        : await login({ email: form.email, password: form.password }).unwrap();

      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">Finance</span>
          <h1>{isRegister ? 'Create account' : 'Welcome back'}</h1>
          <p>{isRegister ? 'Start tracking your cash flow.' : 'Sign in to your personal finance dashboard.'}</p>
        </div>
        <div className="tab-row">
          <button className={!isRegister ? 'active' : ''} type="button" onClick={() => setIsRegister(false)}>
            Login
          </button>
          <button className={isRegister ? 'active' : ''} type="button" onClick={() => setIsRegister(true)}>
            Register
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
          )}

          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>

          <label>
            Password
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </label>

          <button className="primary" type="submit" disabled={isRegisterLoading || isLoginLoading}>
            {isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

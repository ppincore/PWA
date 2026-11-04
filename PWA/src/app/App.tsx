import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { LogOut, LayoutDashboard, PiggyBank, ReceiptText, Tags, BarChart3, UserCircle } from 'lucide-react';
import { AuthPanel } from '../features/auth/AuthPanel';
import { AccountsPage } from '../pages/AccountsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { TransactionsPage } from '../pages/TransactionsPage';

function Shell({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  };

  if (!token) {
    return <AuthPanel />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-mark">F</div>
          <div>
            <strong>Finance</strong>
            <span>Personal dashboard</span>
          </div>
        </div>

        <nav className="nav-list">
          <NavLink to="/" end>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/accounts">
            <PiggyBank size={18} /> Accounts
          </NavLink>
          <NavLink to="/transactions">
            <ReceiptText size={18} /> Operations
          </NavLink>
          <NavLink to="/categories">
            <Tags size={18} /> Categories
          </NavLink>
          <NavLink to="/analytics">
            <BarChart3 size={18} /> Analytics
          </NavLink>
          <NavLink to="/profile">
            <UserCircle size={18} /> Profile
          </NavLink>
        </nav>

        <button className="logout-button" type="button" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <main className="content-area">{children}</main>
    </div>
  );
}

export function App() {
  const token = localStorage.getItem('accessToken');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Shell>
              {token ? <DashboardPage /> : <Navigate to="/auth" replace />}
            </Shell>
          }
        />
        <Route path="/auth" element={token ? <Navigate to="/" replace /> : <AuthPanel />} />
        <Route path="/accounts" element={<Shell><AccountsPage /></Shell>} />
        <Route path="/transactions" element={<Shell><TransactionsPage /></Shell>} />
        <Route path="/categories" element={<Shell><CategoriesPage /></Shell>} />
        <Route path="/analytics" element={<Shell><AnalyticsPage /></Shell>} />
        <Route path="/profile" element={<Shell><ProfilePage /></Shell>} />
      </Routes>
    </BrowserRouter>
  );
}

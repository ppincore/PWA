import { useGetMeQuery } from '../shared/api/api';

export function ProfilePage() {
  const { data } = useGetMeQuery();

  return (
    <div className="page-stack">
      <div className="header-row">
        <div>
          <span className="eyebrow">Profile</span>
          <h2>Account details</h2>
        </div>
      </div>

      <div className="panel profile-card">
        <h3>{data?.name ?? 'User'}</h3>
        <p>{data?.email ?? 'email@example.com'}</p>
        <div className="meta-grid">
          <div>
            <span>Member since</span>
            <strong>Now</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>Active</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

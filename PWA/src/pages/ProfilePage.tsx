import { t } from '../i18n';
import { useGetMeQuery } from '../shared/api/api';

export function ProfilePage() {
  const { data } = useGetMeQuery();

  return (
    <div className="page-stack">
      <div className="header-row">
        <div>
          <span className="eyebrow">{t.profile}</span>
          <h2>{t.accountDetails}</h2>
        </div>
      </div>

      <div className="panel profile-card">
        <h3>{data?.name ?? t.user}</h3>
        <p>{data?.email ?? 'email@example.com'}</p>
        <div className="meta-grid">
          <div>
            <span>{t.memberSince}</span>
            <strong>{t.now}</strong>
          </div>
          <div>
            <span>{t.status}</span>
            <strong>{t.active}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

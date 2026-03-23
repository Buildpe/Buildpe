import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Wrench, Tag, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { getStats, getAllCategories, getAllServices } from '../../Services/adminAPI';
import { Loading } from './shared/index';

function StatCard({ Icon, label, value, color, loading }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ background: `${color}1a` }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value">
          {loading
            ? <Loader2 size={20} className="spin" style={{ color: '#9ca3af' }} />
            : (value ?? '—')}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats,   setStats]   = useState(null);
  const [counts,  setCounts]  = useState({ services: null, categories: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const s = await getStats().catch(() => null);
      setStats(s);
      const [cats, svcs] = await Promise.all([
        getAllCategories().catch(() => []),
        getAllServices().catch(() => []),
      ]);
      setCounts({ categories: cats.length, services: svcs.length });
      setLoading(false);
    };
    fetchAll();
  }, []);

  const quickLinks = [
    { label: 'Manage Users',      icon: Users,  path: '/admin/users',      color: '#2563eb' },
    { label: 'Manage Services',   icon: Wrench, path: '/admin/services',   color: '#ea580c' },
    { label: 'Manage Categories', icon: Tag,    path: '/admin/categories', color: '#EC1940' },
  ];

  return (
    <AdminLayout activeKey="dashboard">
      {/* Main stat cards */}
      <div className="stat-grid">
        <StatCard Icon={Users}      label="Total Users"      value={stats?.totalUsers}  color="#2563eb" loading={loading} />
        <StatCard Icon={TrendingUp} label="Active Users"     value={stats?.activeUsers} color="#16a34a" loading={loading} />
        <StatCard Icon={Wrench}     label="Total Services"   value={counts.services}    color="#ea580c" loading={loading} />
        <StatCard Icon={Tag}        label="Total Categories" value={counts.categories}  color="#EC1940" loading={loading} />
      </div>

      {/* Detailed breakdown */}
      {stats && (
        <>
          <p className="section-label">Detailed Breakdown</p>
          <div className="mini-grid" style={{ marginBottom: 24 }}>
            {[
              { label: 'Locked Accounts', value: stats.lockedAccounts,                  color: '#dc2626' },
              { label: 'Admin Users',     value: stats.usersByRole?.ADMIN ?? 0,         color: '#7c3aed' },
              { label: 'Regular Users',   value: stats.usersByRole?.USER ?? 0,          color: '#2563eb' },
              { label: 'Google Auth',     value: stats.usersByAuthProvider?.GOOGLE ?? 0, color: '#4285F4' },
              { label: 'Local Auth',      value: stats.usersByAuthProvider?.LOCAL ?? 0,  color: '#6b7280' },
            ].map(s => (
              <div key={s.label} className="mini-card">
                <div className="mini-card__label">{s.label}</div>
                <div className="mini-card__value" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Recent logins — uses "status" and "loginTime" fields */}
          {stats.recentLogins?.length > 0 && (
            <>
              <p className="section-label">Recent Login Activity</p>
              <div className="card" style={{ marginBottom: 24 }}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Status</th>
                        <th>IP Address</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentLogins.map((r, i) => (
                        <tr key={i}>
                          <td className="td-bold">{r.email}</td>
                          <td>
                            <span className={`badge badge-${r.status === 'SUCCESS' ? 'green' : 'red'}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="td-muted">{r.ipAddress || '—'}</td>
                          <td className="td-muted">
                            {r.loginTime ? new Date(r.loginTime).toLocaleString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Quick access */}
      <p className="section-label">Quick Access</p>
      <div className="quick-grid">
        {quickLinks.map(item => (
          <button key={item.path} className="quick-card" onClick={() => navigate(item.path)}>
            <div className="quick-card__left">
              <div className="quick-card__icon" style={{ background: `${item.color}1a` }}>
                <item.icon size={17} color={item.color} />
              </div>
              <span className="quick-card__label">{item.label}</span>
            </div>
            <ChevronRight size={15} color="#9ca3af" />
          </button>
        ))}
      </div>
    </AdminLayout>
  );
}
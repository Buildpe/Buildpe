import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Wrench, Tag, LogOut, ArrowLeft, ChevronRight, Zap } from 'lucide-react';
import { tokenStorage, logoutUser } from '../../Services/Authapi';
import { getAdminRole } from './adminAuth';
import './admin.css';

const NAV = [
  { key: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, path: '/admin' },
  { key: 'users',      label: 'Users',       icon: Users,           path: '/admin/users' },
  { key: 'services',   label: 'Services',    icon: Wrench,          path: '/admin/services' },
  { key: 'categories', label: 'Categories',  icon: Tag,             path: '/admin/categories' },
  { key: 'deals',      label: 'Deals',       icon: Zap,             path: '/admin/deals' },
];

export default function AdminLayout({ children, activeKey }) {
  const navigate = useNavigate();

  useEffect(() => {
    const role = getAdminRole();
    if (!tokenStorage.isLoggedIn() || role !== 'ADMIN') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      tokenStorage.clearTokens();
    }
    navigate('/login');
  };

  const active = NAV.find(n => n.key === activeKey) ?? NAV[0];

  return (
    <div className="admin-layout">
      {/* ── Sidebar ─── */}
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <LayoutDashboard size={17} color="#fff" />
          </div>
          <div>
            <div className="sidebar__name">BuildPE</div>
            <div className="sidebar__sub">Admin Panel</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section">Main Menu</div>
          {NAV.map(item => (
            <button
              key={item.key}
              className={`nav-item${activeKey === item.key ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <a href="/" className="sidebar__back">
            <ArrowLeft size={14} /> Back to Site
          </a>
          <button className="sidebar__logout" onClick={handleLogout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ─── */}
      <main className="admin-main">
        <header className="topbar">
          <span className="topbar__title">{active.label}</span>
          <div className="topbar__crumb">
            <span>BuildPE</span>
            <ChevronRight size={12} />
            <span className="topbar__crumb-active">{active.label}</span>
          </div>
        </header>
        <div className="page-body">{children}</div>
      </main>
    </div>
  );
}
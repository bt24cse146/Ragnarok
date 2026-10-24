import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Bot, ChevronDown, CircleHelp, Clock3, LayoutDashboard, LogOut, Settings2 } from 'lucide-react';
import Brand from '../components/Brand';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/agent', label: 'Agent workspace', icon: Bot },
  { to: '/app/history', label: 'Run history', icon: Clock3 },
];

const pageTitles = {
  '/app': 'Overview',
  '/app/agent': 'Agent workspace',
  '/app/history': 'Run history',
  '/app/settings': 'Settings',
};

export default function AppLayout() {
  const { user, signOutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'Workspace';
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Your account';
  const initial = displayName.charAt(0).toUpperCase();

  async function handleSignOut() {
    await signOutUser();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand-wrap"><Brand /></div>
        <div className="workspace-switcher">
          <span className="workspace-icon"><Activity size={17} /></span>
          <span className="workspace-copy"><strong>Hackathon project</strong><small>Personal workspace</small></span>
          <ChevronDown size={15} className="muted-icon" />
        </div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {to === '/app/agent' && <span className="nav-key">↵</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="nav-caption">PREFERENCES</div>
          <NavLink to="/app/settings" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
            <Settings2 size={18} strokeWidth={1.8} /><span>Settings</span>
          </NavLink>
          <a className="nav-link support-link" href="mailto:support@example.com">
            <CircleHelp size={18} strokeWidth={1.8} /><span>Help & support</span>
          </a>
          <div className="sidebar-footer">
            <div className="avatar">{initial}</div>
            <div className="account-copy"><strong>{displayName}</strong><span>{user?.email}</span></div>
            <button className="icon-button signout-button" onClick={handleSignOut} aria-label="Sign out" title="Sign out"><LogOut size={17} /></button>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumb"><span>Relay</span><span className="breadcrumb-separator">/</span><strong>{title}</strong></div>
          <div className="topbar-right">
            <span className="system-status"><span className="status-dot" />Workspace ready</span>
            <div className="topbar-avatar" title={displayName}>{initial}</div>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}

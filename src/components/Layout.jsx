import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiSearch, FiBell, FiMenu, FiChevronLeft } from 'react-icons/fi';
import { useStream } from '../context/StreamContext';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import NotificationPopup from './NotificationPopup';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isChannelPage = location.pathname.startsWith('/channel/');

  const { liveStreams } = useStream();

  if (isChannelPage) {
    return (
      <div className="app-layout">
        <Topbar />
        <div style={{ marginTop: 'var(--nz-topbar-h)' }}>
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Topbar />
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} streamers={liveStreams} />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

function Topbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="topbar nz-glass">
      <div className="topbar-left">
        <Link to="/" className="topbar-logo">NAZE</Link>
        <Link to="/browse" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--nz-text-muted)' }}>Browse</Link>
      </div>
      <div className="topbar-center">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input className="nz-input" placeholder="Search streams, games, channels..." style={{ paddingLeft: 40, borderRadius: 24 }} />
        </div>
      </div>
      <div className="topbar-right">
        {isAuthenticated ? (
          <>
            <NotificationPopup />
            <UserMenu />
          </>
        ) : (
          <>
            <Link to="/login" className="nz-btn nz-btn-secondary nz-btn-sm">Log In</Link>
            <Link to="/signup" className="nz-btn nz-btn-primary nz-btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}

function Sidebar({ collapsed, onToggle, streamers }) {
  const { isAuthenticated, user, isFollowing } = useAuth();

  const followedStreamers = isAuthenticated
    ? streamers.filter((s) => isFollowing(s.username))
    : [];

  const recommendedStreamers = streamers.filter(
    (s) => !followedStreamers.find((f) => f.username === s.username)
  ).slice(0, 5);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
        {collapsed ? <FiMenu /> : <FiChevronLeft />}
      </button>

      {isAuthenticated && followedStreamers.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">Followed Channels</div>
          {followedStreamers.map((s) => (
            <Link key={s.id || s.username} to={`/channel/${s.username}`} className="sidebar-item">
              <img src={s.avatarUrl} alt={s.username} className="avatar-placeholder" style={{ objectFit: 'cover' }} />
              <div className="item-info">
                <div className="item-name">{s.username}</div>
                <div className="item-game">{s.category}</div>
              </div>
              <div className="item-viewers">
                <span className="nz-live-dot" /> {s.viewers}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="sidebar-section">
        <div className="sidebar-section-title">Recommended</div>
        {recommendedStreamers.map((s) => (
          <Link key={s.id || s.username} to={`/channel/${s.username}`} className="sidebar-item">
            <img src={s.avatarUrl} alt={s.username} className="avatar-placeholder" style={{ objectFit: 'cover' }} />
            <div className="item-info">
              <div className="item-name">{s.username}</div>
              <div className="item-game">{s.category}</div>
            </div>
            <div className="item-viewers">
              <span className="nz-live-dot" /> {s.viewers}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

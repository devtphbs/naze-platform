import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiHeart, FiVideo, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <div className="user-menu-wrapper" ref={ref}>
      {user?.avatarUrl ? (
        <img 
          src={user.avatarUrl} 
          className="user-avatar" 
          onClick={() => setOpen(!open)} 
          style={{ objectFit: 'cover', cursor: 'pointer' }} 
        />
      ) : (
        <div
          className="user-avatar"
          onClick={() => setOpen(!open)}
          title={user?.displayName || 'User'}
        >
          {(user?.displayName || 'U')[0].toUpperCase()}
        </div>
      )}
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 150 }}
            onClick={() => setOpen(false)}
          />
          <div className="user-menu-dropdown nz-glass">
            <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid var(--nz-border)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.displayName}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--nz-text-dim)' }}>@{user?.username}</div>
            </div>
            <div style={{ padding: '6px 0' }}>
              <Link to="/following" onClick={() => setOpen(false)}>
                <FiHeart /> Following
              </Link>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                <FiActivity /> Dashboard
              </Link>
              <Link to="/settings" onClick={() => setOpen(false)}>
                <FiSettings /> Settings
              </Link>
              <div className="menu-divider" />
              <button onClick={handleLogout}>
                <FiLogOut /> Log Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

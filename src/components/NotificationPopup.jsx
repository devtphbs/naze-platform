import { useState, useRef } from 'react';
import { FiBell, FiCheckCircle, FiInfo, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function NotificationPopup() {
  const { user, updateProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const notifications = user?.notifications || [];
  const unreadCount = notifications.filter(n => n.active).length;

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, active: false }));
    updateProfile({ notifications: updated });
  };

  return (
    <div className="notif-wrapper" ref={ref}>
      <button 
        className="nz-btn-icon" 
        onClick={() => setOpen(!open)}
        style={{ position: 'relative' }}
        title="Notifications"
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="notif-badge" style={{
            position: 'absolute',
            top: -2,
            right: -2,
            background: 'var(--nz-red)',
            color: '#fff',
            fontSize: '10px',
            width: 16,
            height: 16,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            border: '2px solid var(--nz-bg-secondary)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 150 }}
            onClick={() => setOpen(false)}
          />
          <div className="notif-dropdown nz-glass animate-fade-in" style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            width: 320,
            background: 'var(--nz-bg-secondary)',
            borderRadius: 'var(--nz-radius-md)',
            border: '1px solid var(--nz-border)',
            boxShadow: 'var(--nz-shadow-lg)',
            zIndex: 160,
            padding: '12px 0',
            maxHeight: 480,
            overflowY: 'auto'
          }}>
            <div style={{ padding: '0 16px 12px', borderBottom: '1px solid var(--nz-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</span>
              <button 
                style={{ background: 'none', border: 'none', color: 'var(--nz-accent-light)', fontSize: '0.75rem', cursor: 'pointer' }}
                onClick={markAllRead}
              >
                Mark all as read
              </button>
            </div>

            <div className="notif-list">
              {notifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--nz-text-dim)', fontSize: '0.85rem' }}>
                  No new notifications.
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`notif-item ${n.active ? 'active' : ''}`} style={{
                    padding: '12px 16px',
                    display: 'flex',
                    gap: 12,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    background: n.active ? 'rgba(168, 85, 247, 0.05)' : 'transparent',
                    borderLeft: n.active ? '3px solid var(--nz-accent)' : '3px solid transparent'
                  }}>
                    <div className="notif-icon" style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'var(--nz-bg-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', color: n.type === 'live' ? 'var(--nz-cyan)' : 'var(--nz-accent-light)'
                    }}>
                      {n.type === 'live' ? <FiVideo /> : (n.type === 'system' ? <FiCheckCircle /> : <FiUser />)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.82rem', lineHeight: 1.4, color: 'var(--nz-text)' }}>
                        {n.user && <strong style={{ color: 'var(--nz-accent-light)' }}>{n.user} </strong>}
                        {n.text}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--nz-text-dim)', marginTop: 4 }}>{n.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '12px 16px 0', borderTop: '1px solid var(--nz-border)', textAlign: 'center' }}>
              <Link to="/settings" style={{ fontSize: '0.8rem', color: 'var(--nz-accent-light)' }} onClick={() => setOpen(false)}>
                Notification Settings
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FiVideo() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m16 13 5.26 3.16A1 1 0 0 0 23 15.3V8.7a1 1 0 0 0-1.74-.84L16 11V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2z"></path></svg>
  );
}

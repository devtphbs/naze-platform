import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';

export default function FollowingPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="animate-fade" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ marginBottom: 12 }}>Log in to see your followed channels</h2>
        <p style={{ color: 'var(--nz-text-muted)', marginBottom: 24 }}>
          Follow your favorite streamers to keep track of when they go live.
        </p>
        <Link to="/login" className="nz-btn nz-btn-primary">Log In</Link>
      </div>
    );
  }

  const { liveStreams } = useStream();

  const followedIds = user?.following || [];
  const live = liveStreams.filter((s) => followedIds.includes(s.username));
  const offlineIds = followedIds.filter((id) => !live.some(s => s.username === id));

  return (
    <div className="animate-fade">
      <h1 style={{ fontSize: '1.6rem', marginBottom: 24 }}>Following</h1>

      {followedIds.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--nz-text-dim)' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>You're not following anyone yet.</p>
          <p>Browse streams and follow your favorites!</p>
          <Link to="/browse" className="nz-btn nz-btn-primary" style={{ marginTop: 20 }}>Browse Streams</Link>
        </div>
      ) : (
        <>
          {live.length > 0 && (
            <>
              <h2 style={{ fontSize: '1rem', color: 'var(--nz-text-muted)', marginBottom: 12 }}>
                🔴 Live Now ({live.length})
              </h2>
              <div className="following-list" style={{ marginBottom: 32 }}>
                {live.map((s) => (
                  <Link key={s.id || s.username} to={`/channel/${s.username}`} className="following-item">
                    <img src={s.avatarUrl} alt={s.username} className="f-avatar" style={{ objectFit: 'cover' }} />
                    <div className="f-info">
                      <div className="f-name">{s.username}</div>
                      <div className="f-game">{s.title}</div>
                    </div>
                    <div className="f-status live">
                      <span className="nz-live-dot" /> {s.viewers}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {offlineIds.length > 0 && (
            <>
              <h2 style={{ fontSize: '1rem', color: 'var(--nz-text-muted)', marginBottom: 12 }}>
                Offline ({offlineIds.length})
              </h2>
              <div className="following-list">
                {offlineIds.map((id) => (
                  <Link key={id} to={`/channel/${id}`} className="following-item">
                    <div className="f-avatar" style={{ background: 'var(--nz-bg-tertiary)', opacity: 0.5 }}>{id[0]?.toUpperCase()}</div>
                    <div className="f-info">
                      <div className="f-name" style={{ opacity: 0.6 }}>{id}</div>
                      <div className="f-game">Last seen streaming recently</div>
                    </div>
                    <div className="f-status offline">Offline</div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

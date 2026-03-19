import { Link } from 'react-router-dom';
import { useStream } from '../context/StreamContext';
import StreamCard from '../components/StreamCard';
import CategoryCard from '../components/CategoryCard';
import VideoPlayer from '../components/VideoPlayer'; // Added VideoPlayer import

export default function HomePage() {
  const { liveStreams, categoryStats, loading } = useStream();

  // If we have live streams, use the first one as the hero
  const featuredStream = liveStreams.length > 0 ? liveStreams[0] : null;

  if (loading) {
    return (
      <div className="home-page animate-fade" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
        <h2>Loading streams...</h2>
      </div>
    );
  }
  const topCategories = categoryStats.length > 0 ? categoryStats.slice(0, 8) : [
    { id: '1', name: 'Just Chatting', emoji: '💬', viewers: 0 },
    { id: '2', name: 'League of Legends', emoji: '⚔️', viewers: 0 },
    { id: '3', name: 'Valorant', emoji: '🎯', viewers: 0 },
    { id: '4', name: 'Minecraft', emoji: '🟫', viewers: 0 },
  ];

  const formatStats = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="animate-fade">
      {/* Hero Banner */}
      {featuredStream ? (
          <div className="hero-banner nz-card animate-slide-up">
            <div className="hero-video-wrapper">
              <VideoPlayer 
                streamKey={featuredStream.streamKey} 
                isLive={true} 
              />
              <div className="hero-overlay">
                <div className="nz-badge nz-badge-live">LIVE</div>
                <div className="hero-info">
                  <h2>{featuredStream.title}</h2>
                  <div className="hero-meta">
                    <span className="hero-streamer">{featuredStream.username}</span>
                    <span className="hero-game">{featuredStream.category}</span>
                    <span className="hero-viewers">
                      <span className="nz-live-dot"></span>
                      {featuredStream.viewers} viewers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hero-banner nz-card animate-slide-up" style={{ padding: '60px', textAlign: 'center', background: 'var(--nz-bg-secondary)' }}>
            <h2>Welcome to Naze</h2>
            <p style={{ color: 'var(--nz-text-muted)', marginTop: '8px' }}>No one is currently live. Start streaming from OBS to see your channel here!</p>
          </div>
        )}

      {/* Live Channels */}
      <div className="section-header">
        <h2>🔴 Live Channels</h2>
        <Link to="/browse">See All</Link>
      </div>
      {liveStreams.length === 0 ? (
        <p style={{ color: 'var(--nz-text-muted)' }}>Check back later for live content.</p>
      ) : (
        <div className="stream-grid">
          {liveStreams.map((stream, idx) => (
            <div key={stream.id || idx} className="animate-fade" style={{ animationDelay: `${idx * 0.1}s` }}>
              <StreamCard 
                streamer={stream.username}
                title={stream.title}
                game={stream.category}
                viewers={stream.viewers}
                avatarUrl={stream.avatarUrl}
              />
            </div>
          ))}
        </div>
      )}

      {/* Categories */}
      <div className="section-header">
        <h2>🎮 Top Categories</h2>
        <Link to="/browse">Browse All</Link>
      </div>
      <div className="category-grid">
        {topCategories.map((c) => (
          <div key={c.name || c.id} className="category-card nz-card">
            <div className="cat-art">{c.emoji || '🎮'}</div>
            <div className="cat-info">
              <div className="cat-name">{c.name}</div>
              <div className="cat-viewers">{formatStats(c.viewers)} Viewers</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended */}
      <div className="section-header">
        <h2>✨ Recommended for You</h2>
      </div>
      <div className="stream-grid">
        {liveStreams.slice(1, 5).map((stream, idx) => (
          <div key={`rec-${stream.id || idx}`} className="animate-fade" style={{ animationDelay: `${idx * 0.1}s` }}>
            <StreamCard 
              streamer={stream.username}
              title={stream.title}
              game={stream.category}
              viewers={stream.viewers}
              avatarUrl={stream.avatarUrl}
            />
          </div>
        ))}
        {liveStreams.length <= 1 && (
          <p style={{ color: 'var(--nz-text-muted)' }}>Explore more content as new streamers go live.</p>
        )}
      </div>
    </div>
  );
}

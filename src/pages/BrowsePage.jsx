import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StreamCard from '../components/StreamCard';
import { useStream } from '../context/StreamContext';

export default function BrowsePage() {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'categories'
  const [sortBy, setSortBy] = useState('viewers');
  const { liveStreams, categoryStats } = useStream();

  const sortedStreams = [...liveStreams].sort((a, b) => {
    if (sortBy === 'viewers') return b.viewers - a.viewers;
    if (sortBy === 'newest') return new Date(b.startTime) - new Date(a.startTime);
    return 0;
  });

  return (
    <div className="animate-fade">
      <h1 style={{ fontSize: '1.6rem', marginBottom: 24 }}>Browse</h1>

      <div className="browse-header">
        <div className="browse-tabs">
          <button
            className={`nz-btn nz-btn-sm ${activeTab === 'live' ? 'nz-btn-primary' : 'nz-btn-secondary'}`}
            onClick={() => setActiveTab('live')}
          >
            Live Streams
          </button>
          <button
            className={`nz-btn nz-btn-sm ${activeTab === 'categories' ? 'nz-btn-primary' : 'nz-btn-secondary'}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
        </div>
        <div className="filters-right">
          <div className="sort-dropdown">
            <label>Sort by:</label>
            <select 
              className="nz-input" 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="viewers">Viewers (High to Low)</option>
              <option value="newest">Recently Started</option>
            </select>
          </div>
        </div>
      </div>

      {activeTab === 'live' && (
        <div className="browse-content animate-fade">
          {sortedStreams.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--nz-text-muted)' }}>
              <h3>No channels are currently live.</h3>
              <p>Start your streaming software and connect to the RTMP server!</p>
            </div>
          ) : (
            <div className="stream-grid">
              {sortedStreams.map((stream, idx) => (
                <StreamCard 
                  key={stream.id || idx}
                  streamer={stream.username}
                  title={stream.title}
                  game={stream.category}
                  viewers={stream.viewers}
                  avatarUrl={stream.avatarUrl}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="browse-content animate-fade">
          {categoryStats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--nz-text-muted)' }}>
              <h3>No categories found.</h3>
              <p>Categories appear once streamers start broadcasting!</p>
            </div>
          ) : (
            <div className="category-grid">
              {categoryStats.map((c) => (
                <div key={c.name} className="category-card nz-card">
                  <div className="cat-art">{c.emoji || '🎮'}</div>
                  <div className="cat-info">
                    <div className="cat-name">{c.name}</div>
                    <div className="cat-viewers">
                      {c.viewers >= 1000 ? (c.viewers / 1000).toFixed(1) + 'K' : c.viewers} Viewers
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

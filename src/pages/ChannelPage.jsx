import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiHeart, FiStar, FiShare2, FiFlag, FiScissors, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';
import VideoPlayer from '../components/VideoPlayer';
import ChatPanel from '../components/ChatPanel';
import DonateModal from '../components/DonateModal';
import SubscribeModal from '../components/SubscribeModal';

const formatViewers = (count) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
};

export default function ChannelPage() {
  const { id } = useParams(); // Using routing id as username/streamKey
  const { liveStreams } = useStream();
  const { isAuthenticated, isFollowing, toggleFollow } = useAuth();
  
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  // See if they are currently live
  const liveStream = liveStreams.find((s) => s.username.toLowerCase() === id.toLowerCase());
  const isLive = !!liveStream;
  const following = isAuthenticated && isFollowing(id);

  // Find streamer info in registry
  const registry = JSON.parse(localStorage.getItem('naze_user_registry') || '{}');
  const streamerRegistryInfo = registry[id] || {};

  // Either use live data or fallback to offline props
  const channelData = liveStream ? {
    ...liveStream,
    displayName: streamerRegistryInfo.displayName || liveStream.username,
    merchLink: streamerRegistryInfo.merchLink || '',
    bio: streamerRegistryInfo.bio || `Welcome to ${id}'s channel!`,
  } : {
    username: id,
    displayName: streamerRegistryInfo.displayName || id,
    title: 'Offline',
    category: 'Unknown',
    viewers: 0,
    followers: 1337,
    bio: streamerRegistryInfo.bio || `Welcome to ${id}'s channel!`,
    merchLink: streamerRegistryInfo.merchLink || '',
    tags: ['Gaming', 'Chill'],
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`
  };

  return (
    <div className="channel-layout">
      <div className="channel-main">
        {/* Video Player */}
        <VideoPlayer 
          streamKey={channelData.username} 
          isLive={isLive} 
          posterUrl={channelData.avatarUrl}
        />

        {/* Channel Info */}
        <div className="channel-info">
          <div className="channel-header">
            <img src={channelData.avatarUrl} alt={channelData.displayName} className="channel-avatar-lg" />
            <div className="channel-details">
              <div className="channel-name">
                {channelData.displayName || channelData.username}
                {isLive && <FiCheckCircle className="verified" />}
              </div>
              <div className="channel-stream-title">{channelData.title}</div>
              <div className="channel-meta">
                <span>{channelData.category}</span>
                {isLive && (
                  <>
                    <span>•</span>
                    <span style={{ color: 'var(--nz-red)' }}>{formatViewers(channelData.viewers)} viewers</span>
                  </>
                )}
              </div>
            </div>
            <div className="channel-actions">
              {isAuthenticated && (
                <>
                  <button
                    className={`nz-btn ${following ? 'nz-btn-secondary' : 'nz-btn-follow'}`}
                    onClick={() => toggleFollow(channelData.username)}
                  >
                    <FiHeart /> {following ? 'Following' : 'Follow'}
                  </button>
                  <button 
                    className="nz-btn nz-btn-subscribe"
                    onClick={() => setIsSubscribeOpen(true)}
                  >
                    <FiStar /> Subscribe
                  </button>
                  <button 
                    className="nz-btn nz-btn-primary"
                    onClick={() => setIsDonateOpen(true)}
                  >
                    Donate
                  </button>
                  {channelData.merchLink && (
                    <a 
                      href={channelData.merchLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="nz-btn nz-btn-secondary"
                    >
                      Merch Store
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="channel-tags">
            {channelData.tags && channelData.tags.map((tag) => (
              <span key={tag} className="nz-badge nz-badge-category">{tag}</span>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="nz-btn nz-btn-secondary nz-btn-sm">
              <FiScissors /> Clip
            </button>
            <button className="nz-btn nz-btn-secondary nz-btn-sm">
              <FiShare2 /> Share
            </button>
            <button className="nz-btn nz-btn-secondary nz-btn-sm" style={{ marginLeft: 'auto' }}>
              <FiFlag /> Report
            </button>
          </div>

          {/* About */}
          <div className="channel-about">
            <h3>About {channelData.displayName || channelData.username}</h3>
            <p>{channelData.bio}</p>
            <div className="channel-stats">
              <div className="channel-stat">
                <div className="stat-val">{formatViewers(channelData.followers)}</div>
                <div className="stat-label">Followers</div>
              </div>
              {isLive && (
                <div className="channel-stat">
                  <div className="stat-val">{formatViewers(channelData.viewers)}</div>
                  <div className="stat-label">Viewers</div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Support Widget */}
          <div className="support-widget nz-card" style={{ marginTop: 24, padding: 16 }}>
            <h4 style={{ marginBottom: 12, fontSize: '0.9rem', color: 'var(--nz-accent-light)' }}>Recent Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--nz-text)' }}>Hildi</span>
                <span style={{ color: 'var(--nz-cyan)' }}>Subscribed!</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--nz-text)' }}>Naze_Fan</span>
                <span style={{ color: 'var(--nz-lightblue)' }}>Donated $10.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--nz-text)' }}>Gamer123</span>
                <span style={{ color: 'var(--nz-accent-light)' }}>Gifted 5 Subs!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <ChatPanel channelName={channelData.username} />
      
      {/* Modals */}
      <DonateModal 
        isOpen={isDonateOpen} 
        onClose={() => setIsDonateOpen(false)} 
        streamerName={channelData.username} 
      />
      <SubscribeModal 
        isOpen={isSubscribeOpen} 
        onClose={() => setIsSubscribeOpen(false)} 
        streamerName={channelData.username} 
      />
    </div>
  );
}

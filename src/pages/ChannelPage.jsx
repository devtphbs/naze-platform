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
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'bounties' | 'about'

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
    avatarUrl: streamerRegistryInfo.avatarUrl || liveStream.avatarUrl,
    merchLink: streamerRegistryInfo.merchLink || '',
    bio: streamerRegistryInfo.bio || `Welcome to ${id}'s channel!`,
    themeColor: streamerRegistryInfo.themeColor || '#a855f7',
    activeWidgets: streamerRegistryInfo.activeWidgets || [],
    isLive: true
  } : {
    username: id,
    displayName: streamerRegistryInfo.displayName || id,
    avatarUrl: streamerRegistryInfo.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    viewers: 0,
    category: 'Just Chatting',
    title: 'Offline',
    bio: streamerRegistryInfo.bio || `This streamer hasn't set a bio yet.`,
    merchLink: streamerRegistryInfo.merchLink || '',
    themeColor: streamerRegistryInfo.themeColor || '#a855f7',
    activeWidgets: streamerRegistryInfo.activeWidgets || [],
    isLive: false
  };

  // Apply theme color
  const themeStyles = {
    '--nz-accent': streamerRegistryInfo.themeColor || '#a855f7',
    '--nz-accent-glow': `${streamerRegistryInfo.themeColor || '#a855f7'}44`,
    '--nz-accent-light': streamerRegistryInfo.themeColor || '#a855f7',
  };

  const activeWidgets = streamerRegistryInfo.activeWidgets || [];

  return (
    <div className="channel-layout animate-fade" style={themeStyles}>
      <div className="channel-main">
        {/* Widgets Overlay (Optional) */}
        {activeWidgets.includes('goal_bar') && (
          <div className="channel-widget widget-goal-bar nz-glass border-glow" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
              <span>Follower Goal</span>
              <span>1,245 / 1,500</span>
            </div>
            <div className="progress-bg" style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
              <div className="progress-fill" style={{ width: '83%', height: '100%', background: 'var(--nz-accent)', boxShadow: '0 0 10px var(--nz-accent)' }} />
            </div>
          </div>
        )}

        {/* Video Player */}
        <VideoPlayer 
          streamKey={channelData.username} 
          isLive={isLive} 
          posterUrl={channelData.avatarUrl}
        />

        {/* Channel Info */}
        <div className="channel-info">
          <div className="channel-header">
            <div style={{ position: 'relative' }}>
              <img src={channelData.avatarUrl} alt={channelData.displayName} className="channel-avatar-lg" />
              {channelData.isLive && <div className="live-tag">LIVE</div>}
            </div>
            <div className="channel-details">
              <div className="channel-name">
                {channelData.displayName || channelData.username}
                {channelData.isLive && <FiCheckCircle className="verified" />}
              </div>
              <div className="channel-stream-title">{channelData.title}</div>
              <div className="channel-meta">
                <span>{channelData.category}</span>
                {channelData.isLive && (
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

          {/* Tabs */}
          <div className="channel-tabs" style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--nz-border)', marginBottom: 20, marginTop: 24 }}>
            <button 
              className={`channel-tab ${activeTab === 'home' ? 'active' : ''}`} 
              onClick={() => setActiveTab('home')}
              style={{ padding: '8px 0', borderBottom: activeTab === 'home' ? '2px solid var(--nz-accent)' : 'none', background: 'none', color: activeTab === 'home' ? 'var(--nz-text)' : 'var(--nz-text-dim)', fontWeight: 600, cursor: 'pointer' }}
            >
              Home
            </button>
            <button 
              className={`channel-tab ${activeTab === 'bounties' ? 'active' : ''}`} 
              onClick={() => setActiveTab('bounties')}
              style={{ padding: '8px 0', borderBottom: activeTab === 'bounties' ? '2px solid var(--nz-accent)' : 'none', background: 'none', color: activeTab === 'bounties' ? 'var(--nz-text)' : 'var(--nz-text-dim)', fontWeight: 600, cursor: 'pointer' }}
            >
              Bounties
            </button>
            <button 
              className={`channel-tab ${activeTab === 'about' ? 'active' : ''}`} 
              onClick={() => setActiveTab('about')}
              style={{ padding: '8px 0', borderBottom: activeTab === 'about' ? '2px solid var(--nz-accent)' : 'none', background: 'none', color: activeTab === 'about' ? 'var(--nz-text)' : 'var(--nz-text-dim)', fontWeight: 600, cursor: 'pointer' }}
            >
              About
            </button>
          </div>

          {activeTab === 'home' && (
            <>
              {/* About Short */}
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
            </>
          )}

          {activeTab === 'about' && (
            <div className="channel-about-full animate-fade" style={{ padding: '10px 0' }}>
               <h3 style={{ marginBottom: 12 }}>Detailed Bio</h3>
               <p style={{ lineHeight: 1.6, color: 'var(--nz-text-muted)' }}>{channelData.bio || 'This streamer has not provided a detailed bio yet.'}</p>
               <div style={{ marginTop: 24, padding: 20, background: 'var(--nz-bg-secondary)', borderRadius: 'var(--nz-radius-md)' }}>
                  <h4 style={{ marginBottom: 8 }}>Channel Rules</h4>
                  <ul style={{ fontSize: '0.85rem', color: 'var(--nz-text-muted)', paddingLeft: 20 }}>
                    <li>Be respectful to others</li>
                    <li>No spamming or self-promotion</li>
                    <li>Have fun!</li>
                  </ul>
               </div>
            </div>
          )}

          {activeTab === 'bounties' && (
            <div className="channel-bounties-tab animate-fade">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: '1.2rem' }}>🎯 Active Channel Bounties</h3>
                <button className="nz-btn nz-btn-secondary nz-btn-sm">Propose Bounty</button>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                <div className="bounty-card nz-card border-glow" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--nz-accent-light)' }}>Win 3 games in a row</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--nz-text-muted)', marginTop: 4 }}>Currently attempted in: Valorant</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--nz-cyan)' }}>$50.00</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--nz-text-dim)' }}>Reward Pool</div>
                  </div>
                </div>
                <div className="bounty-card nz-card border-glow" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--nz-cyan)' }}>Use only a pistol this round</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--nz-text-muted)', marginTop: 4 }}>Proposed by: Naze_Fan_#1</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--nz-lightblue)' }}>50 Subs</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--nz-text-dim)' }}>Reward Pool</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Support Widget */}
          {activeWidgets.includes('recent_support') && (
            <div className="support-widget nz-card border-glow" style={{ marginTop: 24, padding: 16 }}>
              <h4 style={{ marginBottom: 12, fontSize: '0.9rem', color: 'var(--nz-accent)' }}>Recent Support</h4>
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
          )}

          {/* Bounty Board */}
          {activeWidgets.includes('bounty_board') && (
            <div className="bounty-widget nz-card border-glow" style={{ marginTop: 24, padding: 16 }}>
              <h4 style={{ marginBottom: 12, fontSize: '0.9rem', color: 'var(--nz-accent)' }}>Active Bounties</h4>
              <div style={{ display: 'grid', gap: 10 }}>
                <div className="bounty-item" style={{ padding: '8px 12px', background: 'var(--nz-bg-tertiary)', borderRadius: 'var(--nz-radius-sm)', borderLeft: '3px solid var(--nz-accent)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Win 3 games in a row</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--nz-text-muted)' }}>Reward: $50.00 Bounty</div>
                </div>
                <div className="bounty-item" style={{ padding: '8px 12px', background: 'var(--nz-bg-tertiary)', borderRadius: 'var(--nz-radius-sm)', borderLeft: '3px solid var(--nz-cyan)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Use only a pistol this round</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--nz-text-muted)' }}>Reward: 50 Gifted Subs</div>
                </div>
              </div>
            </div>
          )}
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

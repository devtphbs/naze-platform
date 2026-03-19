import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';
import { FiTrendingUp, FiUsers, FiActivity, FiZap, FiSettings, FiBarChart2, FiMessageSquare, FiEdit3, FiSave } from 'react-icons/fi';

export default function DashboardPage() {
  const { user, updateProfile } = useAuth();
  const { liveStreams } = useStream();
  
  // Local state for stream info editor
  const [streamTitle, setStreamTitle] = useState(user?.title || '');
  const [streamCategory, setStreamCategory] = useState(user?.category || 'Just Chatting');
  const [isSaving, setIsSaving] = useState(false);

  // Find current live info if active
  const liveInfo = liveStreams.find(s => s.username.toLowerCase() === user?.username?.toLowerCase());
  const stats = liveInfo?.stats || { bitrate: 0, fps: 0 };

  // Real-ish Analytics Data
  const followerData = [
    { day: 'Mon', value: 1150 },
    { day: 'Tue', value: 1180 },
    { day: 'Wed', value: 1170 },
    { day: 'Thu', value: 1210 },
    { day: 'Fri', value: 1235 },
    { day: 'Sat', value: 1242 },
    { day: 'Sun', value: 1248 },
  ];

  const maxVal = Math.max(...followerData.map(d => d.value));
  const minVal = Math.min(...followerData.map(d => d.value)) - 20;
  
  const generatePath = () => {
    const width = 800;
    const height = 200;
    const padding = 20;
    const usableHeight = height - padding * 2;
    const stepX = width / (followerData.length - 1);
    
    return followerData.map((d, i) => {
      const x = i * stepX;
      const y = height - padding - ((d.value - minVal) / (maxVal - minVal)) * usableHeight;
      return i === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');
  };

  const generateAreaPath = () => {
    const path = generatePath();
    return `${path} L800,200 L0,200 Z`;
  };

  const handleSaveMetadata = () => {
    setIsSaving(true);
    updateProfile({ title: streamTitle, category: streamCategory });
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="dashboard-container animate-fade" style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Creator Dashboard</h1>
          <p style={{ color: 'var(--nz-text-dim)', fontSize: '0.9rem' }}>Welcome back, {user?.displayName || user?.username}.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="nz-btn nz-btn-secondary"><FiSettings /> Stream Settings</button>
          <div className="nz-badge nz-badge-live" style={{ background: liveInfo ? 'var(--nz-red)' : 'var(--nz-text-dim)', animation: liveInfo ? 'pulse-live 2s infinite' : 'none' }}>
            {liveInfo ? 'LIVE' : 'OFFLINE'}
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<FiUsers />} label="Total Followers" value={followerData[6].value.toLocaleString()} trend="+12" color="var(--nz-purple)" />
        <StatCard icon={<FiActivity />} label="Current Viewers" value={liveInfo?.viewers || 0} trend={liveInfo ? 'Live' : '—'} color="var(--nz-cyan)" />
        <StatCard icon={<FiZap />} label="Live Bitrate" value={liveInfo ? `${stats.bitrate} kbps` : '0 kbps'} trend={liveInfo ? 'Real-time' : '—'} color="#10b981" />
        <StatCard icon={<FiActivity />} label="Live FPS" value={liveInfo ? stats.fps : 0} trend={liveInfo ? 'Stable' : '—'} color="var(--nz-sky)" />
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Main Analytics Area */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Metadata Editor */}
          <div className="nz-glass" style={{ padding: 24, borderRadius: 'var(--nz-radius-lg)', border: '1px solid var(--nz-border)' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 20 }}><FiEdit3 /> Stream Info Setup</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div className="form-group">
                <label className="nz-label">Stream Title</label>
                <input 
                  className="nz-input" 
                  value={streamTitle} 
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="Enter a catchy title..."
                />
              </div>
              <div className="form-group">
                <label className="nz-label">Category</label>
                <select 
                  className="nz-input" 
                  value={streamCategory} 
                  onChange={(e) => setStreamCategory(e.target.value)}
                >
                  <option>Just Chatting</option>
                  <option>League of Legends</option>
                  <option>Valorant</option>
                  <option>Minecraft</option>
                  <option>Creative</option>
                </select>
              </div>
            </div>
            
            <div style={{ padding: '16px', background: 'var(--nz-bg-tertiary)', borderRadius: 'var(--nz-radius-md)', marginBottom: 20, border: '1px solid var(--nz-border)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12 }}>OBS Connection Info</div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--nz-text-dim)' }}>Server URL: rtmp://localhost:1935/live</span>
                  <button onClick={() => navigator.clipboard.writeText('rtmp://localhost:1935/live')} className="nz-btn nz-btn-secondary nz-btn-xs" style={{ padding: '2px 8px', fontSize: '10px' }}>Copy</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--nz-text-dim)' }}>Stream Key: {user?.streamKey ? '•'.repeat(16) : 'None'}</span>
                  <button onClick={() => navigator.clipboard.writeText(user?.streamKey)} className="nz-btn nz-btn-secondary nz-btn-xs" style={{ padding: '2px 8px', fontSize: '10px' }}>Copy Key</button>
                </div>
              </div>
            </div>

            <button className="nz-btn nz-btn-primary" onClick={handleSaveMetadata} disabled={isSaving}>
              <FiSave /> {isSaving ? 'Saving...' : 'Update Live Info'}
            </button>
          </div>

          {/* Follower Growth Chart */}
          <div className="nz-glass" style={{ padding: 24, borderRadius: 'var(--nz-radius-lg)', border: '1px solid var(--nz-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.1rem' }}><FiBarChart2 /> Follower Growth (Last 7 Days)</h2>
              <select className="nz-input" style={{ width: 120, height: 32, fontSize: '0.8rem', padding: '0 8px' }}>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            <div className="analytics-chart" style={{ height: 250, position: 'relative', overflow: 'hidden' }}>
              <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--nz-accent)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--nz-accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={generateAreaPath()}
                  fill="url(#chartGradient)" 
                />
                <path 
                  d={generatePath()} 
                  fill="none" 
                  stroke="var(--nz-accent)" 
                  strokeWidth="3" 
                  className="chart-path"
                />
                {followerData.map((d, i) => {
                  const width = 800;
                  const height = 200;
                  const padding = 20;
                  const usableHeight = height - padding * 2;
                  const stepX = width / (followerData.length - 1);
                  const x = i * stepX;
                  const y = height - padding - ((d.value - minVal) / (maxVal - minVal)) * usableHeight;
                  return (
                    <g key={i} className="chart-dot-group">
                      <circle cx={x} cy={y} r="4" fill="var(--nz-accent)" />
                      <text x={x} y={y - 10} textAnchor="middle" fill="var(--nz-text-dim)" fontSize="10">{d.value}</text>
                    </g>
                  );
                })}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, color: 'var(--nz-text-muted)', fontSize: '0.75rem' }}>
                {followerData.map(d => <span key={d.day}>{d.day}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="nz-glass" style={{ padding: 20, borderRadius: 'var(--nz-radius-md)', border: '1px solid var(--nz-border)' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: 16 }}><FiMessageSquare /> Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <ActionButton label="Clear Chat" />
              <ActionButton label="Slow Mode" />
              <ActionButton label="Run Ad" />
              <ActionButton label="Start Poll" />
            </div>
          </div>

          <div className="nz-glass" style={{ padding: 20, borderRadius: 'var(--nz-radius-md)', border: '1px solid var(--nz-border)' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: 16 }}><FiActivity /> Browser Sources</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <CopyWidgetButton type="follower-goal" label="Follower Goal" user={user?.username} />
              <CopyWidgetButton type="alert" label="Alert Box" user={user?.username} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--nz-text-dim)', marginTop: 12 }}>
              Paste these URLs into OBS Browser Source.
            </p>
          </div>

          <div className="nz-glass" style={{ padding: 20, borderRadius: 'var(--nz-radius-md)', border: '1px solid var(--nz-border)' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: 16 }}><FiTrendingUp /> Top Clips</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--nz-text-muted)', textAlign: 'center', padding: '20px 0' }}>
              No clips created in the last 24 hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyWidgetButton({ type, label, user }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/widgets/${type}?user=${user}`;

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copy} className="nz-btn nz-btn-secondary nz-btn-sm" style={{ justifyContent: 'space-between', fontSize: '0.75rem' }}>
      {label}
      <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{copied ? 'Copied!' : 'Copy URL'}</span>
    </button>
  );
}

function StatCard({ icon, label, value, trend, color }) {
  return (
    <div className="stat-card nz-glass" style={{ padding: '20px', borderRadius: 'var(--nz-radius-md)', border: '1px solid var(--nz-border)', borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, color: 'var(--nz-text-muted)', fontSize: '0.82rem' }}>
        <span style={{ fontSize: '1.2rem', color }}>{icon}</span>
        {label}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: trend.startsWith('+') ? '#10b981' : 'var(--nz-text-dim)', fontWeight: 600 }}>{trend}</div>
      </div>
    </div>
  );
}

function ActionButton({ label }) {
  const { addNotification } = useAuth();
  
  const handleClick = () => {
    addNotification('system', `${label} command executed successfully.`, 'Dashboard');
  };

  return (
    <button onClick={handleClick} className="nz-btn nz-btn-secondary nz-btn-sm" style={{ width: '100%', fontSize: '0.75rem' }}>
      {label}
    </button>
  );
}

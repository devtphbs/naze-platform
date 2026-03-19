import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiTrendingUp, FiUsers, FiActivity, FiZap, FiSettings, FiBarChart2, FiMessageSquare } from 'react-icons/fi';

export default function DashboardPage() {
  const { user } = useAuth();
  const [streamHealth, setStreamHealth] = useState({ bitrate: 6500, fps: 60, dropped: 0 });
  
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

  // Simulated live updates for health
  useEffect(() => {
    const timer = setInterval(() => {
      setStreamHealth(prev => ({
        ...prev,
        bitrate: 6000 + Math.floor(Math.random() * 1000),
        fps: 59 + Math.random() < 0.1 ? 58 : 60
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-container animate-fade" style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Creator Dashboard</h1>
          <p style={{ color: 'var(--nz-text-dim)', fontSize: '0.9rem' }}>Welcome back, {user?.displayName || user?.username}.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="nz-btn nz-btn-secondary"><FiSettings /> Stream Settings</button>
          <button className="nz-btn nz-btn-primary"><FiZap /> Go Live</button>
        </div>
      </header>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<FiUsers />} label="Followers" value={followerData[6].value.toLocaleString()} trend="+12" color="var(--nz-purple)" />
        <StatCard icon={<FiActivity />} label="Current Viewers" value="152" trend="+5%" color="var(--nz-cyan)" />
        <StatCard icon={<FiZap />} label="Bitrate" value={`${streamHealth.bitrate} kbps`} trend="Stable" color="#10b981" />
        <StatCard icon={<FiActivity />} label="FPS" value={streamHealth.fps} trend="60" color="var(--nz-sky)" />
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Main Analytics Area */}
        <div className="nz-glass" style={{ flex: 2, minWidth: 350, padding: 24, borderRadius: 'var(--nz-radius-lg)', border: '1px solid var(--nz-border)' }}>
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
              {/* Data Points */}
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

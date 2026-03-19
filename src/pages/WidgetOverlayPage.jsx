import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function WidgetOverlayPage() {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const username = searchParams.get('user') || 'User';
  
  // Simulated data for widgets
  const [data, setData] = useState({
    followers: 1248,
    goal: 1500,
    recentFollower: 'AlexStreamer'
  });

  // In a real app, you'd use a websocket or polling here
  useEffect(() => {
    document.body.style.background = 'transparent';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  if (type === 'follower-goal') {
    const progress = (data.followers / data.goal) * 100;
    return (
      <div style={{ padding: 20, width: 300, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ 
          background: 'rgba(0,0,0,0.7)', 
          padding: '15px', 
          borderRadius: '12px', 
          border: '2px solid var(--nz-accent)',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '14px', fontWeight: 700 }}>
            <span>Follower Goal</span>
            <span>{data.followers} / {data.goal}</span>
          </div>
          <div style={{ height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ 
              width: `${progress}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--nz-accent), var(--nz-cyan))',
              transition: 'width 1s ease-out'
            }} />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'alert') {
    return (
      <div className="animate-bounce" style={{ padding: 20, textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ 
          background: 'rgba(168, 85, 247, 0.9)', 
          padding: '20px', 
          borderRadius: '20px', 
          color: '#fff',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
          border: '4px solid #fff'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: 5 }}>NEW FOLLOWER!</div>
          <div style={{ fontSize: '18px' }}>{data.recentFollower}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ color: '#fff', padding: 20 }}>
      Unknown Widget Type: {type}
    </div>
  );
}

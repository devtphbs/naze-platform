import React, { createContext, useContext, useState, useEffect } from 'react';

const StreamContext = createContext(null);

export const useStream = () => useContext(StreamContext);

export const StreamProvider = ({ children }) => {
  const [liveStreams, setLiveStreams] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchLiveStreams = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/streams');
      if (response.ok) {
        const data = await response.json();
        
        // Match stream keys to usernames using a simulated registry
        const registry = JSON.parse(localStorage.getItem('naze_user_registry') || '{}');
        const reversedRegistry = Object.fromEntries(
          Object.entries(registry)
            .filter(([_, data]) => data && data.streamKey)
            .map(([userName, data]) => [data.streamKey, { user: userName, ...data }])
        );

        const activeStreams = data.streams.map(s => {
          const userInfo = reversedRegistry[s.streamKey] || { user: s.streamKey, category: 'Just Chatting', title: `${s.streamKey}'s Live Stream` };
          return {
            id: s.id,
            username: userInfo.user,
            streamKey: s.streamKey,
            title: userInfo.title || `${userInfo.user}'s Live Stream`,
            category: userInfo.category || 'Just Chatting',
            viewers: Math.floor(Math.random() * 100) + 1, // Simulated viewer count
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.user}`,
            startTime: s.startTime,
            stats: s.stats || { bitrate: 0, fps: 0 }
          };
        });
        
        setLiveStreams(activeStreams);

        // Aggregate stats by category
        const stats = activeStreams.reduce((acc, s) => {
          if (!acc[s.category]) acc[s.category] = { name: s.category, viewers: 0, channels: 0 };
          acc[s.category].viewers += s.viewers;
          acc[s.category].channels += 1;
          return acc;
        }, {});
        
        setCategoryStats(Object.values(stats));
      }
    } catch (error) {
      console.error('Failed to fetch live streams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStreams(); // Initial fetch
    
    // Poll every 5 seconds for new streams or streams going offline
    const interval = setInterval(fetchLiveStreams, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StreamContext.Provider value={{ liveStreams, categoryStats, loading, refreshStreams: fetchLiveStreams }}>
      {children}
    </StreamContext.Provider>
  );
};

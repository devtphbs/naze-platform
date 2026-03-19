import { useState, useEffect, useRef } from 'react';
import { FiSend, FiSmile } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function ChatPanel({ channelName }) {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [poll, setPoll] = useState(null); // { question, options: [{text, votes}] }
  const [sparks, setSparks] = useState(120); // Simulated loyalty points
  const messagesEndRef = useRef(null);
  
  const isStreamer = isAuthenticated && user?.username === channelName;
  
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        setSparks(prev => prev + 5);
      }, 30000); // 5 sparks every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);
  
  // Real implementation would connect to a WebSocket here

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: 'You',
      color: '#7c3aed',
      text: input,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>💬</span> Stream Chat
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--nz-cyan)', background: 'var(--nz-cyan-glow)', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>✨</span> {sparks} Sparks
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--nz-cyan)', background: 'var(--nz-cyan-glow)', padding: '2px 6px', borderRadius: 4 }}>
          AUTO-MOD: ON
        </div>
      </div>
      
      {poll && (
        <div className="chat-poll-active nz-glass" style={{ margin: '8px', padding: '12px', border: '1px solid var(--nz-accent-glow)', borderRadius: 'var(--nz-radius-sm)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>📊 {poll.question}</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {poll.options.map((opt, idx) => {
              const totalVotes = poll.options.reduce((acc, o) => acc + o.votes, 0);
              const percent = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
              return (
                <button 
                  key={idx} 
                  className="nz-btn-secondary nz-btn-xs"
                  onClick={() => {
                    const newOptions = [...poll.options];
                    newOptions[idx].votes += 1;
                    setPoll({ ...poll, options: newOptions });
                  }}
                  style={{ position: 'relative', overflow: 'hidden', textAlign: 'left', padding: '6px 10px', fontSize: '0.75rem' }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${percent}%`, background: 'var(--nz-accent-glow)', zIndex: 0 }} />
                  <span style={{ position: 'relative', zIndex: 1 }}>{opt.text} ({opt.votes})</span>
                </button>
              );
            })}
          </div>
          {isStreamer && (
            <button 
              onClick={() => setPoll(null)} 
              style={{ marginTop: 8, fontSize: '0.7rem', color: 'var(--nz-text-dim)', background: 'none', border: 'none', textDecoration: 'underline' }}
            >
              End Poll
            </button>
          )}
        </div>
      )}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--nz-text-dim)', paddingTop: '40px', fontSize: '0.85rem' }}>
            Welcome to the chat room!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="chat-msg">
              <span className="chat-user" style={{ color: msg.color }}>
                {msg.user}:
              </span>
              <span className="chat-text">{msg.text}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {isAuthenticated ? (
        <div className="chat-input-area">
          {isStreamer && !poll && (
            <button 
              className="nz-btn-secondary nz-btn-xs" 
              style={{ marginBottom: 8, width: '100%', fontSize: '0.75rem' }}
              onClick={() => setPoll({
                question: 'What game should I play next?',
                options: [
                  { text: 'Valorant', votes: 0 },
                  { text: 'Minecraft', votes: 0 },
                  { text: 'Just Chatting', votes: 0 }
                ]
              })}
            >
              + Create Poll
            </button>
          )}
          <div className="chat-input-row">
            <input
              className="nz-input"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="nz-btn nz-btn-primary" onClick={handleSend} title="Send">
              <FiSend />
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-rules">
          Log in to send messages in chat.
        </div>
      )}
    </div>
  );
}

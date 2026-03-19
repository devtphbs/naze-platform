import { useState, useEffect, useRef } from 'react';
import { FiSend, FiSmile } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function ChatPanel() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
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
        <span>💬</span> Stream Chat
      </div>
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

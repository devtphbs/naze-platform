import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [mode, setMode] = useState('email'); // 'email' | 'phone'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(mode === 'email' ? 'Please enter your email.' : 'Please enter your phone number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const result = login({ identifier, password });
    if (result.success) {
      if (result.requires2FA) {
        navigate('/2fa');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card nz-glass">
        <div className="logo">
          <h1>NAZE</h1>
          <p>Welcome back! Log in to continue.</p>
        </div>

        <div className="auth-toggle">
          <button className={mode === 'email' ? 'active' : ''} onClick={() => setMode('email')}>
            <FiMail style={{ marginRight: 6 }} /> Email
          </button>
          <button className={mode === 'phone' ? 'active' : ''} onClick={() => setMode('phone')}>
            <FiPhone style={{ marginRight: 6 }} /> Phone
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="nz-label">{mode === 'email' ? 'Email Address' : 'Phone Number'}</label>
            <input
              id="login-identifier"
              className="nz-input"
              type={mode === 'email' ? 'email' : 'tel'}
              placeholder={mode === 'email' ? 'you@example.com' : '+1 (555) 123-4567'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete={mode === 'email' ? 'email' : 'tel'}
            />
          </div>

          <div className="form-group">
            <label className="nz-label">Password</label>
            <div className="input-wrapper">
              <input
                id="login-password"
                className="nz-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span className="input-icon" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <div className="form-footer">
            <label>
              <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" id="login-submit" className="nz-btn nz-btn-primary submit-btn">
            Log In
          </button>
        </form>

        <div className="alt-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

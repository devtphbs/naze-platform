import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const [mode, setMode] = useState('email');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) { setError('Username is required.'); return; }
    if (mode === 'email' && !email.trim()) { setError('Email is required.'); return; }
    if (mode === 'phone' && !phone.trim()) { setError('Phone number is required.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (!dobMonth || !dobDay || !dobYear) { setError('Date of birth is required.'); return; }
    if (!agree) { setError('You must agree to the Terms of Service.'); return; }

    const dob = `${dobYear}-${String(months.indexOf(dobMonth) + 1).padStart(2, '0')}-${String(dobDay).padStart(2, '0')}`;
    const result = register({ username, email, phone, password, dob });

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card nz-glass" style={{ maxWidth: 480 }}>
        <div className="logo">
          <h1>NAZE</h1>
          <p>Create your account and start streaming!</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="nz-label">Username</label>
            <input
              id="signup-username"
              className="nz-input"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="auth-toggle">
            <button type="button" className={mode === 'email' ? 'active' : ''} onClick={() => setMode('email')}>
              <FiMail style={{ marginRight: 6 }} /> Email
            </button>
            <button type="button" className={mode === 'phone' ? 'active' : ''} onClick={() => setMode('phone')}>
              <FiPhone style={{ marginRight: 6 }} /> Phone
            </button>
          </div>

          <div className="form-group">
            {mode === 'email' ? (
              <>
                <label className="nz-label">Email Address</label>
                <input
                  id="signup-email"
                  className="nz-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            ) : (
              <>
                <label className="nz-label">Phone Number</label>
                <input
                  id="signup-phone"
                  className="nz-input"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}
          </div>

          <div className="form-group">
            <label className="nz-label">Password</label>
            <div className="input-wrapper">
              <input
                id="signup-password"
                className="nz-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="input-icon" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="nz-label">Confirm Password</label>
            <input
              id="signup-confirm"
              className="nz-input"
              type="password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="nz-label">Date of Birth</label>
            <p style={{ fontSize: '0.78rem', color: 'var(--nz-text-dim)', marginBottom: 8 }}>
              You must be at least 13 years old to use Naze.
            </p>
            <div className="form-row">
              <select
                id="signup-dob-month"
                className="nz-input"
                value={dobMonth}
                onChange={(e) => setDobMonth(e.target.value)}
              >
                <option value="">Month</option>
                {months.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                id="signup-dob-day"
                className="nz-input"
                value={dobDay}
                onChange={(e) => setDobDay(e.target.value)}
              >
                <option value="">Day</option>
                {days.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                id="signup-dob-year"
                className="nz-input"
                value={dobYear}
                onChange={(e) => setDobYear(e.target.value)}
              >
                <option value="">Year</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.82rem', color: 'var(--nz-text-muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                style={{ marginTop: 3, accentColor: 'var(--nz-accent)' }}
              />
              I agree to the Naze Terms of Service and Privacy Policy. I confirm that I am at least 13 years old.
            </label>
          </div>

          <button type="submit" id="signup-submit" className="nz-btn nz-btn-primary submit-btn" style={{ marginTop: 8 }}>
            Create Account
          </button>
        </form>

        <div className="alt-link">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}

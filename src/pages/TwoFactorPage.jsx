import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function TwoFactorPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const { verify2FA } = useAuth();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setCode(paste.split(''));
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    const result = verify2FA(fullCode);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setCode(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card nz-glass" style={{ textAlign: 'center' }}>
        <div className="logo">
          <h1>NAZE</h1>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--nz-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid var(--nz-accent)' }}>
            <FiShield style={{ fontSize: '1.6rem', color: 'var(--nz-accent-light)' }} />
          </div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 8 }}>Two-Factor Authentication</h2>
          <p style={{ color: 'var(--nz-text-muted)', fontSize: '0.88rem' }}>
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="twofa-inputs" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                id={`twofa-digit-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <button type="submit" id="twofa-submit" className="nz-btn nz-btn-primary submit-btn">
            Verify
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: '0.82rem', color: 'var(--nz-text-dim)' }}>
          Lost access to your authenticator? <a href="#">Use a backup code</a>
        </p>
      </div>
    </div>
  );
}

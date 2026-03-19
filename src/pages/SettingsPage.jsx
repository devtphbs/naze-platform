import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStripeSettings } from '../context/StripeContext';
import { QRCodeSVG } from 'qrcode.react';
import * as otplib from 'otplib';
import { FiUser, FiShield, FiBell, FiKey, FiLogOut, FiLayout, FiGrid } from 'react-icons/fi';
const { authenticator } = otplib;

export default function SettingsPage() {
  const { user, isAuthenticated, updateProfile, toggle2FA, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  if (!isAuthenticated) {
    return (
      <div className="animate-fade" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ marginBottom: 12 }}>Log in to access settings</h2>
        <Link to="/login" className="nz-btn nz-btn-primary">Log In</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'security', label: 'Security', icon: <FiShield /> },
    { id: 'personalization', label: 'Channel Theme', icon: <FiLayout /> },
    { id: 'widgets', label: 'Stream Widgets', icon: <FiGrid /> },
    { id: 'payments', label: 'Payments', icon: <FiKey /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'stream', label: 'Stream Key', icon: <FiKey /> },
  ];

  return (
    <div className="animate-fade">
      <h1 style={{ fontSize: '1.6rem', marginBottom: 24 }}>Settings</h1>

      <div className="settings-layout">
        <nav className="settings-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          <hr className="nz-divider" />
          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{ color: 'var(--nz-red)' }}
          >
            <FiLogOut /> Log Out
          </button>
        </nav>

        <div className="settings-panel">
          {activeTab === 'profile' && <ProfileSettings user={user} updateProfile={updateProfile} />}
          {activeTab === 'security' && <SecuritySettings user={user} toggle2FA={toggle2FA} />}
          {activeTab === 'personalization' && <PersonalizationSettings user={user} updateProfile={updateProfile} />}
          {activeTab === 'widgets' && <WidgetSettings user={user} updateProfile={updateProfile} />}
          {activeTab === 'payments' && <PaymentSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'stream' && <StreamKeySettings user={user} />}
        </div>
      </div>
    </div>
  );
}

function PaymentSettings() {
  const { streamerStripeKey, saveStripeKey } = useStripeSettings();
  const [keyInput, setKeyInput] = useState(streamerStripeKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveStripeKey(keyInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <h2>Payments (Stripe)</h2>
      <div className="settings-section">
        <p style={{ fontSize: '0.85rem', color: 'var(--nz-text-muted)', marginBottom: 16 }}>
          Connect your Stripe account to receive direct donations and subscription revenue. 
          Enter your Stripe Publishable Key securely. Naze does not collect processing fees natively.
        </p>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="nz-label">Stripe Publishable Key (pk_...)</label>
          <input
            id="stripe-key"
            className="nz-input"
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            style={{ maxWidth: 400 }}
            placeholder="pk_test_... or pk_live_..."
          />
        </div>

        <button className="nz-btn nz-btn-primary" onClick={handleSave} style={{ marginTop: 16 }}>
          {saved ? '✓ Saved!' : 'Save Stripe Key'}
        </button>
      </div>
    </>
  );
}

function ProfileSettings({ user, updateProfile }) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio || '');
  const [merchLink, setMerchLink] = useState(user.merchLink || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({ displayName, bio, merchLink });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <h2>Profile</h2>
      <div className="settings-section">
        <div className="avatar-editor">
          <div className="avatar-preview" style={{ background: 'linear-gradient(135deg, var(--nz-accent), var(--nz-cyan))' }}>
            {(displayName || 'U')[0].toUpperCase()}
          </div>
          <div>
            <button className="nz-btn nz-btn-secondary nz-btn-sm">Change Avatar</button>
            <p style={{ fontSize: '0.75rem', color: 'var(--nz-text-dim)', marginTop: 6 }}>JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="nz-label">Display Name</label>
          <input
            id="settings-display-name"
            className="nz-input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="nz-label">Bio</label>
          <textarea
            id="settings-bio"
            className="nz-input"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell viewers about yourself..."
            style={{ maxWidth: 400, resize: 'vertical' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="nz-label">Merch Store Link</label>
          <input
            id="settings-merch"
            className="nz-input"
            type="url"
            value={merchLink}
            onChange={(e) => setMerchLink(e.target.value)}
            placeholder="https://teespring.com/stores/your-store"
            style={{ maxWidth: 400 }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--nz-text-dim)', marginTop: 4 }}>Links to your personal merchandise store.</p>
        </div>

        <div className="form-group">
          <label className="nz-label">Email</label>
          <input className="nz-input" value={user.email || 'Not set'} disabled style={{ maxWidth: 400, opacity: 0.6 }} />
        </div>

        <button className="nz-btn nz-btn-primary" onClick={handleSave} style={{ marginTop: 16 }}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
    </>
  );
}

function SecuritySettings({ user, toggle2FA }) {
  const [twoFA, setTwoFA] = useState(user.twoFAEnabled);
  const [setupMode, setSetupMode] = useState(false);
  const [secret, setSecret] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState('');

  const { verify2FA } = useAuth();

  const handleToggle2FA = () => {
    if (twoFA) {
      // Disabling
      toggle2FA(false);
      setTwoFA(false);
    } else {
      // Enabling flow
      const newSecret = authenticator.generateSecret();
      setSecret(newSecret);
      setSetupMode(true);
    }
  };

  const handleVerifySetup = () => {
    const res = verify2FA(otpValue, secret);
    if (res.success) {
      toggle2FA(true, secret);
      setTwoFA(true);
      setSetupMode(false);
      setOtpValue('');
      setError('');
    } else {
      setError(res.error);
    }
  };

  const otpAuthUrl = authenticator.keyuri(user.username, 'Naze', secret);

  return (
    <>
      <h2>Security</h2>
      {/* ... Password section ... */}
      <div className="settings-section">
        <h3><FiShield /> Password</h3>
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="nz-label">Current Password</label>
          <input className="nz-input" type="password" placeholder="Enter current password" style={{ maxWidth: 400 }} />
        </div>
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="nz-label">New Password</label>
          <input className="nz-input" type="password" placeholder="Enter new password" style={{ maxWidth: 400 }} />
        </div>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="nz-label">Confirm New Password</label>
          <input className="nz-input" type="password" placeholder="Confirm new password" style={{ maxWidth: 400 }} />
        </div>
        <button className="nz-btn nz-btn-secondary">Update Password</button>
      </div>

      <div className="settings-section">
        <h3><FiShield /> Two-Factor Authentication</h3>
        <div className="settings-row">
          <div className="row-info">
            <div className="row-label">Enable 2FA</div>
            <div className="row-desc">
              Add extra security with Google Authenticator or similar apps.
              {twoFA && <span style={{ color: 'var(--nz-cyan)', marginLeft: 8 }}>● Active</span>}
            </div>
          </div>
          <div className={`toggle-switch ${twoFA ? 'active' : ''}`} onClick={handleToggle2FA} id="toggle-2fa">
            <div className="toggle-knob" />
          </div>
        </div>

        {setupMode && (
          <div style={{ marginTop: 20, padding: 24, background: 'var(--nz-bg-tertiary)', borderRadius: 'var(--nz-radius-md)', border: '1px solid var(--nz-accent-glow)' }}>
            <h4 style={{ marginBottom: 16, color: 'var(--nz-accent-light)' }}>Set Up Authenticator</h4>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
                <QRCodeSVG value={otpAuthUrl} size={150} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <ol style={{ fontSize: '0.88rem', color: 'var(--nz-text-muted)', paddingLeft: 20, lineHeight: 1.6 }}>
                  <li>Scan this QR code with your app</li>
                  <li>Enter the 6-digit verification code below</li>
                </ol>
                <div style={{ marginTop: 16 }}>
                  <input
                    className="nz-input"
                    placeholder="000000"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    style={{ letterSpacing: '0.5em', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', maxWidth: 200 }}
                  />
                  {error && <p style={{ color: 'var(--nz-red)', fontSize: '0.8rem', marginTop: 8 }}>{error}</p>}
                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button className="nz-btn nz-btn-primary" onClick={handleVerifySetup}>Verify & Enable</button>
                    <button className="nz-btn nz-btn-secondary" onClick={() => setSetupMode(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {twoFA && !setupMode && (
          <div style={{ marginTop: 16, padding: 16, background: 'var(--nz-bg-tertiary)', borderRadius: 'var(--nz-radius-sm)', border: '1px dashed var(--nz-cyan-glow)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--nz-cyan)' }}>
              ✓ Two-factor authentication is active on your account.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function NotificationSettings() {
  const loadNotifs = (key, defaultVal) => {
    const saved = localStorage.getItem(`naze_notif_${key}`);
    return saved !== null ? saved === 'true' : defaultVal;
  };

  const [emailNotifs, setEmailNotifs] = useState(loadNotifs('email', true));
  const [pushNotifs, setPushNotifs] = useState(loadNotifs('push', true));
  const [liveNotifs, setLiveNotifs] = useState(loadNotifs('live', true));
  const [followNotifs, setFollowNotifs] = useState(loadNotifs('follow', false));

  const toggleSetting = (setter, key, currentVal) => {
    const newVal = !currentVal;
    setter(newVal);
    localStorage.setItem(`naze_notif_${key}`, newVal);
  };

  return (
    <>
      <h2>Notifications</h2>
      <div className="settings-section">
        <div className="settings-row">
          <div className="row-info">
            <div className="row-label">Email Notifications</div>
            <div className="row-desc">Receive updates via email</div>
          </div>
          <div className={`toggle-switch ${emailNotifs ? 'active' : ''}`} onClick={() => toggleSetting(setEmailNotifs, 'email', emailNotifs)}>
            <div className="toggle-knob" />
          </div>
        </div>
        <div className="settings-row">
          <div className="row-info">
            <div className="row-label">Push Notifications</div>
            <div className="row-desc">Browser push notifications</div>
          </div>
          <div className={`toggle-switch ${pushNotifs ? 'active' : ''}`} onClick={() => toggleSetting(setPushNotifs, 'push', pushNotifs)}>
            <div className="toggle-knob" />
          </div>
        </div>
        <div className="settings-row">
          <div className="row-info">
            <div className="row-label">Live Alerts</div>
            <div className="row-desc">Get notified when followed channels go live</div>
          </div>
          <div className={`toggle-switch ${liveNotifs ? 'active' : ''}`} onClick={() => toggleSetting(setLiveNotifs, 'live', liveNotifs)}>
            <div className="toggle-knob" />
          </div>
        </div>
        <div className="settings-row">
          <div className="row-info">
            <div className="row-label">New Follower Alerts</div>
            <div className="row-desc">Get notified when someone follows you</div>
          </div>
          <div className={`toggle-switch ${followNotifs ? 'active' : ''}`} onClick={() => toggleSetting(setFollowNotifs, 'follow', followNotifs)}>
            <div className="toggle-knob" />
          </div>
        </div>
      </div>
    </>
  );
}

function StreamKeySettings({ user }) {
  const [showKey, setShowKey] = useState(false);
  const streamKey = user?.streamKey || 'live_sk_generate_on_login'; 

  return (
    <>
      <h2>Stream Key</h2>
      <div className="settings-section">
        <h3><FiKey /> Your Stream Key</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--nz-text-muted)', marginBottom: 16 }}>
          Use this key in your streaming software (OBS, Streamlabs, etc.) to broadcast on Naze.
        </p>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', maxWidth: 500 }}>
          <input
            className="nz-input"
            type={showKey ? 'text' : 'password'}
            value={streamKey}
            readOnly
            style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.82rem' }}
          />
          <button className="nz-btn nz-btn-secondary nz-btn-sm" onClick={() => setShowKey(!showKey)}>
            {showKey ? 'Hide' : 'Show'}
          </button>
          <button
            className="nz-btn nz-btn-secondary nz-btn-sm"
            onClick={() => navigator.clipboard?.writeText(streamKey)}
          >
            Copy
          </button>
        </div>

        <div style={{ marginTop: 20, padding: 12, background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--nz-radius-sm)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--nz-red)' }}>
            ⚠️ Never share your stream key. If compromised, reset it immediately.
          </p>
        </div>

        <button className="nz-btn nz-btn-danger" style={{ marginTop: 16 }}>
          Reset Stream Key
        </button>
      </div>

      <div className="settings-section">
        <h3>Server URL</h3>
        <input className="nz-input" value="rtmp://localhost:1935/live" readOnly style={{ maxWidth: 400, fontFamily: 'monospace', fontSize: '0.82rem' }} />
      </div>
    </>
  );
}
function PersonalizationSettings({ user, updateProfile }) {
  const [themeColor, setThemeColor] = useState(user.themeColor || '#a855f7');
  const [saved, setSaved] = useState(false);

  const colors = [
    '#a855f7', // Purple
    '#06b6d4', // Cyan
    '#0ea5e9', // Blue
    '#facc15', // Yellow
    '#ef4444', // Red
    '#10b981', // Green
  ];

  const handleSave = () => {
    updateProfile({ themeColor });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <h2>Channel Personalization</h2>
      <div className="settings-section">
        <p style={{ fontSize: '0.85rem', color: 'var(--nz-text-muted)', marginBottom: 20 }}>
          Choose a primary accent color for your channel page to stand out.
        </p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {colors.map(color => (
            <div
              key={color}
              onClick={() => setThemeColor(color)}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                backgroundColor: color, cursor: 'pointer',
                border: themeColor === color ? '3px solid #fff' : 'none',
                boxShadow: themeColor === color ? `0 0 15px ${color}` : 'none',
                transition: 'all 0.2s'
              }}
            />
          ))}
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="nz-label">Custom HEX Color</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="nz-input"
              type="text"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              style={{ maxWidth: 120, textAlign: 'center' }}
            />
            <div style={{ width: 44, height: 44, borderRadius: 'var(--nz-radius-sm)', backgroundColor: themeColor, border: '1px solid var(--nz-border)' }} />
          </div>
        </div>

        <button className="nz-btn nz-btn-primary" onClick={handleSave}>
          {saved ? '✓ Theme Saved!' : 'Save Personalization'}
        </button>
      </div>
    </>
  );
}

function WidgetSettings({ user, updateProfile }) {
  const [activeWidgets, setActiveWidgets] = useState(user.activeWidgets || []);
  const [saved, setSaved] = useState(false);

  const widgets = [
    { id: 'goal_bar', label: 'Follower Goal Bar', desc: 'Show your progress towards a follower milestone.' },
    { id: 'recent_support', label: 'Recent Support Ticker', desc: 'Display a rotating list of recent tips and subs.' },
    { id: 'bounty_board', label: 'Live Bounty Board', desc: 'Allow viewers to see active challenges you are doing.' },
  ];

  const toggleWidget = (id) => {
    const updated = activeWidgets.includes(id)
      ? activeWidgets.filter(w => w !== id)
      : [...activeWidgets, id];
    setActiveWidgets(updated);
  };

  const handleSave = () => {
    updateProfile({ activeWidgets });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <h2>Stream Widgets</h2>
      <div className="settings-section">
        <p style={{ fontSize: '0.85rem', color: 'var(--nz-text-muted)', marginBottom: 20 }}>
          Enable interactive overlays and widgets to engage your viewers directly on your channel page.
        </p>

        <div style={{ display: 'grid', gap: 16 }}>
          {widgets.map(w => {
            const isActive = activeWidgets.includes(w.id);
            return (
              <div key={w.id} className="settings-row" style={{ padding: '16px', border: '1px solid var(--nz-border)', borderRadius: 'var(--nz-radius-sm)' }}>
                <div className="row-info">
                  <div className="row-label">{w.label}</div>
                  <div className="row-desc">{w.desc}</div>
                </div>
                <div className={`toggle-switch ${isActive ? 'active' : ''}`} onClick={() => toggleWidget(w.id)}>
                  <div className="toggle-knob" />
                </div>
              </div>
            );
          })}
        </div>

        <button className="nz-btn nz-btn-primary" onClick={handleSave} style={{ marginTop: 24 }}>
          {saved ? '✓ Settings Saved!' : 'Save Widget Config'}
        </button>
      </div>
    </>
  );
}

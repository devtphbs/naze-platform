import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as otplib from 'otplib';
const { authenticator } = otplib;

const AuthContext = createContext(null);

const DEFAULT_USER = {
  username: '',
  displayName: '',
  email: '',
  phone: '',
  bio: '',
  twoFAEnabled: false,
  twoFASecret: '',
  streamKey: '',
  following: [],
  merchLink: '',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('naze_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('naze_user');
      }
    }
    setLoading(false);
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) {
      localStorage.setItem('naze_user', JSON.stringify(u));
      // Update global registry
      const registry = JSON.parse(localStorage.getItem('naze_user_registry') || '{}');
      registry[u.username] = { streamKey: u.streamKey, displayName: u.displayName, category: u.category || 'Just Chatting', title: u.title || '' };
      localStorage.setItem('naze_user_registry', JSON.stringify(registry));
    } else {
      localStorage.removeItem('naze_user');
    }
  };

  const register = ({ username, email, phone, password, dob }) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age < 13) {
      return { success: false, error: 'You must be at least 13 years old to register on Naze.' };
    }

    const newUser = {
      ...DEFAULT_USER,
      username,
      displayName: username,
      email: email || '',
      phone: phone || '',
      streamKey: `live_sk_${uuidv4().replace(/-/g, '').slice(0, 16)}`,
    };
    persist(newUser);
    return { success: true };
  };

  const login = ({ identifier, password }) => {
    // Simulated login — accept anything if user exists in local storage
    const stored = localStorage.getItem('naze_user');
    if (stored) {
      const u = JSON.parse(stored);
      // Actual match check (simulated) - if username matches or identifier matches
      if (u.email === identifier || u.phone === identifier || u.username === identifier) {
        if (u.twoFAEnabled) {
          return { success: true, requires2FA: true, username: u.username };
        }
        persist(u);
        return { success: true, requires2FA: false };
      }
    }
    
    // Create new account logic if not found (for convenience in this prototype)
    const isPhone = /^[\d+\-() ]+$/.test(identifier);
    const tempUser = {
      ...DEFAULT_USER,
      username: isPhone ? 'user_' + identifier.slice(-4) : identifier.split('@')[0],
      displayName: isPhone ? 'User' : identifier.split('@')[0],
      email: isPhone ? '' : identifier,
      phone: isPhone ? identifier : '',
      streamKey: `live_sk_${uuidv4().replace(/-/g, '').slice(0, 16)}`,
    };
    persist(tempUser);
    return { success: true, requires2FA: false };
  };

  const verify2FA = (code, secretOverride = null) => {
    const stored = localStorage.getItem('naze_user');
    if (!stored) return { success: false, error: 'User not found.' };
    
    const u = JSON.parse(stored);
    const secret = secretOverride || u.twoFASecret;
    
    if (!secret) return { success: false, error: '2FA not set up properly.' };

    const isValid = authenticator.verify({ token: code, secret });
    
    if (isValid) {
      persist(u);
      return { success: true };
    }
    return { success: false, error: 'Invalid 2FA code. Please check your authenticator app.' };
  };

  const logout = () => {
    persist(null);
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    persist(updated);
  };

  const toggle2FA = (enabled, secret = '') => {
    const updated = { 
      ...user, 
      twoFAEnabled: enabled,
      twoFASecret: enabled ? secret : '',
    };
    persist(updated);
    return updated.twoFAEnabled;
  };

  const toggleFollow = (streamerId) => {
    const following = user.following || [];
    const updated = following.includes(streamerId)
      ? following.filter((id) => id !== streamerId)
      : [...following, streamerId];
    updateProfile({ following: updated });
  };

  const isFollowing = (streamerId) => {
    return (user?.following || []).includes(streamerId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        verify2FA,
        logout,
        updateProfile,
        toggle2FA,
        toggleFollow,
        isFollowing,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

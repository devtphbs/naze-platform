import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StreamProvider } from './context/StreamContext';
import { StripeProvider } from './context/StripeContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TwoFactorPage from './pages/TwoFactorPage';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ChannelPage from './pages/ChannelPage';
import FollowingPage from './pages/FollowingPage';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import WidgetOverlayPage from './pages/WidgetOverlayPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes (no layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/2fa" element={<TwoFactorPage />} />

      {/* Widget Overlay (no layout, transparent) */}
      <Route path="/widgets/:type" element={<WidgetOverlayPage />} />

      {/* Main layout routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/channel/:id" element={<ChannelPage />} />
        <Route
          path="/following"
          element={
            <ProtectedRoute>
              <FollowingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StripeProvider>
        <StreamProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </StreamProvider>
      </StripeProvider>
    </AuthProvider>
  );
}

import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AirlineReservation from './components/AirlineReservation';
import RailwayReservation from './components/RailwayReservation';
import Payment from './components/Payment';
import BookingHistory from './components/BookingHistory';
import './styles/App.css';

// ─── Auth Context ────────────────────────────────────────────
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// ─── Axios Defaults ──────────────────────────────────────────
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─── Navbar ──────────────────────────────────────────────────
function Navbar({ user, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="nav-brand">✈ SkyRail</Link>
        <ul className="nav-links">
          <li>
            <Link to="/dashboard" className={isActive('/dashboard')}>
              🏠 Home
            </Link>
          </li>
          <li>
            <Link to="/airline" className={isActive('/airline')}>
              ✈️ Flights
            </Link>
          </li>
          <li>
            <Link to="/railway" className={isActive('/railway')}>
              🚆 Trains
            </Link>
          </li>
          <li>
            <Link to="/bookings" className={isActive('/bookings')}>
              📋 My Bookings
            </Link>
          </li>
        </ul>
        <div className="nav-user">
          <div className="nav-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <span className="nav-user-name">
            {user?.name}
          </span>
          <button className="nav-logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Protected Route ─────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

// ─── App Layout (with Navbar) ─────────────────────────────────
function AppLayout({ user, children, onLogout }) {
  return (
    <div className="app-wrapper">
      <Navbar user={user} onLogout={onLogout} />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('skyrail_token'));
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('skyrail_user')); }
    catch { return null; }
  });
  const [booking, setBooking] = useState(null); // pending booking for payment

  // Attach token to all axios requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(config => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  const handleLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('skyrail_token', data.token);
    localStorage.setItem('skyrail_user', JSON.stringify(data.user));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setBooking(null);
    localStorage.removeItem('skyrail_token');
    localStorage.removeItem('skyrail_user');
    toast.info('Logged out successfully');
  };

  const authValue = { token, user, setBooking, booking };

  return (
    <AuthContext.Provider value={authValue}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={token ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout user={user} onLogout={handleLogout}>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/airline" element={
            <ProtectedRoute>
              <AppLayout user={user} onLogout={handleLogout}>
                <AirlineReservation />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/railway" element={
            <ProtectedRoute>
              <AppLayout user={user} onLogout={handleLogout}>
                <RailwayReservation />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/payment" element={
            <ProtectedRoute>
              <AppLayout user={user} onLogout={handleLogout}>
                <Payment />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/bookings" element={
            <ProtectedRoute>
              <AppLayout user={user} onLogout={handleLogout}>
                <BookingHistory />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Default */}
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        theme="light"
        toastStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', color: '#0f172a' }}
      />
    </AuthContext.Provider>
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      onLogin(data);
    } catch (err) {
      const msg = err.response?.status === 401 ? 'Invalid Credentials' : (err.response?.data?.error || 'Login failed. Please try again.');
      setError(msg);
      window.alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    const Register = require('./Register').default;
    return <Register onLogin={onLogin} onBack={() => setShowRegister(false)} />;
  }

  return (
    <div className="auth-page">
      <div className="auth-card slide-up">
        <div className="auth-logo">
          <h1>✈ SkyRail</h1>
          <p className="tagline">Your unified travel companion</p>
        </div>

        <h2 className="auth-title">Welcome back</h2>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrap">
              <span className="input-icon">📧</span>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" style={{width:18,height:18,borderWidth:2,margin:0}} /> Signing in...</> : '🚀 Sign In'}
          </button>
        </form>

        <div className="divider" style={{ marginTop: '1.5rem' }} />

        <p className="auth-switch">
          Don't have an account?{' '}
          <a onClick={() => setShowRegister(true)}>Create one for free</a>
        </p>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59,130,246,0.08)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.15)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            🔐 Your data is protected with JWT authentication & bcrypt encryption
          </p>
        </div>
      </div>
    </div>
  );
}

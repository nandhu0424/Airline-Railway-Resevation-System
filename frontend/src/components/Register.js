import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Register({ onLogin, onBack }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      const msg = 'Passwords do not match';
      setError(msg);
      toast.error(msg);
      return;
    }
    if (form.password.length < 6) {
      const msg = 'Password must be at least 6 characters';
      setError(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success(`Account created! Welcome, ${data.user.name}! 🎉`);
      onLogin(data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card slide-up">
        <div className="auth-logo">
          <h1>✈ SkyRail</h1>
          <p className="tagline">Your unified travel companion</p>
        </div>

        <h2 className="auth-title">Create your account</h2>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrap">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                className="form-input"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" style={{width:18,height:18,borderWidth:2,margin:0}} /> Creating account...</> : '🎉 Create Account'}
          </button>
        </form>

        <div className="divider" style={{ marginTop: '1.5rem' }} />

        <p className="auth-switch">
          Already have an account?{' '}
          <a onClick={onBack}>Sign in</a>
        </p>
      </div>
    </div>
  );
}

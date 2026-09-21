import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="animated-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badge">🌟 Unified Travel Platform</div>
        <h1 className="hero-title">
          {greeting}, <span className="hero-grad">{user?.name?.split(' ')[0] || 'Traveller'}!</span>
          <br />Where would you like to go?
        </h1>
        <p className="hero-subtitle">
          Book flights and train tickets seamlessly in one place. Fast, secure, and hassle-free.
        </p>
      </section>

      {/* Service Cards */}
      <div className="service-grid">
        <Link to="/airline" className="service-card airline fade-in">
          <div className="service-icon blue">✈️</div>
          <h3>Airline Reservation</h3>
          <p>Find the best flights across India. Economy & Business class available with real-time seat selection.</p>
          <div>
            <span className="service-tag tag-blue">Economy</span>
            <span className="service-tag tag-blue">Business</span>
            <span className="service-tag tag-amber">5 Airlines</span>
          </div>
          <div className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
            Search Flights →
          </div>
        </Link>

        <Link to="/railway" className="service-card railway fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="service-icon green">🚆</div>
          <h3>Railway Reservation</h3>
          <p>Book train tickets across India. General, Sleeper & AC coach options with flexible scheduling.</p>
          <div>
            <span className="service-tag tag-green">Sleeper</span>
            <span className="service-tag tag-green">AC</span>
            <span className="service-tag tag-amber">General</span>
          </div>
          <div className="btn btn-success" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
            Search Trains →
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div className="page-content" style={{ marginTop: '1rem' }}>
        <h2 className="section-title text-center mb-3">Why SkyRail?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { icon: '⚡', title: 'Instant Booking', desc: 'Confirm your seat in under a minute' },
            { icon: '🔒', title: 'Secure Payments', desc: 'Multi-method encrypted payment gateway' },
            { icon: '📱', title: 'Easy Management', desc: 'View, cancel or download tickets anytime' },
            { icon: '🌐', title: 'All India Routes', title2: '10 Major Cities', desc2: 'Delhi, Mumbai, Chennai, and more' },
          ].map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>{f.title || f.title2}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{f.desc || f.desc2}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="section-title">Quick Actions</h2>
            <p className="section-subtitle">Jump right in</p>
          </div>
          <Link to="/bookings" className="btn btn-secondary">📋 View All Bookings →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <Link to="/airline" className="glass-card" style={{ padding: '1.25rem', display: 'block', textDecoration: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Search Flights</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Find available flights</div>
          </Link>
          <Link to="/railway" className="glass-card" style={{ padding: '1.25rem', display: 'block', textDecoration: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚉</div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Search Trains</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Find train schedules</div>
          </Link>
          <Link to="/bookings" className="glass-card" style={{ padding: '1.25rem', display: 'block', textDecoration: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎫</div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>My Tickets</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Manage bookings</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

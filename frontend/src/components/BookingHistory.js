import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function TicketModal({ booking, onClose }) {
  const isFlightBooking = booking.type === 'flight';

  const handlePrint = () => window.print();

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', padding: '2rem', maxWidth: 520, width: '100%',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
          color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer'
        }}>✕</button>

        {/* Ticket Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{isFlightBooking ? '✈️' : '🚆'}</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>
            {isFlightBooking ? 'Flight Ticket' : 'Train Ticket'}
          </h3>
          <div style={{
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '8px', padding: '0.4rem 1rem', display: 'inline-block', marginTop: '0.5rem'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>PNR</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>
              {booking.pnr}
            </span>
          </div>
        </div>

        {/* Route */}
        <div style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{booking.source}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.departure_time}</div>
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <div>→</div>
              <div>{isFlightBooking ? booking.airline : booking.train_name}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{booking.destination}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isFlightBooking ? booking.arrival_time : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ marginBottom: '1rem' }}>
          <div className="info-row"><span className="info-label">Date</span><span className="info-value">{booking.travel_date}</span></div>
          <div className="info-row">
            <span className="info-label">{isFlightBooking ? 'Class' : 'Coach'}</span>
            <span className="info-value" style={{ textTransform: 'capitalize' }}>
              {isFlightBooking ? booking.travel_class : booking.coach_type}
            </span>
          </div>
          <div className="info-row"><span className="info-label">Total Paid</span><span className="info-value text-success fw-700">₹{booking.total_amount?.toLocaleString()}</span></div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
          </div>
        </div>

        {/* Passengers */}
        <div style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Passengers</div>
          {booking.passengers?.map((p, i) => (
            <div key={i} style={{ fontSize: '0.9rem', padding: '0.3rem 0', borderBottom: i < booking.passengers.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {i + 1}. {p.name}, {p.age}y, {p.gender}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary w-full" onClick={handlePrint}>🖨️ Print Ticket</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);
  const [ticketBooking, setTicketBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/bookings');
      setBookings(data.bookings);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    try {
      await axios.post(`/api/bookings/${id}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cancel failed');
    } finally { setCancellingId(null); }
  };

  const handleViewTicket = async (id) => {
    try {
      const { data } = await axios.get(`/api/bookings/${id}/ticket`);
      setTicketBooking(data);
    } catch { toast.error('Could not fetch ticket'); }
  };

  const filtered = bookings.filter(b =>
    filter === 'all' ? true :
    filter === 'flights' ? b.type === 'flight' :
    filter === 'trains'  ? b.type === 'train'  :
    b.status === filter
  );

  const counts = {
    all: bookings.length,
    flights: bookings.filter(b => b.type === 'flight').length,
    trains:  bookings.filter(b => b.type === 'train').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="page-content animated-page">
      <div className="flex-between mb-4">
        <div>
          <h2 className="section-title">My Bookings</h2>
          <p className="text-secondary">{bookings.length} total bookings</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchBookings}>🔄 Refresh</button>
      </div>

      {/* Filter Tabs */}
      <div className="tab-bar mb-3" style={{ maxWidth: 600 }}>
        {[
          { key: 'all',       label: `🗂 All (${counts.all})` },
          { key: 'flights',   label: `✈ Flights (${counts.flights})` },
          { key: 'trains',    label: `🚆 Trains (${counts.trains})` },
          { key: 'confirmed', label: `✅ Confirmed (${counts.confirmed})` },
          { key: 'cancelled', label: `❌ Cancelled (${counts.cancelled})` },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${filter === t.key ? 'active' : ''}`}
            onClick={() => setFilter(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
          <p>Loading bookings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <h3>No Bookings Found</h3>
          <p>{filter === 'all' ? "You haven't made any bookings yet." : `No ${filter} bookings.`}</p>
        </div>
      ) : (
        filtered.map(b => {
          const isFlightBooking = b.type === 'flight';
          return (
            <div key={b._id} className="booking-card fade-in">
              <div className="booking-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`booking-type-badge ${isFlightBooking ? 'type-flight' : 'type-train'}`}>
                    {isFlightBooking ? '✈ Flight' : '🚆 Train'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                      {isFlightBooking
                        ? `${b.airline} · ${b.flight_number}`
                        : `${b.train_name} · #${b.train_number}`}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      PNR: {b.pnr}
                    </div>
                  </div>
                </div>
                <span className={`status-badge status-${b.status}`}>
                  {b.status === 'confirmed' ? '✅' : '❌'} {b.status}
                </span>
              </div>

              <div className="booking-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>ROUTE</div>
                    <div style={{ fontWeight: 600 }}>{b.source} → {b.destination}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>DATE</div>
                    <div style={{ fontWeight: 600 }}>{b.travel_date}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>PASSENGERS</div>
                    <div style={{ fontWeight: 600 }}>{b.passengers?.length} passenger{b.passengers?.length > 1 ? 's' : ''}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>TOTAL PAID</div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '1.05rem' }}>
                      ₹{b.total_amount?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleViewTicket(b._id)}>
                    🎫 View Ticket
                  </button>
                  {b.status === 'confirmed' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(b._id)}
                      disabled={cancellingId === b._id}>
                      {cancellingId === b._id ? 'Cancelling...' : '❌ Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      {ticketBooking && <TicketModal booking={ticketBooking} onClose={() => setTicketBooking(null)} />}
    </div>
  );
}

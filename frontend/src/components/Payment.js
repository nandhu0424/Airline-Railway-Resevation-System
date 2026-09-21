import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../App';

const METHODS = [
  { id: 'credit_card',  icon: '💳', label: 'Credit Card' },
  { id: 'debit_card',   icon: '🏧', label: 'Debit Card' },
  { id: 'upi',          icon: '📱', label: 'UPI' },
];

export default function Payment() {
  const navigate = useNavigate();
  const { booking, setBooking } = useAuth();
  const [method, setMethod] = useState('credit_card');
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState('');

  if (!booking) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-icon">💳</div>
          <h3>No Pending Booking</h3>
          <p>Please start a booking first.</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const isCard = method === 'credit_card' || method === 'debit_card';

  const validate = () => {
    if (isCard) {
      if (cardForm.number.replace(/\s/g, '').length < 16) return 'Enter a valid 16-digit card number';
      if (!cardForm.name.trim()) return 'Enter cardholder name';
      if (!cardForm.expiry) return 'Enter card expiry';
      if (cardForm.cvv.length < 3) return 'Enter valid CVV';
    } else {
      if (!upiId.includes('@')) return 'Enter a valid UPI ID (e.g. name@upi)';
    }
    return null;
  };

  const handlePay = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);

    try {
      // 1. Process payment
      const { data: payData } = await axios.post('/api/payment/process', {
        amount: booking.total,
        method,
        payload: isCard ? cardForm : { upi_id: upiId },
      });

      // 2. Book the ticket
      let bookRes;
      if (booking.type === 'flight') {
        bookRes = await axios.post('/api/flights/book', {
          flight_id: booking.flight._id,
          passengers: booking.passengers,
          class: booking.class,
          date: booking.date,
          payment_id: payData.payment_id,
        });
      } else {
        bookRes = await axios.post('/api/trains/book', {
          train_id: booking.train._id,
          passengers: booking.passengers,
          coach: booking.coach,
          date: booking.date,
          payment_id: payData.payment_id,
        });
      }

      setConfirmed({ booking: bookRes.data.booking, pnr: bookRes.data.pnr, paymentId: payData.payment_id });
      setBooking(null);
      toast.success('Booking confirmed! 🎉');
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Confirmation Screen ──
  if (confirmed) {
    return (
      <div className="page-content">
        <div className="glass-card confirm-card fade-in">
          <div className="confirm-icon">✅</div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
          <p className="text-secondary mb-2">Your ticket has been booked successfully.</p>

          <div className="pnr-display">
            <div className="pnr-label">PNR Number</div>
            <div className="pnr-number">{confirmed.pnr}</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', margin: '1.5rem 0', textAlign: 'left' }}>
            <div className="info-row">
              <span className="info-label">Type</span>
              <span className="info-value" style={{ textTransform: 'capitalize' }}>{confirmed.booking.type}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Route</span>
              <span className="info-value">{confirmed.booking.source} → {confirmed.booking.destination}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date</span>
              <span className="info-value">{confirmed.booking.travel_date}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Passengers</span>
              <span className="info-value">{confirmed.booking.passengers?.length}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Total Paid</span>
              <span className="info-value text-success fw-700">₹{confirmed.booking.total_amount?.toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Payment ID</span>
              <span className="info-value text-sm">{confirmed.paymentId}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/bookings')}>📋 View All Bookings</button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>🏠 Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Payment Form ──
  const isFlightBooking = booking.type === 'flight';
  const vehicle = isFlightBooking ? booking.flight : booking.train;
  const vehicleName = isFlightBooking
    ? `${vehicle.airline} (${vehicle.flight_number})`
    : `${vehicle.train_name} (#${vehicle.train_number})`;

  return (
    <div className="page-content">
      <h2 className="section-title mb-1">Secure Payment</h2>
      <p className="text-secondary mb-4">Complete your booking with a secure payment</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Payment Form */}
        <div>
          {error && <div className="alert alert-error mb-3"><span>⚠️</span>{error}</div>}

          {/* Payment Method */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>Payment Method</h3>
            <div className="payment-methods">
              {METHODS.map(m => (
                <div key={m.id} className={`payment-method ${method === m.id ? 'selected' : ''}`}
                  onClick={() => setMethod(m.id)}>
                  <div className="payment-icon">{m.icon}</div>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card Fields */}
          {isCard && (
            <div className="glass-card fade-in" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>
                {method === 'credit_card' ? '💳 Credit Card' : '🏧 Debit Card'} Details
              </h3>
              <div className="form-grid" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input type="text" className="form-input" placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardForm.number}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g,'').slice(0,16);
                      v = v.replace(/(.{4})/g,'$1 ').trim();
                      setCardForm({ ...cardForm, number: v });
                    }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input type="text" className="form-input" placeholder="Name on card"
                    value={cardForm.name}
                    onChange={e => setCardForm({ ...cardForm, name: e.target.value })} />
                </div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input type="month" className="form-input"
                      value={cardForm.expiry}
                      onChange={e => setCardForm({ ...cardForm, expiry: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input type="password" className="form-input" placeholder="•••" maxLength={4}
                      value={cardForm.cvv}
                      onChange={e => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/,'').slice(0,4) })} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* UPI */}
          {method === 'upi' && (
            <div className="glass-card fade-in" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>📱 UPI Payment</h3>
              <div className="form-group">
                <label className="form-label">UPI ID</label>
                <input type="text" className="form-input" placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)} />
              </div>
              <p className="text-muted text-sm mt-1">Enter your UPI ID to proceed. A payment request will be sent.</p>
            </div>
          )}

          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '0.9rem 1.25rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🔒 Your payment is secured with 256-bit SSL encryption. We do not store card details.
            </p>
          </div>

          <button className="btn btn-primary btn-lg w-full" onClick={handlePay} disabled={loading}>
            {loading
              ? <><span className="spinner" style={{width:18,height:18,borderWidth:2,margin:0}} /> Processing...</>
              : `🔒 Pay ₹${booking.total.toLocaleString()}`
            }
          </button>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="summary-box" style={{ position: 'sticky', top: '80px' }}>
          <div className="summary-title">Booking Summary</div>
          <div className="info-row">
            <span className="info-label">Type</span>
            <span className={`booking-type-badge ${isFlightBooking ? 'type-flight' : 'type-train'}`}>
              {isFlightBooking ? '✈ Flight' : '🚆 Train'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">{isFlightBooking ? 'Flight' : 'Train'}</span>
            <span className="info-value text-sm">{vehicleName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Route</span>
            <span className="info-value text-sm">{vehicle.source} → {vehicle.destination}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Date</span>
            <span className="info-value text-sm">{booking.date}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{isFlightBooking ? 'Class' : 'Coach'}</span>
            <span className="info-value text-sm" style={{ textTransform: 'capitalize' }}>
              {isFlightBooking ? booking.class : booking.coach}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Passengers</span>
            <span className="info-value">{booking.passengers.length}</span>
          </div>
          <div className="divider" />
          <div className="info-row">
            <span className="info-label">Base fare</span>
            <span className="info-value">₹{booking.pricePerPax.toLocaleString()} × {booking.passengers.length}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Taxes & Fees</span>
            <span className="info-value">Included</span>
          </div>
          <div className="info-row" style={{ marginTop: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
              ₹{booking.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

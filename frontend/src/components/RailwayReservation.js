import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../App';

const CITIES = ['Delhi','Mumbai','Chennai','Kolkata','Bangalore','Hyderabad','Pune','Ahmedabad','Jaipur','Lucknow'];
const COACH_TYPES = { general: 'General', sleeper: 'Sleeper', ac: 'AC' };
const STEPS = ['Search', 'Select Train', 'Passengers', 'Review'];

export default function RailwayReservation() {
  const navigate = useNavigate();
  const { setBooking } = useAuth();
  const [step, setStep] = useState(0);

  const [search, setSearch] = useState({
    source: '', destination: '', date: '', passengers: 1, coach: 'sleeper'
  });
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'male' }]);

  const handleSearchChange = (e) => setSearch({ ...search, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search.source === search.destination) { setError('Source and destination cannot be the same'); return; }
    setError(''); setLoading(true);
    try {
      const { data } = await axios.get('/api/trains/search', { params: search });
      setTrains(data.trains);
      if (data.trains.length === 0) toast.info('No trains found for this route.');
      else { setStep(1); toast.success(`Found ${data.trains.length} trains!`); }
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
    } finally { setLoading(false); }
  };

  const handleSelectTrain = (train) => {
    setSelectedTrain(train);
    const count = parseInt(search.passengers);
    setPassengers(Array.from({ length: count }, (_, i) => passengers[i] || { name: '', age: '', gender: 'male' }));
    setStep(2);
  };

  const handlePassengerChange = (idx, field, val) => {
    setPassengers(passengers.map((p, i) => i === idx ? { ...p, [field]: val } : p));
  };

  const handlePassengersSubmit = (e) => {
    e.preventDefault();
    if (passengers.some(p => !p.name.trim() || !p.age)) { toast.error('Fill all passenger details'); return; }
    setStep(3);
  };

  const handleProceedToPayment = () => {
    const priceMap = { general: 'general_price', sleeper: 'sleeper_price', ac: 'ac_price' };
    const price = selectedTrain[priceMap[search.coach]];
    setBooking({ type: 'train', train: selectedTrain, passengers, coach: search.coach, date: search.date, total: price * passengers.length, pricePerPax: price });
    navigate('/payment');
  };

  const priceKey = { general: 'general_price', sleeper: 'sleeper_price', ac: 'ac_price' }[search.coach] || 'sleeper_price';
  const seatsKey = { general: 'general_seats', sleeper: 'sleeper_seats', ac: 'ac_seats' }[search.coach] || 'sleeper_seats';
  const coachLabel = { general: '🚃 General', sleeper: '🛏 Sleeper', ac: '❄️ AC' };

  return (
    <div className="page-content railway-reservation-page">
      {/* Step Indicator */}
      <div className="step-indicator">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <div className="step-num">{i < step ? '✓' : i + 1}</div>
              <span className="step-label">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`step-conn ${i < step ? 'done' : ''}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 0: Search */}
      {step === 0 && (
        <div className="search-panel fade-in">
          <div className="search-panel-header">
            <div className="search-panel-icon" style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.25),rgba(6,182,212,0.15))' }}>🚆</div>
            <div>
              <h2 className="search-panel-title">Search Trains</h2>
              <p className="search-panel-subtitle">Find the best trains across India</p>
            </div>
          </div>

          {error && <div className="alert alert-error"><span>⚠️</span>{error}</div>}

          <form onSubmit={handleSearch}>
            <div className="form-grid form-grid-2 mb-3">
              <div className="form-group">
                <label className="form-label">From</label>
                <select name="source" className="form-select" value={search.source} onChange={handleSearchChange} required>
                  <option value="">Select Station</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">To</label>
                <select name="destination" className="form-select" value={search.destination} onChange={handleSearchChange} required>
                  <option value="">Select Station</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Journey</label>
                <input type="date" name="date" className="form-input" value={search.date}
                  min={new Date().toISOString().split('T')[0]} onChange={handleSearchChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Passengers</label>
                <select name="passengers" className="form-select" value={search.passengers} onChange={handleSearchChange}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Passenger{n>1?'s':''}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Coach Type</label>
              <div className="tab-bar" style={{ maxWidth: 480 }}>
                {Object.entries(coachLabel).map(([key, label]) => (
                  <button key={key} type="button"
                    className={`tab-btn ${search.coach === key ? 'active' : ''}`}
                    onClick={() => setSearch({ ...search, coach: key })}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
              {loading ? <><span className="spinner" style={{width:18,height:18,borderWidth:2,margin:0}} /> Searching...</> : '🔍 Search Trains'}
            </button>
          </form>
        </div>
      )}

      {/* STEP 1: Select Train */}
      {step === 1 && (
        <div className="fade-in">
          <div className="flex-between mb-3">
            <div>
              <h2 className="section-title">Available Trains</h2>
              <p className="text-secondary text-sm">
                {search.source} → {search.destination} · {search.date} · {COACH_TYPES[search.coach]} class
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setStep(0)}>← Back</button>
          </div>

          {trains.map(t => (
            <div key={t._id} className="result-card mb-2" onClick={() => handleSelectTrain(t)}>
              <div className="flex-between mb-2">
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{t.train_name}</span>
                  <span className="text-muted text-sm" style={{ marginLeft: '0.5rem' }}>#{t.train_number}</span>
                </div>
                <span className="result-badge tag-green">🚆 {t.duration}</span>
              </div>

              <div className="route-display">
                <div className="route-city">
                  <div className="city-name">{t.source}</div>
                  <div className="city-time">🕐 {t.departure_time}</div>
                </div>
                <div className="route-arrow">
                  <div className="route-line">
                    <div className="route-dot" style={{ background: 'var(--accent-green)' }} />
                    <div className="route-dash" style={{ background: 'linear-gradient(90deg,var(--accent-green),var(--accent-cyan))' }} />
                    <div className="route-dot" style={{ background: 'var(--accent-cyan)' }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Direct</span>
                </div>
                <div className="route-city">
                  <div className="city-name">{t.destination}</div>
                  <div className="city-time">Arrives in {t.duration}</div>
                </div>
              </div>

              <div className="result-meta">
                <div>
                  <div className="result-price">
                    ₹{(t[priceKey]).toLocaleString()}
                    <span> / person ({COACH_TYPES[search.coach]})</span>
                  </div>
                  <div className="text-muted text-sm">{t[seatsKey]} seats available</div>
                </div>
                <button className="btn btn-success">Select →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 2: Passenger Details */}
      {step === 2 && selectedTrain && (
        <div className="fade-in">
          <div className="flex-between mb-3">
            <h2 className="section-title">Passenger Details</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>← Back</button>
          </div>

          <div className="summary-box mb-3">
            <div className="summary-title">Selected Train</div>
            <div className="flex-between">
              <span>{selectedTrain.train_name} (#{selectedTrain.train_number})</span>
              <span style={{ fontWeight: 700 }}>{selectedTrain.source} → {selectedTrain.destination}</span>
              <span className="text-success fw-700">₹{(selectedTrain[priceKey] * passengers.length).toLocaleString()} total</span>
            </div>
          </div>

          <form onSubmit={handlePassengersSubmit}>
            {passengers.map((p, i) => (
              <div key={i} className="passenger-block">
                <div className="passenger-header">
                  <h4 style={{ fontSize: '0.95rem' }}>👤 Passenger {i + 1}</h4>
                </div>
                <div className="form-grid form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" placeholder="As on ID proof"
                      value={p.name} onChange={e => handlePassengerChange(i, 'name', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-input" placeholder="Age" min="1" max="120"
                      value={p.age} onChange={e => handlePassengerChange(i, 'age', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={p.gender} onChange={e => handlePassengerChange(i, 'gender', e.target.value)}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button type="submit" className="btn btn-success btn-lg">Continue to Review →</button>
          </form>
        </div>
      )}

      {/* STEP 3: Review */}
      {step === 3 && selectedTrain && (
        <div className="fade-in">
          <div className="flex-between mb-3">
            <h2 className="section-title">Review & Pay</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => setStep(2)}>← Back</button>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>🚆 TRAIN DETAILS</h3>
            <div className="info-row"><span className="info-label">Train</span><span className="info-value">{selectedTrain.train_name} (#{selectedTrain.train_number})</span></div>
            <div className="info-row"><span className="info-label">Route</span><span className="info-value">{selectedTrain.source} → {selectedTrain.destination}</span></div>
            <div className="info-row"><span className="info-label">Date</span><span className="info-value">{search.date}</span></div>
            <div className="info-row"><span className="info-label">Departure</span><span className="info-value">{selectedTrain.departure_time}</span></div>
            <div className="info-row"><span className="info-label">Duration</span><span className="info-value">{selectedTrain.duration}</span></div>
            <div className="info-row"><span className="info-label">Coach</span><span className="info-value">{COACH_TYPES[search.coach]}</span></div>
            <div className="divider" />
            <div className="info-row"><span className="info-label">Price per person</span><span className="info-value">₹{selectedTrain[priceKey].toLocaleString()}</span></div>
            <div className="info-row">
              <span className="info-label" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Total Amount</span>
              <span className="info-value" style={{ fontSize: '1.4rem', color: 'var(--accent-green)' }}>₹{(selectedTrain[priceKey] * passengers.length).toLocaleString()}</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>👥 PASSENGERS</h3>
            {passengers.map((p, i) => (
              <div key={i} className="info-row">
                <span className="info-label">Passenger {i + 1}</span>
                <span className="info-value">{p.name}, {p.age}y, {p.gender}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-success btn-lg w-full" onClick={handleProceedToPayment}>
            💳 Proceed to Payment — ₹{(selectedTrain[priceKey] * passengers.length).toLocaleString()}
          </button>
        </div>
      )}
    </div>
  );
}

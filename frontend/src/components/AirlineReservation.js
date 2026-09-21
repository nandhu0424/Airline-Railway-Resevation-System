import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../App';

const CITIES = ['Delhi','Mumbai','Chennai','Kolkata','Bangalore','Hyderabad','Pune','Ahmedabad','Jaipur','Lucknow'];

const STEPS = ['Search', 'Select Flight', 'Passengers', 'Review'];

export default function AirlineReservation() {
  const navigate = useNavigate();
  const { setBooking } = useAuth();
  const [step, setStep] = useState(0);

  // Search form
  const [search, setSearch] = useState({
    source: '', destination: '', date: '', passengers: 1, class: 'economy'
  });

  // Results
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Selected
  const [selectedFlight, setSelectedFlight] = useState(null);

  // Passengers
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'male' }]);

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search.source === search.destination) {
      setError('Source and destination cannot be the same');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.get('/api/flights/search', { params: search });
      setFlights(data.flights);
      if (data.flights.length === 0) {
        toast.info('No flights found for this route. Try different cities.');
      } else {
        setStep(1);
        toast.success(`Found ${data.flights.length} flights!`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    // Adjust passenger list count
    const count = parseInt(search.passengers);
    const newPax = Array.from({ length: count }, (_, i) =>
      passengers[i] || { name: '', age: '', gender: 'male' }
    );
    setPassengers(newPax);
    setStep(2);
  };

  const handlePassengerChange = (idx, field, val) => {
    const updated = passengers.map((p, i) => i === idx ? { ...p, [field]: val } : p);
    setPassengers(updated);
  };

  const handlePassengersSubmit = (e) => {
    e.preventDefault();
    for (const p of passengers) {
      if (!p.name.trim() || !p.age) {
        toast.error('Please fill all passenger details');
        return;
      }
    }
    setStep(3);
  };

  const handleProceedToPayment = () => {
    const price = search.class === 'business'
      ? selectedFlight.business_price
      : selectedFlight.economy_price;
    const total = price * passengers.length;

    setBooking({
      type: 'flight',
      flight: selectedFlight,
      passengers,
      class: search.class,
      date: search.date,
      total,
      pricePerPax: price,
    });
    navigate('/payment');
  };

  const priceField = search.class === 'business' ? 'business_price' : 'economy_price';
  const seatsField = search.class === 'business' ? 'business_seats' : 'economy_seats';

  return (
    <div className="page-content flight-reservation-page">
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
        <div className="search-panel flight-search-panel fade-in">
          <div className="search-panel-header">
            <div className="search-panel-icon" style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.25),rgba(139,92,246,0.15))' }}>✈️</div>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>Search Flights</h2>
              <p className="text-muted text-sm">Find the best flights across India</p>
            </div>
          </div>

          {error && <div className="alert alert-error"><span>⚠️</span>{error}</div>}

          <form onSubmit={handleSearch}>
            <div className="form-grid form-grid-2 mb-3">
              <div className="form-group">
                <label className="form-label">From</label>
                <select name="source" className="form-select" value={search.source} onChange={handleSearchChange} required>
                  <option value="">Select City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">To</label>
                <select name="destination" className="form-select" value={search.destination} onChange={handleSearchChange} required>
                  <option value="">Select City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Journey</label>
                <input type="date" name="date" className="form-input" value={search.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleSearchChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Passengers</label>
                <select name="passengers" className="form-select" value={search.passengers} onChange={handleSearchChange}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Passenger{n>1?'s':''}</option>)}
                </select>
              </div>
            </div>

            {/* Class Selection */}
            <div className="form-group mb-3">
              <label className="form-label">Travel Class</label>
              <div className="tab-bar" style={{ maxWidth: 360 }}>
                {['economy','business'].map(cls => (
                  <button key={cls} type="button"
                    className={`tab-btn ${search.class === cls ? 'active' : ''}`}
                    onClick={() => setSearch({ ...search, class: cls })}>
                    {cls === 'economy' ? '💺 Economy' : '👑 Business'}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><span className="spinner" style={{width:18,height:18,borderWidth:2,margin:0}} /> Searching...</> : '🔍 Search Flights'}
            </button>
          </form>
        </div>
      )}

      {/* STEP 1: Select Flight */}
      {step === 1 && (
        <div className="fade-in">
          <div className="flex-between mb-3">
            <div>
              <h2 className="section-title">Available Flights</h2>
              <p className="text-secondary text-sm">
                {search.source} → {search.destination} · {search.date} · {search.passengers} pax · {search.class}
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setStep(0)}>← Back</button>
          </div>

          {flights.map(f => (
            <div key={f._id} className="result-card mb-2" onClick={() => handleSelectFlight(f)}>
              <div className="flex-between mb-2">
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{f.airline}</span>
                  <span className="text-muted text-sm" style={{ marginLeft: '0.5rem' }}>({f.flight_number})</span>
                </div>
                <span className="result-badge tag-amber">✈ {f.duration}</span>
              </div>

              <div className="route-display">
                <div className="route-city">
                  <div className="city-name">{f.source}</div>
                  <div className="city-time">🕐 {f.departure_time}</div>
                </div>
                <div className="route-arrow">
                  <div className="route-line">
                    <div className="route-dot" />
                    <div className="route-dash" />
                    <div className="route-dot" style={{ background: 'var(--accent-purple)' }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Non-stop</span>
                </div>
                <div className="route-city">
                  <div className="city-name">{f.destination}</div>
                  <div className="city-time">🕐 {f.arrival_time}</div>
                </div>
              </div>

              <div className="result-meta">
                <div>
                  <div className="result-price">
                    ₹{(f[priceField]).toLocaleString()}
                    <span> / person</span>
                  </div>
                  <div className="text-muted text-sm">
                    {f[seatsField]} seats left
                  </div>
                </div>
                <button className="btn btn-primary">Select →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 2: Passenger Details */}
      {step === 2 && selectedFlight && (
        <div className="fade-in">
          <div className="flex-between mb-3">
            <h2 className="section-title">Passenger Details</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>← Back</button>
          </div>

          <div className="summary-box mb-3">
            <div className="summary-title">Selected Flight</div>
            <div className="flex-between">
              <span>{selectedFlight.airline} ({selectedFlight.flight_number})</span>
              <span style={{ fontWeight: 700 }}>
                {selectedFlight.source} → {selectedFlight.destination}
              </span>
              <span className="text-blue fw-700">
                ₹{(selectedFlight[priceField] * passengers.length).toLocaleString()} total
              </span>
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
                    <select className="form-select" value={p.gender}
                      onChange={e => handlePassengerChange(i, 'gender', e.target.value)}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button type="submit" className="btn btn-primary btn-lg">Continue to Review →</button>
          </form>
        </div>
      )}

      {/* STEP 3: Review & Pay */}
      {step === 3 && selectedFlight && (
        <div className="fade-in">
          <div className="flex-between mb-3">
            <h2 className="section-title">Review & Pay</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => setStep(2)}>← Back</button>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>✈ FLIGHT DETAILS</h3>
            <div className="info-row"><span className="info-label">Flight</span><span className="info-value">{selectedFlight.airline} · {selectedFlight.flight_number}</span></div>
            <div className="info-row"><span className="info-label">Route</span><span className="info-value">{selectedFlight.source} → {selectedFlight.destination}</span></div>
            <div className="info-row"><span className="info-label">Date</span><span className="info-value">{search.date}</span></div>
            <div className="info-row"><span className="info-label">Departure</span><span className="info-value">{selectedFlight.departure_time}</span></div>
            <div className="info-row"><span className="info-label">Arrival</span><span className="info-value">{selectedFlight.arrival_time}</span></div>
            <div className="info-row"><span className="info-label">Class</span><span className="info-value" style={{ textTransform: 'capitalize' }}>{search.class}</span></div>
            <div className="info-row"><span className="info-label">Passengers</span><span className="info-value">{passengers.length}</span></div>
            <div className="divider" />
            <div className="info-row">
              <span className="info-label">Price per person</span>
              <span className="info-value">₹{selectedFlight[priceField].toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span className="info-label" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Total Amount</span>
              <span className="info-value" style={{ fontSize: '1.4rem', color: 'var(--accent-blue)' }}>
                ₹{(selectedFlight[priceField] * passengers.length).toLocaleString()}
              </span>
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

          <button className="btn btn-primary btn-lg w-full" onClick={handleProceedToPayment}>
            💳 Proceed to Payment — ₹{(selectedFlight[priceField] * passengers.length).toLocaleString()}
          </button>
        </div>
      )}
    </div>
  );
}

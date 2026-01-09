import { useNavigate, Link } from "react-router-dom";
import api from '../api/axios';
import MapPicker from '../components/MapPicker';
import { useState, useEffect } from 'react';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => { console.log('Geolocation denied, using map fallback'); }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!location) {
      setError('Please select your location on the map');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/register', {
        name,
        email,
        password,
        latitude: location.lat,
        longitude: location.lng
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our community to start managing tasks.</p>
        </div>

        {error && (
          <div className="error-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-row">
            <div className="input-group">
              <label>Full Name</label>
              <input
                placeholder="John Doe"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="map-section">
            <label className="map-label">Your Location</label>
            <div className="map-container-styled">
               <MapPicker location={location} setLocation={setLocation} />
            </div>
            
            <div className={`location-badge ${location ? 'success' : 'pending'}`}>
              {location ? (
                <span><i className="status-icon">✅</i> Location pinned successfully</span>
              ) : (
                <span><i className="status-icon">📍</i> Click map to set manual location</span>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className="primary-button">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
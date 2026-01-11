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
    <div className="container" style={{ maxWidth: '650px' }}>
      <div className="dashboard-header" style={{ textAlign: 'center', display: 'block' }}>
        <h2>Create Account</h2>
        <p className="subtitle">Join our community to start sharing resources.</p>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', color: '#dc2626', 
          padding: '12px', borderRadius: '8px', fontSize: '14px', 
          marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' 
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="filter-group">
            <label>Full Name</label>
            <input
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="filter-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="filter-group" style={{ marginBottom: '20px' }}>
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="admin-section" style={{ marginBottom: '24px' }}>
          <label className="filter-group" style={{ display: 'block', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>
              Your Location
            </span>
          </label>
          <div style={{ 
            borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', 
            height: '250px', background: '#f8fafc' 
          }}>
            <MapPicker location={location} setLocation={setLocation} />
          </div>
          
          <div style={{ 
            marginTop: '10px', padding: '8px 12px', borderRadius: '6px', fontSize: '13px',
            backgroundColor: location ? '#dcfce7' : '#fef9c3',
            color: location ? '#15803d' : '#854d0e',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            {location ? '✅ Location pinned' : '📍 Click map to set manual location'}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="success-button" 
          style={{ width: '100%', padding: '14px' }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p className="subtitle" style={{ textAlign: 'center', marginTop: '24px' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}

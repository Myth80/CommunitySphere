import { useState } from 'react';
import api from '../api/axios';

export default function CreateTask({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/tasks', { title, category });
      setTitle('');
      setCategory('');
      onTaskCreated(); // refresh dashboard
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-card" style={{ marginBottom: '0', border: '1px solid #e2e8f0' }}>
      <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#0f172a' }}>Share a New Resource</h3>

      {error && (
        <p style={{ 
          color: '#dc2626', 
          fontSize: '13px', 
          backgroundColor: '#fee2e2', 
          padding: '8px', 
          borderRadius: '6px', 
          marginBottom: '12px' 
        }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="filter-group">
          <input
            type="text"
            placeholder="What do you want to share? (e.g. Power Drill)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: '0' }}
          />
        </div>

        <div className="filter-group">
          <input
            type="text"
            placeholder="Category (e.g. Tools, Kitchen, Gardening)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ marginBottom: '0' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="success-button"
          style={{ width: '100%', marginTop: '4px' }}
        >
          {loading ? 'Creating...' : 'Post Resource'}
        </button>
      </form>
    </div>
  );
}

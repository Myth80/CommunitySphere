import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, tasksRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/tasks')
      ]);
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Admin access denied or failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const banUser = async (userId) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return;
    try {
      await api.put(`/admin/ban/${userId}`);
      fetchAdminData();
    } catch (err) {
      alert("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout" style={{ textAlign: 'center', padding: '100px' }}>
        <div className="loading-state">Syncing secure data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h2>Admin Control Panel</h2>
          <p className="subtitle">
            Global overview of users, platform trust, and system tasks.
          </p>
        </div>
        <button 
          style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6' }} 
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* STATS OVERVIEW */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Tasks</span>
          <span className="stat-value">{tasks.filter(t => t.status !== 'COMPLETED').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">System Health</span>
          <span className="stat-value" style={{ color: '#10b981' }}>Online</span>
        </div>
      </div>

      {/* USERS SECTION */}
      <section className="admin-section">
        <h3>User Management</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Trust Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                      color: user.role === 'admin' ? '#6366f1' : '#64748b'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${user.trustScore}%`, 
                          height: '100%', 
                          background: user.trustScore > 70 ? '#10b981' : '#f59e0b' 
                        }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600' }}>{user.trustScore}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${user.isBanned ? 'banned' : 'active'}`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td>
                    {!user.isBanned && user.role !== 'admin' && (
                      <button className="btn-danger-soft" onClick={() => banUser(user._id)}>
                        Ban User
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TASKS SECTION */}
      <section className="admin-section" style={{ marginTop: '40px' }}>
        <h3>System Tasks</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Participants</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td style={{ fontWeight: '600', color: '#1e293b' }}>{task.title}</td>
                  <td>
                    <span className={`status ${task.status}`} style={{ fontSize: '10px' }}>
                      {task.status}
                    </span>
                  </td>
                  <td><span className="category-tag">{task.category || 'N/A'}</span></td>
                  <td>
                    <div style={{ fontSize: '12px' }}>
                      <div style={{ color: '#64748b' }}>From: <span style={{ color: '#1e293b' }}>{task.createdBy?.name}</span></div>
                      {task.acceptedBy && (
                        <div style={{ color: '#64748b' }}>To: <span style={{ color: '#1e293b' }}>{task.acceptedBy.name}</span></div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

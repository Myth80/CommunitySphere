import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useContext } from 'react';
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

  if (loading) return <div className="loading-state">Syncing secure data...</div>;

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
  <div>
    <h2>Admin Control Panel</h2>
    <p className="subtitle">
      Global overview of users, platform trust, and system tasks.
    </p>
  </div>

  <button className="danger" onClick={handleLogout}>
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
          <span className="stat-value" style={{color: '#10b981'}}>Online</span>
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
                  <td><span className="role-badge">{user.role}</span></td>
                  <td>
                    <div className="trust-score-bar">
                        <span className="score-text">{user.trustScore}</span>
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
      <section className="admin-section">
        <h3>System Tasks</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Created By</th>
                <th>Accepted By</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td className="font-semibold">{task.title}</td>
                  <td><span className={`status ${task.status}`}>{task.status}</span></td>
                  <td><span className="category-tag">{task.category || 'N/A'}</span></td>
                  <td>{task.createdBy?.name}</td>
                  <td>{task.acceptedBy ? task.acceptedBy.name : <span className="text-muted">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
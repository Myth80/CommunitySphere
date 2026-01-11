import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CreateTask from '../components/CreateTask';
import { getUserIdFromToken } from '../utils/getUserId';
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const userId = getUserIdFromToken();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchTasks = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page: pageNumber,
        limit: 6,
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { category: categoryFilter })
      }).toString();

      const res = await api.get(`/api/tasks?${query}`);

      // ✅ Defensive updates (CRITICAL)
      setTasks(Array.isArray(res.data?.tasks) ? res.data.tasks : []);
      setTotalPages(res.data?.totalPages || 1);
      setPage(res.data?.page || 1);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
      setTasks([]);
      setTotalPages(1);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(1);
  }, [statusFilter, categoryFilter]);

  const acceptTask = async (taskId) => {
    await api.put(`/api/tasks/${taskId}/accept`);
    fetchTasks(page);
  };

  const completeTask = async (taskId) => {
    await api.put(`/tasks/${taskId}/complete`);
    fetchTasks(page);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'OPEN':
        return { backgroundColor: '#dcfce7', color: '#15803d' };
      case 'ACCEPTED':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'COMPLETED':
        return { backgroundColor: '#f1f5f9', color: '#475569' };
      default:
        return {};
    }
  };

  if (loading) {
    return (
      <div className="loading-state" style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>
        <p>Loading community resources...</p>
      </div>
    );
  }

  return (
    <div className='dashboard-layout'>
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h2>Resource Dashboard</h2>
          <p className="subtitle">Discover and manage community resources</p>
        </div>
        <button
          style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6' }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* ACTIONS */}
      <div className="dashboard-actions">
        <CreateTask onTaskCreated={() => fetchTasks(1)} />

        <div className="filter-bar">
          <div className="filter-group">
            <label>Filter Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search Category</label>
            <input
              type="text"
              placeholder="e.g. Tools, Skill..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TASK GRID */}
      {!tasks || tasks.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <h3>No resources found</h3>
          <p className="subtitle">Try adjusting your filters or be the first to share something!</p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <div className="task-card-header">
                <span className="status" style={getStatusStyle(task.status)}>
                  {task.status}
                </span>
                <span className="category-tag">{task.category || 'General'}</span>
              </div>

              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>{task.title}</h3>
              <p className="created-by">
                Shared by: <span>{task.createdBy?.name || 'Community Member'}</span>
              </p>

              <div className="task-card-footer" style={{ marginTop: '20px' }}>
                {task.status === 'OPEN' && task.createdBy?._id !== userId && (
                  <button
                    className="primary-button"
                    style={{ width: '100%' }}
                    onClick={() => acceptTask(task._id)}
                  >
                    Request Resource
                  </button>
                )}

                {task.status === 'ACCEPTED' && task.createdBy?._id === userId && (
                  <button
                    className="success-button"
                    style={{ width: '100%' }}
                    onClick={() => completeTask(task._id)}
                  >
                    Mark as Returned / Finished
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => fetchTasks(page - 1)} style={{ visibility: page <= 1 ? 'hidden' : 'visible' }}>
          ← Previous
        </button>

        <span className="page-info">
          Page <strong>{page}</strong> of {totalPages}
        </span>

        <button disabled={page >= totalPages} onClick={() => fetchTasks(page + 1)} style={{ visibility: page >= totalPages ? 'hidden' : 'visible' }}>
          Next →
        </button>
      </div>
    </div>
  );
}

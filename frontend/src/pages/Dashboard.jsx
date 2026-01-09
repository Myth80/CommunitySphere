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
        limit: 6, // Changed to 6 for better grid alignment (2x3 or 3x2)
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { category: categoryFilter })
      }).toString();

      const res = await api.get(`/tasks?${query}`);
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(1);
  }, [statusFilter, categoryFilter]);

  const acceptTask = async (taskId) => {
    await api.put(`/tasks/${taskId}/accept`);
    fetchTasks(page);
  };

  const completeTask = async (taskId) => {
    await api.put(`/tasks/${taskId}/complete`);
    fetchTasks(page);
  };

  return (
    <div className='dashboard-layout'>
      {/* HEADER SECTION */}
      <header className="dashboard-header">
        <div>
          <h2>Task Dashboard</h2>
          <p className="subtitle">Manage your ongoing tasks and assignments</p>
        </div>
        <button className="danger" onClick={handleLogout}>Logout</button>
      </header>

      {/* ACTION AREA */}
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
              placeholder="e.g. Design, Backend"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TASK GRID */}
      {loading ? (
        <div className="loading-state">Loading your tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Try adjusting your filters or create a new task above.</p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-card-header">
                <span className={`status ${task.status}`}>{task.status}</span>
                <span className="category-tag">{task.category || 'General'}</span>
              </div>
              
              <h3>{task.title}</h3>
              <p className="created-by">Created by: <span>{task.createdBy?.name}</span></p>

              <div className="task-card-footer">
                {task.status === 'OPEN' && task.createdBy?._id !== userId && (
                  <button className="primary-button" onClick={() => acceptTask(task._id)}>
                    Accept Task
                  </button>
                )}

                {task.status === 'ACCEPTED' &&
                task.createdBy?._id === userId && (
                <button className="success-button" onClick={() => completeTask(task._id)}>
                 Mark Completed
                 </button>
)}

              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => fetchTasks(page - 1)}>
          Previous
        </button>
        <span className="page-info">
          Page <strong>{page}</strong> of {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => fetchTasks(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
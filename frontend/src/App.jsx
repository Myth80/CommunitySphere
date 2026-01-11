import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes*/}
        <Route 
          path="/register" 
          element={
            <div className="auth-wrapper">
              <Register />
            </div>
          } 
        />
        <Route 
          path="/login" 
          element={
            <div className="auth-wrapper">
              <Login />
            </div>
          } 
        />

        {/* App Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="dashboard-layout">
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div className="dashboard-layout">
                <AdminDashboard />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

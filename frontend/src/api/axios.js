import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Attach token automatically (except auth routes)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // ❌ Do NOT attach token to auth routes
  if (
    token &&
    !config.url.includes('/auth/login') &&
    !config.url.includes('/auth/register')
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

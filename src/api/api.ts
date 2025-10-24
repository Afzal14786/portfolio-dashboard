import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1',
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses - NO REDIRECTS!
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Simply reject the error - let components handle navigation
    return Promise.reject(error);
  }
);

export default api;
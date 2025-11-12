import axios from 'axios';
import useAuthStore from './store/authStore';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add admin password for admin requests
API.interceptors.request.use(
  (config) => {
    const { role, adminPassword } = useAuthStore.getState();
    
    // Add admin password header for admin role
    if (role === 'admin' && adminPassword) {
      config.headers['admin-password'] = adminPassword;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    // If backend returns { success, message, data }, extract the data property
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // No automatic logout on 401 since there's no authentication
    return Promise.reject(error);
  }
);

export default API;

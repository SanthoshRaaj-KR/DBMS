import axios from 'axios';
import useAuthStore from './store/authStore';
import toast from 'react-hot-toast';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' 
});

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

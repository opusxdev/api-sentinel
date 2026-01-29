import axios from 'axios';
import { useStore } from '../store/store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear store state
      const { logout } = useStore.getState();
      logout();
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
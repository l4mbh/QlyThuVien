import axios from 'axios';
import { toast } from 'sonner';

// Centralized API client following the "Always 200" strategy of the project
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle "Always 200" and errors
api.interceptors.response.use(
  (response) => {
    const { code, message, error } = response.data;
    
    // Check for business errors (since HTTP is always 200)
    if (code !== 'SUCCESS' && code !== 200) {
      toast.error(message || error || 'Something went wrong');
      return Promise.reject(response.data);
    }
    
    return response.data;
  },
  (error) => {
    toast.error('Connection error. Please try again later.');
    return Promise.reject(error);
  }
);

export default api;

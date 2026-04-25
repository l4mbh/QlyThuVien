import { createSharedApiClient } from '@qltv/shared';
import { toast } from 'sonner';

// Each app initializes its own instance
const api = createSharedApiClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  getToken: () => localStorage.getItem('token'),
  onUnauthorized: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('reader_phone');
    localStorage.removeItem('reader_user');
    // Redirect to login if on a protected page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  },
  onError: (message) => {
    toast.error(message);
  }
});

export default api;

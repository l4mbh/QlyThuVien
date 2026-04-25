import { createSharedApiClient } from '@qltv/shared';
import { toast } from 'sonner';

// Each app initializes its own instance
const api = createSharedApiClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  getToken: () => localStorage.getItem('token'),
  onUnauthorized: () => {
    localStorage.removeItem('token');
    // For reader app, we don't always force redirect to login, 
    // but we clear the session.
  },
  onError: (message) => {
    toast.error(message);
  }
});

export default api;

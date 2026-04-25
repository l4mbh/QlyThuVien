import { createSharedApiClient } from '@qltv/shared';
import { toast } from 'sonner';

// Each app initializes its own instance
const api = createSharedApiClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  getToken: () => localStorage.getItem('token'),
  getExtraHeaders: () => {
    const phone = localStorage.getItem('reader_phone');
    return phone ? { 'X-Reader-Phone': phone } : {};
  },
  onUnauthorized: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('reader_phone');
  },
  onError: (message) => {
    toast.error(message);
  }
});

export default api;

import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
}

export const useAuth = () => {
  const token = localStorage.getItem('reader_token');

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (!token) return null;
      try {
        const res = await api.get('/auth/me');
        return res.data.data as User;
      } catch (err) {
        localStorage.removeItem('reader_token');
        localStorage.removeItem('reader_user');
        return null;
      }
    },
    enabled: !!token,
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem('reader_token');
    localStorage.removeItem('reader_user');
    window.location.href = '/login';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    refetchMe: refetch
  };
};

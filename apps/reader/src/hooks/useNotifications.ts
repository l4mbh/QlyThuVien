import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';
import { QUERY_KEYS } from '@qltv/shared';
import type { NotificationEntity } from '@qltv/shared';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { user, isAuthenticated } = useAuth();
  
  const query = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS.LIST, user?.id],
    queryFn: () => notificationService.getAll().then(res => res.data as NotificationEntity[]),
    enabled: isAuthenticated && !!user,
    staleTime: 10000, // 10s
    retry: 2
  });

  const unreadCount = query.data?.filter(n => !n.isRead).length || 0;

  return {
    ...query,
    unreadCount
  };
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS.LIST] });
    },
  });
};
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS.LIST] });
    },
  });
};

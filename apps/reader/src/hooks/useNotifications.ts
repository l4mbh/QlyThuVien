import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';
import { QUERY_KEYS } from '@qltv/shared';
import type { NotificationEntity } from '@qltv/shared';

export const useNotifications = () => {
  const token = localStorage.getItem('reader_token');
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS.LIST],
    queryFn: () => notificationService.getAll().then(res => res.data as NotificationEntity[]),
    enabled: !!token
  });
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

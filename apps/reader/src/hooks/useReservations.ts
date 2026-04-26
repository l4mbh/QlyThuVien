import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '../services/reservation.service';
import { QUERY_KEYS } from '@qltv/shared';

export const useMyReservations = () => {
  const token = localStorage.getItem('reader_token');
  return useQuery({
    queryKey: [QUERY_KEYS.RESERVATIONS?.MY || 'RESERVATIONS_MY'],
    queryFn: () => reservationService.getMy().then(res => res.data),
    enabled: !!token
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { bookId: string; phone?: string }) => reservationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESERVATIONS?.MY || 'RESERVATIONS_MY'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS?.DETAIL] });
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESERVATIONS?.MY || 'RESERVATIONS_MY'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS?.DETAIL] });
    },
  });
};

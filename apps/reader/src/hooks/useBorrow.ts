import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { borrowService } from '../services/borrow.service';
import { QUERY_KEYS } from '@qltv/shared';
import type { BorrowEntity } from '@qltv/shared';
import { toast } from 'sonner';

export const useMyBorrowed = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BORROWS.LIST, 'my'],
    queryFn: () => borrowService.getMyBorrowed().then(res => res.data as BorrowEntity[]),
  });
};

export const useBorrowBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { bookId: string; readerId: string }) => borrowService.borrow(data),
    onSuccess: (res) => {
      if (res.code === 'SUCCESS' || res.code === 200 || res.code === 0) {
        toast.success('Book borrowed successfully!');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BORROWS.LIST] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS.LIST] });
      }
    },
  });
};

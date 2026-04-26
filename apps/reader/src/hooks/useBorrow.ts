import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { borrowService } from '../services/borrow.service';
import { QUERY_KEYS } from '@qltv/shared';
import type { BorrowEntity } from '@qltv/shared';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const useMyBorrowed = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.BORROWS.LIST, 'my', user?.id],
    queryFn: async () => {
      const res = await borrowService.getMyBorrowed();
      const records = res.data as any[];
      
      const items: any[] = [];
      const now = new Date();

      records.forEach(record => {
        record.borrowItems.forEach((item: any) => {
          if (item.status === 'RETURNED') return;

          const dueDate = new Date(record.dueDate);
          const diffTime = dueDate.getTime() - now.getTime();
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let status = 'normal';
          if (daysLeft < 0) status = 'overdue';
          else if (daysLeft <= 3) status = 'due_soon';

          items.push({
            id: item.id,
            title: item.book.title,
            author: item.book.author,
            dueDate: new Date(record.dueDate).toLocaleDateString('en-GB'),
            status,
            daysLeft
          });
        });
      });

      return items;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5000, // 5s stale time to avoid redundant calls
    retry: 2 // Allow a few retries for network glitches
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

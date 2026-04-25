import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../features/books/book.service';
import { QUERY_KEYS } from '@qltv/shared';
import type { BookEntity } from '@qltv/shared';
import { toast } from 'sonner';

export const useAdminBooks = (params?: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKS.LIST, params],
    queryFn: () => bookService.list(params).then(res => res.data as BookEntity[]),
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => bookService.create(data),
    onSuccess: () => {
      toast.success('Book created successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS.LIST] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => bookService.update(id, data),
    onSuccess: () => {
      toast.success('Book updated successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS.LIST] });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookService.delete(id),
    onSuccess: () => {
      toast.success('Book deleted successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS.LIST] });
    },
  });
};

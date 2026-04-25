import { useQuery } from '@tanstack/react-query';
import { bookService } from '../services/book.service';
import { QUERY_KEYS } from '@qltv/shared';
import type { BookEntity } from '@qltv/shared';

export const useBooks = (params?: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKS.LIST, params],
    queryFn: () => bookService.list(params).then(res => res.data as BookEntity[]),
  });
};

export const useBookDetail = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKS.DETAIL, id],
    queryFn: () => bookService.get(id!).then(res => res.data as BookEntity),
    enabled: !!id,
  });
};

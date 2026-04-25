import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import { QUERY_KEYS } from '@qltv/shared';
import type { CategoryEntity } from '@qltv/shared';

export const useCategories = (params?: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES.LIST, params],
    queryFn: () => categoryService.list(params).then((res: any) => {
      // API returns { data: { items, total }, code } -> factory unwraps to { items, total }
      const payload = res.data ?? res;
      return (payload.items ?? payload) as CategoryEntity[];
    }),
  });
};

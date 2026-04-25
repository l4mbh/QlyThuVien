import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { createCategoryApi, QUERY_KEYS } from '@qltv/shared';
import type { CategoryEntity } from '@qltv/shared';

const categoryService = createCategoryApi(api);

export const useCategories = (params?: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES.LIST, params],
    queryFn: () => categoryService.list(params).then(res => res.data as CategoryEntity[]),
  });
};

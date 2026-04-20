import { useState, useEffect, useCallback } from "react";
import type { PaginatedData } from "../types/response.type";
import { useDebounce } from "./use-debounce";

interface UseDataTableProps<T> {
  fetchData: (params: {
    page: number;
    limit: number;
    search?: string;
  }) => Promise<{ data?: PaginatedData<T>; code: number }>;
  initialLimit?: number;
}

export function useDataTable<T>({ fetchData, initialLimit = 10 }: UseDataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  // Debounce search term
  const debouncedSearch = useDebounce(search, 500);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchData({
        page,
        limit,
        search: debouncedSearch,
      });

      if (response.code === 0 && response.data) {
        setData(response.data.items);
        setTotal(response.data.meta.total);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchData, page, limit, debouncedSearch]);

  // Load data when params change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const refresh = () => loadData();

  return {
    data,
    loading,
    page,
    limit,
    total,
    totalPages,
    search,
    setSearch,
    setPage,
    setLimit,
    refresh,
  };
}

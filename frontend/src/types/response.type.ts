export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T = any> {
  data?: T;
  code: string | number;

  error?: {
    msg: string;
  };
}

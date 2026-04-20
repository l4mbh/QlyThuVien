import { ErrorCode } from "../../constants/errors/error.enum";

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
  code: number | ErrorCode;
  error?: {
    msg: string;
  };
}

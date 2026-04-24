import { api } from "@/services/api";
import type { ApiResponse } from "@/types/response.type";
import type { BorrowRecord, CreateBorrowDTO, ReturnBookDTO } from "@/types/borrow/borrow.entity";

export const borrowService = {
  /**
   * Get all borrow records with optional filters
   */
  getAllBorrows: async (params?: { status?: string; userId?: string }) => {
    const response = await api.get<ApiResponse<BorrowRecord[]>>("/borrow", {
      params,
    });
    return response.data;
  },

  /**
   * Get a single borrow record by ID
   */
  getBorrowById: async (id: string) => {
    const response = await api.get<ApiResponse<BorrowRecord>>(`/borrow/${id}`);
    return response.data;
  },

  /**
   * Create a new borrow record (Multi-book transaction)
   */
  createBorrow: async (data: CreateBorrowDTO) => {
    const response = await api.post<ApiResponse<BorrowRecord>>("/borrow", data);
    return response.data;
  },

  /**
   * Return a specific book from a borrow record
   */
  returnBook: async (data: ReturnBookDTO) => {
    const response = await api.post<ApiResponse<any>>("/borrow/return", data);
    return response.data;
  },
};


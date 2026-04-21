import { api } from "@/services/api";
import type { ApiResponse } from "@/types/response.type";
import type { BorrowItem } from "@/types/borrow.entity";

export const borrowService = {
  getReaderBorrowings: async (userId: string) => {
    const response = await api.get<ApiResponse<BorrowItem[]>>("/borrow", {
      params: { userId },
    });
    return response.data;
  },

  returnBook: async (borrowItemId: string) => {
    const response = await api.post<ApiResponse<any>>("/borrow/return", {
      borrowItemId,
    });
    return response.data;
  },
};

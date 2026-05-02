import { api } from "@/services/api";
import type { ApiResponse } from "@/types/response.type";

export interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  status: 'PENDING' | 'READY' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  position?: number;
  user: {
    name?: string;
    email?: string;
    phoneNormalized?: string;
  };
  book: {
    title: string;
    author: string;
    coverUrl?: string;
    availableQuantity: number;
  };
}

export const reservationService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Reservation[]>>("/reservations");
    return response.data;
  },

  cancel: async (id: string, data?: { reason: string; note?: string }) => {
    const response = await api.post<ApiResponse<Reservation>>(`/reservations/${id}/cancel`, data);
    return response.data;
  }
};

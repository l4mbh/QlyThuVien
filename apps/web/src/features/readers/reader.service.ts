import { api } from "@/services/api";
import type { ApiResponse } from "@/types/response.type";
import type { Reader, CreateReaderDto, UpdateReaderDto } from "@/types/reader/reader.entity";

export const readerService = {
  getReaders: async () => {
    const response = await api.get<ApiResponse<Reader[]>>("/users", {
      params: { role: "READER" },
    });
    return response.data;
  },

  getReaderById: async (id: string) => {
    const response = await api.get<ApiResponse<Reader>>(`/users/${id}`);
    return response.data;
  },

  createReader: async (data: CreateReaderDto) => {
    const response = await api.post<ApiResponse<Reader>>("/users", {
      ...data,
      role: "READER",
    });
    return response.data;
  },

  updateReader: async (id: string, data: UpdateReaderDto) => {
    const response = await api.patch<ApiResponse<Reader>>(`/users/${id}`, data);
    return response.data;
  },

  toggleBlockReader: async (id: string) => {
    const response = await api.patch<ApiResponse<Reader>>(`/users/${id}/block`);
    return response.data;
  },
  
  lookupReaderByPhone: async (phone: string) => {
    const response = await api.get<ApiResponse<Reader>>("/users/lookup", {
      params: { phone },
    });
    return response.data;
  },
};


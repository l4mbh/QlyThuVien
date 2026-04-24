import { api } from "@/services/api";
import type { ApiResponse, PaginatedData } from "@/types/response.type";
import type { BookEntity, CreateBookDTO, UpdateBookDTO, BookFetchInfo, AdjustInventoryDTO, InventoryLogEntity } from "@/types/books/book.entity";
import type { CategoryEntity } from "@/types/category/category.entity";

export const bookService = {
  getBooks: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    available?: boolean;
    sort?: string;
  }): Promise<ApiResponse<PaginatedData<BookEntity>>> => {
    const response = await api.get("/books", { params });
    return response.data;
  },

  getBookById: async (id: string): Promise<ApiResponse<BookEntity>> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (data: CreateBookDTO): Promise<ApiResponse<BookEntity>> => {
    const response = await api.post("/books", data);
    return response.data;
  },

  updateBook: async (id: string, data: UpdateBookDTO): Promise<ApiResponse<BookEntity>> => {
    const response = await api.patch(`/books/${id}`, data);
    return response.data;
  },

  deleteBook: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  bulkDeleteBooks: async (ids: string[]): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.delete("/books/bulk", { data: { ids } });
    return response.data;
  },

  fetchISBN: async (isbn: string): Promise<ApiResponse<BookFetchInfo>> => {
    const response = await api.get(`/books/fetch-isbn/${isbn}`);
    return response.data;
  },

  adjustInventory: async (id: string, data: AdjustInventoryDTO): Promise<ApiResponse<BookEntity>> => {
    const response = await api.post(`/books/${id}/inventory-adjustments`, data);
    return response.data;
  },

  getInventoryLogs: async (id: string): Promise<ApiResponse<InventoryLogEntity[]>> => {
    const response = await api.get(`/books/${id}/inventory-logs`);
    return response.data;
  },

  getCategories: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<PaginatedData<CategoryEntity>>> => {
    const response = await api.get("/categories", { params });
    return response.data;
  },
};


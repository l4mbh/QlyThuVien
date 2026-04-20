import { api } from "@/services/api";
import type { 
  CategoryEntity, 
  CreateCategoryDTO, 
  UpdateCategoryDTO, 
} from "@/types/category/category.entity";
import type { ApiResponse, PaginatedData } from "@/types/response.type";

export const categoryService = {
  getAllCategories: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedData<CategoryEntity>>> => {
    const response = await api.get("/categories", { params });
    return response.data;
  },

  createCategory: async (data: CreateCategoryDTO): Promise<ApiResponse<CategoryEntity>> => {
    const response = await api.post("/categories", data);
    return response.data;
  },

  updateCategory: async (id: string, data: UpdateCategoryDTO): Promise<ApiResponse<CategoryEntity>> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
  
  bulkDeleteCategories: async (ids: string[]): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.delete("/categories/bulk", { data: { ids } });
    return response.data;
  }
};

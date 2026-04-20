export interface CategoryEntity {
  id: string;
  name: string;
  code: string | null;
  createdAt: Date;
}

export interface CreateCategoryDTO {
  name: string;
  code?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  code?: string;
}

export interface CategoryFilterDTO {
  search?: string;
  page?: number;
  limit?: number;
}

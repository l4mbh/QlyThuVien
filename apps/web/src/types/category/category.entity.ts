export interface CategoryEntity {
  id: string;
  name: string;
  code: string | null;
  createdAt: string;
  _count?: {
    books: number;
  };
}

export interface CreateCategoryDTO {
  name: string;
  code?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  code?: string;
}


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

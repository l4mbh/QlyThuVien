import { type CategoryEntity } from "../category/category.entity";

export interface BookEntity {
  id: string;
  title: string;
  author: string;
  isbn: string;
  totalQuantity: number;
  availableQuantity: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string | null;
  category?: CategoryEntity;
  callNumber: string | null;
  coverUrl?: string;
}

export interface CreateBookDTO {
  title: string;
  author: string;
  isbn: string;
  totalQuantity: number;
  categoryId?: string;
  callNumber?: string;
  publishedYear?: string | number;
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  totalQuantity?: number;
  availableQuantity?: number;
  isArchived?: boolean;
  categoryId?: string;
  callNumber?: string;
}

export interface BookFetchInfo {
  title: string;
  author: string;
  category?: string;
  coverUrl?: string;
  publishedYear?: string;
  source?: string;
}

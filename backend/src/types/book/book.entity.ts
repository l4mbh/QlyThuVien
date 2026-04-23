import { CategoryEntity } from "../category/category.entity";

export interface BookEntity {
  id: string;
  title: string;
  author: string;
  isbn: string;
  totalQuantity: number;
  availableQuantity: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  category?: CategoryEntity;
  callNumber: string | null;
  coverUrl: string | null;
}

export interface CreateBookDTO {
  title: string;
  author: string;
  isbn: string;
  totalQuantity: number;
  categoryId?: string;
  callNumber?: string;
  coverUrl?: string;
  publishedYear?: string | number; // Used for auto call number if not provided
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  totalQuantity?: number;
  availableQuantity?: number;
  isArchived?: boolean;
  categoryId?: string;
  callNumber?: string;
  coverUrl?: string;
}

export interface BookFilterDTO {
  search?: string;
  categoryId?: string;
  available?: boolean;
  sort?: string; // newest, az, author
  page?: number;
  limit?: number;
}

export enum InventoryLogReason {
  RESTOCK = "RESTOCK",
  DAMAGED = "DAMAGED",
  LOST = "LOST",
  MANUAL_ADJUST = "MANUAL_ADJUST"
}

export interface InventoryLogEntity {
  id: string;
  bookId: string;
  change: number;
  reason: InventoryLogReason;
  note: string | null;
  userId: string;
  createdAt: Date;
}

export interface AdjustInventoryDTO {
  change: number;
  reason: InventoryLogReason;
  note?: string;
}

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
}

export interface CreateBookDTO {
  title: string;
  author: string;
  isbn: string;
  totalQuantity: number;
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  totalQuantity?: number;
  availableQuantity?: number;
  isArchived?: boolean;
}

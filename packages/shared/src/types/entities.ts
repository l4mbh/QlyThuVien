export interface BookEntity {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  coverUrl?: string;
  categoryId: string;
  totalQuantity: number;
  availableQuantity: number;
  callNumber?: string;
  category?: CategoryEntity;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryEntity {
  id: string;
  name: string;
  description?: string;
  booksCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserEntity {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'READER';
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

export interface BorrowEntity {
  id: string;
  bookId: string;
  readerId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  fineAmount: number;
  book?: BookEntity;
  reader?: UserEntity;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationEntity {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

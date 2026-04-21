import { BorrowRecordStatus, BorrowItemStatus } from "@prisma/client";

export interface BorrowRecordEntity {
  id: string;
  userId: string;
  borrowDate: Date;
  dueDate: Date;
  status: BorrowRecordStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BorrowItemEntity {
  id: string;
  borrowRecordId: string;
  bookId: string;
  status: BorrowItemStatus;
  borrowedAt: Date;
  returnedAt?: Date | null;
  updatedAt: Date;
}

export interface CreateBorrowDTO {
  userId: string;
  bookIds: string[];
  dueDate: Date;
}

export interface ReturnBookDTO {
  borrowItemIds: string[];
}

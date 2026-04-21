import type { Reader } from "./reader/reader.entity";

export enum BorrowRecordStatus {
  BORROWING = "BORROWING",
  OVERDUE = "OVERDUE",
  COMPLETED = "COMPLETED",
}

export enum BorrowItemStatus {
  BORROWING = "BORROWING",
  RETURNED = "RETURNED",
  OVERDUE = "OVERDUE",
}

export interface BorrowItem {
  id: string;
  borrowRecordId: string;
  bookId: string;
  book: {
    id: string;
    title: string;
    coverUrl?: string;
    callNumber?: string;
  };
  status: BorrowItemStatus;
  borrowedAt: string;
  returnedAt?: string;
  dueDate: string;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  user?: Reader;
  borrowDate: string;
  dueDate: string;
  status: BorrowRecordStatus;
  borrowItems: BorrowItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BorrowSummary {
  borrowedCount: number;
  overdueCount: number;
  borrowLimit: number;
}

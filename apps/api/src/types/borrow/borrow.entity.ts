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
  fineAmount?: number | null;
  returnedAt?: Date | null;
  updatedAt: Date;
}

import { CreateBorrowDTO as ICreateBorrowDTO, ReturnBookDTO as IReturnBookDTO } from "@qltv/shared";

export type CreateBorrowDTO = ICreateBorrowDTO;
export type ReturnBookDTO = IReturnBookDTO;


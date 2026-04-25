export interface CreateBorrowDTO {
  userId?: string;
  phone?: string;
  bookIds: string[];
  dueDate: string | Date;
}

export interface ReturnBookDTO {
  borrowItemIds: string[];
}

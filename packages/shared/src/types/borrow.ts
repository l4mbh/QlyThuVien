export interface CreateBorrowDTO {
  userId?: string;
  phone?: string;
  bookIds: string[];
  dueDate: string | Date;
  reservationId?: string;
}

export interface ReturnBookDTO {
  borrowItemIds: string[];
}

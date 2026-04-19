export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  status: "AVAILABLE" | "BORROWED";
}

export interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
}

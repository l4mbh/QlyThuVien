export enum ReaderStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export enum UserRole {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  READER = "READER",
}

export interface Reader {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: ReaderStatus;
  borrowLimit: number;
  currentBorrowCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReaderDto {
  name: string;
  email: string;
  password?: string; // Optional if auto-generated or not required for readers
  borrowLimit: number;
}

export interface UpdateReaderDto {
  name?: string;
  borrowLimit?: number;
  status?: ReaderStatus;
}

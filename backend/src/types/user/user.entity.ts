import { UserRole, UserStatus } from "@prisma/client";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  borrowLimit: number;
  currentBorrowCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role?: UserRole;
  borrowLimit?: number;
}

export interface UpdateUserDTO {
  name?: string;
  role?: UserRole;
  borrowLimit?: number;
}

import { UserRole, UserStatus } from "@prisma/client";

export interface UserEntity {
  id: string;
  name?: string | null;
  email?: string | null;
  phoneRaw?: string | null;
  phoneNormalized?: string | null;
  role: UserRole;
  status: UserStatus;
  isGuest: boolean;
  borrowLimit: number;
  currentBorrowCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  name?: string;
  email?: string;
  phoneRaw?: string;
  phoneNormalized?: string;
  password?: string;
  role?: UserRole;
  borrowLimit?: number;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  phoneRaw?: string;
  phoneNormalized?: string;
  role?: UserRole;
  borrowLimit?: number;
}


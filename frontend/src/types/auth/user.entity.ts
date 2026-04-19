export enum UserRole {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

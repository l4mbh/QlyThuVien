export interface CreateReservationDTO {
  userId?: string;
  phone?: string;
  bookId: string;
}

export interface ReservationEntity {
  id: string;
  userId: string;
  bookId: string;
  status: string; // From Prisma
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date | null;
}

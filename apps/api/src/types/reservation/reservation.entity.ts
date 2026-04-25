import { ReservationStatus } from "@prisma/client";
import { CreateReservationDTO as ICreateReservationDTO } from "@qltv/shared";

export interface ReservationEntity {
  id: string;
  userId: string;
  bookId: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date | null;
}

export type CreateReservationDTO = ICreateReservationDTO;

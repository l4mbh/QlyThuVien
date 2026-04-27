import prisma from "../../config/db/db";
import { ReservationStatus } from "@prisma/client";

export class ReservationRepository {
  async findAll() {
    return prisma.reservation.findMany({
      include: {
        user: true,
        book: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true,
        book: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.reservation.findMany({
      where: { userId },
      include: {
        book: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findPendingByBookId(bookId: string) {
    return prisma.reservation.findMany({
      where: { 
        bookId,
        status: ReservationStatus.PENDING 
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async findFirstPending(bookId: string) {
    return prisma.reservation.findFirst({
      where: { 
        bookId,
        status: ReservationStatus.PENDING 
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async countStatusBefore(bookId: string, status: ReservationStatus, createdAt: Date) {
    return prisma.reservation.count({
      where: {
        bookId,
        status,
        createdAt: { lt: createdAt },
      },
    });
  }

  async findExisting(userId: string, bookId: string) {
    return prisma.reservation.findFirst({
      where: {
        userId,
        bookId,
        status: {
          in: [ReservationStatus.PENDING, ReservationStatus.READY]
        }
      }
    });
  }

  async findUrgent(limit: number = 5) {
    return prisma.reservation.findMany({
      where: {
        status: ReservationStatus.READY,
        expiresAt: { not: null },
        book: {
          availableQuantity: { gt: 0 }
        }
      },
      include: {
        user: true,
        book: true,
      },
      orderBy: {
        expiresAt: "asc"
      },
      take: limit
    });
  }
}

import prisma from "../../config/db/db";
import { ReservationRepository } from "../../repositories/reservation/reservation.repository";
import { CreateReservationDTO } from "../../types/reservation/reservation.entity";
import { ErrorCode, AuditAction, AuditEntityType, SettingKey, ErrorMessage } from "@qltv/shared";
import { ReservationStatus, Prisma } from "@prisma/client";
import { AppError } from "../../utils/app-error";
import { auditService } from "../audit/audit.service";
import { notificationService } from "../notification/notification.service";
import { settingService } from "../settings/setting.service";
import { UserService } from "../user/user.service";

export class ReservationService {
  private reservationRepository: ReservationRepository;
  private userService: UserService;

  constructor() {
    this.reservationRepository = new ReservationRepository();
    this.userService = new UserService();
  }

  async getAllReservations() {
    const list = await this.reservationRepository.findAll();
    return Promise.all(list.map(async (res) => {
      const pos = await this.calculatePosition(res.userId, res.bookId, res.createdAt, res.status);
      return { ...res, position: pos };
    }));
  }

  async getUrgentReservations(limit: number = 5) {
    return this.reservationRepository.findUrgent(limit);
  }

  async getMyReservations(userId: string) {
    const list = await this.reservationRepository.findByUserId(userId);
    // Only return active reservations for the reader's "My Shelf"
    const activeReservations = list.filter(res =>
      res.status === ReservationStatus.PENDING ||
      res.status === ReservationStatus.READY
    );

    return Promise.all(activeReservations.map(async (res) => {
      if (res.status === ReservationStatus.PENDING) {
        const pos = await this.calculatePosition(userId, res.bookId, res.createdAt, res.status);
        return { ...res, position: pos };
      }
      return { ...res, position: 0 }; // Position doesn't apply to READY/COMPLETED
    }));
  }

  async calculatePosition(userId: string, bookId: string, createdAt: Date, status: ReservationStatus): Promise<number> {
    const count = await this.reservationRepository.countStatusBefore(bookId, status, createdAt);
    return count + 1;
  }

  async createReservation(data: CreateReservationDTO, performerId: string) {
    let { userId, phone, bookId } = data;

    // 0. Resolve user
    if (!userId && phone) {
      const user = await this.userService.findOrCreateReader(phone);
      userId = user.id;
    }

    // 0.1 Fallback to performerId if logged in and no other user info
    if (!userId && performerId && performerId !== "SYSTEM") {
      userId = performerId;
    }

    if (!userId) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
    }

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Check if already reserved (Active ones)
      const existing = await tx.reservation.findFirst({
        where: {
          userId: userId!,
          bookId,
          status: { in: [ReservationStatus.PENDING, ReservationStatus.READY] }
        }
      });

      if (existing) {
        throw new AppError(ErrorCode.ALREADY_RESERVED, ErrorMessage.ALREADY_RESERVED);
      }

      // 2. Check borrow limit (including active reservations might be a policy)
      // For now, just check if book exists
      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book || book.isArchived) {
        throw new AppError(ErrorCode.BOOK_NOT_FOUND, ErrorMessage.BOOK_NOT_FOUND);
      }

      // 3. Create Reservation (Default PENDING)
      const pendingCount = await tx.reservation.count({
        where: {
          bookId,
          status: ReservationStatus.PENDING
        }
      });

      const reservation = await tx.reservation.create({
        data: {
          userId: userId!,
          bookId,
          status: ReservationStatus.PENDING,
          position: pendingCount + 1
        },
        include: { book: true }
      });

      // 4. Mark user as having activity
      await tx.user.update({
        where: { id: userId! },
        data: { hasActivity: true }
      });

      // 5. Try to promote immediately if book is available
      // Soft allocation: ONLY promote if (Ready Count < Available Quantity)
      const currentBook = await tx.book.findUnique({ where: { id: bookId } });
      if (currentBook && currentBook.availableQuantity > 0) {
        // Count how many people are already in READY status
        const readyCount = await tx.reservation.count({
          where: { bookId, status: ReservationStatus.READY }
        });

        if (readyCount < currentBook.availableQuantity) {
          // Double check if there are others before this one (FIFO)
          const othersBefore = await tx.reservation.count({
            where: { bookId, status: ReservationStatus.PENDING, createdAt: { lt: reservation.createdAt } }
          });

          if (othersBefore === 0) {
            return await this.promoteToReady(reservation.id, tx, performerId);
          }
        }
      }

      // 6. Audit & Notification for PENDING
      await auditService.logEvent({
        action: AuditAction.RESERVATION_CREATED,
        entityType: AuditEntityType.RESERVATION,
        entityId: reservation.id,
        userId: performerId,
        metadata: { bookId, status: ReservationStatus.PENDING }
      }, tx);

      const position = await this.calculatePosition(userId!, bookId, reservation.createdAt, ReservationStatus.PENDING);
      await notificationService.notifyQueueUpdate(userId!, {
        bookTitle: reservation.book.title,
        bookId,
        position
      });

      return { ...reservation, position };
    });
  }

  async cancelReservation(id: string, performerId: string) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const res = await tx.reservation.findUnique({
        where: { id },
        include: { book: true }
      });

      if (!res) throw new AppError(ErrorCode.RESERVATION_NOT_FOUND, ErrorMessage.RESERVATION_NOT_FOUND);

      if (res.status === ReservationStatus.COMPLETED || res.status === ReservationStatus.CANCELLED) {
        throw new AppError(ErrorCode.INVALID_RESERVATION_STATUS, ErrorMessage.INVALID_RESERVATION_STATUS);
      }

      const oldStatus = res.status;

      // 1. Update status
      const updated = await tx.reservation.update({
        where: { id },
        data: { status: ReservationStatus.CANCELLED }
      });

      // 2. If it was READY, no physical inventory change needed in Simple Model

      // 3. Audit
      await auditService.logEvent({
        action: AuditAction.RESERVATION_CANCELLED,
        entityType: AuditEntityType.RESERVATION,
        entityId: id,
        userId: performerId,
        metadata: { bookId: res.bookId, wasStatus: oldStatus }
      }, tx);

      // 4. Trigger promoteNext for this book
      await this.promoteNext(res.bookId, tx, performerId);

      return updated;
    });
  }

  /**
   * Central Logic: Find next pending and make it ready
   */
  async promoteNext(bookId: string, tx: Prisma.TransactionClient, performerId: string) {
    // 1. Check if book is available
    const book = await tx.book.findUnique({ where: { id: bookId } });
    if (!book || book.availableQuantity <= 0) return;

    // 2. Find any READY reservations for this book
    const readyCount = await tx.reservation.count({
      where: { bookId, status: ReservationStatus.READY }
    });

    // 3. If we still have room for more READY users (ReadyCount < AvailableQuantity)
    if (readyCount < book.availableQuantity) {
      const nextRes = await tx.reservation.findFirst({
        where: { bookId, status: ReservationStatus.PENDING },
        orderBy: { createdAt: "asc" }
      });

      if (nextRes) {
        await this.promoteToReady(nextRes.id, tx, performerId);
      }
    }
  }

  private async promoteToReady(id: string, tx: Prisma.TransactionClient, performerId: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24h to collect

    const updated = await tx.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.READY,
        expiresAt
      },
      include: { book: true }
    });

    // 1. Fetch current book state to ensure it's still available and we have "room"
    const book = await tx.book.findUnique({ where: { id: updated.bookId } });

    const readyCount = await tx.reservation.count({
      where: { bookId: updated.bookId, status: ReservationStatus.READY }
    });

    if (!book || book.availableQuantity <= 0 || readyCount > book.availableQuantity) {
      console.warn(`[promoteToReady] Book ${updated.bookId} availability constraint violated (Shelf: ${book?.availableQuantity}, Ready: ${readyCount}). Reverting reservation ${id} to PENDING.`);
      return await tx.reservation.update({
        where: { id },
        data: {
          status: ReservationStatus.PENDING,
          expiresAt: null
        },
        include: { book: true }
      });
    }

    // 2. Soft allocation: removed in Simple Model
    // Physical inventory is only reduced at Issue/Borrow time.

    // 3. Log event
    await auditService.logEvent({
      userId: performerId,
      action: AuditAction.RESERVATION_PROMOTED,
      entityType: AuditEntityType.RESERVATION,
      entityId: id,
      metadata: { bookId: updated.bookId, previousStatus: ReservationStatus.PENDING, expiresAt }
    }, tx);

    // Notify
    await notificationService.notifyReservationReady(updated.userId, {
      bookTitle: updated.book.title,
      bookId: updated.bookId,
      expiresAt,
      reservationId: id
    });

    return updated;
  }

  async markAsCompleted(id: string, tx: Prisma.TransactionClient) {
    return tx.reservation.update({
      where: { id },
      data: { status: ReservationStatus.COMPLETED }
    });
  }

  async markAsExpired(id: string, tx?: Prisma.TransactionClient, performerId: string = "SYSTEM") {
    const execute = async (transaction: Prisma.TransactionClient) => {
      const res = await transaction.reservation.findUnique({ where: { id } });
      if (!res || res.status !== ReservationStatus.READY) return;

      await transaction.reservation.update({
        where: { id },
        data: { status: ReservationStatus.EXPIRED }
      });

      // Release soft allocation: removed in Simple Model

      // Audit
      await auditService.logEvent({
        action: AuditAction.RESERVATION_CANCELLED, // Use CANCELLED or add EXPIRED to shared
        entityType: AuditEntityType.RESERVATION,
        entityId: id,
        userId: performerId,
        metadata: { bookId: res.bookId, status: ReservationStatus.EXPIRED }
      }, transaction);

      // Try to promote next
      await this.promoteNext(res.bookId, transaction, performerId);
    };

    if (tx) {
      return await execute(tx);
    } else {
      return await prisma.$transaction(async (t) => await execute(t));
    }
  }
  /**
   * Ensure READY reservations do not exceed available stock.
   * If stock is reduced (e.g. by a walk-in borrow), some READY reservations 
   * might need to go back to PENDING.
   */
  async rebalanceREADYReservations(bookId: string, tx: Prisma.TransactionClient, performerId: string = "SYSTEM") {
    // 1. Refresh book data from DB to get the most accurate quantity within transaction
    const book = await tx.book.findUnique({
      where: { id: bookId },
      select: { availableQuantity: true }
    });
    if (!book) return;

    // 2. Find all current READY reservations
    const readyReservations = await tx.reservation.findMany({
      where: { bookId, status: ReservationStatus.READY },
      orderBy: { createdAt: "desc" } // Revert the NEWEST ones first
    });

    // 3. If READY count exceeds available books, revert the excess to PENDING
    if (readyReservations.length > book.availableQuantity) {
      const numToRevert = readyReservations.length - book.availableQuantity;
      const toRevert = readyReservations.slice(0, numToRevert);

      for (const res of toRevert) {
        await tx.reservation.update({
          where: { id: res.id },
          data: {
            status: ReservationStatus.PENDING,
            expiresAt: null // CLEAR EXPIRE IMMEDIATELY
          }
        });

        await auditService.logEvent({
          action: AuditAction.RESERVATION_CANCELLED,
          entityType: AuditEntityType.RESERVATION,
          entityId: res.id,
          userId: performerId,
          metadata: { bookId, reason: "STOCK_DEPLETED", wasStatus: ReservationStatus.READY }
        }, tx);
      }
    }
  }
}

export const reservationService = new ReservationService();

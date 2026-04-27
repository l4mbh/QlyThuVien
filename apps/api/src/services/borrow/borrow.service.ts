import prisma from "../../config/db/db";
import { BorrowRepository } from "../../repositories/borrow/borrow.repository";
import { CreateBorrowDTO, ReturnBookDTO } from "../../types/borrow/borrow.entity";
import { ErrorCode, AuditAction, AuditEntityType, NotificationType, SettingKey, ErrorMessage } from "@qltv/shared";
import { BorrowItemStatus, UserStatus, Prisma, ReservationStatus } from "@prisma/client";
import { AppError } from "../../utils/app-error";
import { runRules } from "@qltv/shared";
import { borrowRuleSet } from "@qltv/shared";
import { auditService } from "../audit/audit.service";
import { notificationService } from "../notification/notification.service";
import { settingService } from "../settings/setting.service";
import { userService } from "../user/user.service";
import { reservationService } from "../reservation/reservation.service";

export class BorrowService {
  private borrowRepository: BorrowRepository;

  constructor() {
    this.borrowRepository = new BorrowRepository();
  }

  async getAllBorrows(filters: { userId?: string; status?: any } = {}) {
    if (filters.userId) {
      return this.borrowRepository.findRecordsByUserId(filters.userId);
    }
    return this.borrowRepository.findAllRecords(filters);
  }

  async getMyBorrowed(userId: string) {
    return this.borrowRepository.findRecordsByUserId(userId);
  }

  async getBorrowById(id: string) {
    const record = await this.borrowRepository.findRecordById(id);
    if (!record) {
      throw new AppError(ErrorCode.BORROW_RECORD_NOT_FOUND, ErrorMessage.BORROW_RECORD_NOT_FOUND);
    }
    return record;
  }

  async createBorrow(data: CreateBorrowDTO, performerId: string) {
    let { userId, phone, bookIds, dueDate } = data;

    // 0. Pre-resolve user if phone provided but no userId
    if (!userId && phone) {
      const user = await userService.findOrCreateReader(phone);
      userId = user.id;
    }

    if (!userId) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
    }

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Fetch required data for rules
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new AppError(ErrorCode.USER_NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
      }

      const books = await tx.book.findMany({
        where: {
          id: { in: bookIds },
          isArchived: false,
        },
      });

      if (books.length !== bookIds.length) {
        throw new AppError(ErrorCode.BOOK_NOT_FOUND, ErrorMessage.BOOK_NOT_FOUND);
      }

      // 1.5 Fetch Reservation if provided
      const reservation = data.reservationId 
        ? await tx.reservation.findUnique({ where: { id: data.reservationId } })
        : null;
      
      const reservedBookId = (reservation && reservation.userId === userId && reservation.status === ReservationStatus.READY)
        ? reservation.bookId
        : null;

      // 2. Fetch Global Borrow Limit from Settings
      const globalBorrowLimit = await settingService.get<number>(SettingKey.BORROW_LIMIT);

      // 3. Check for overdue books
      const overdueItem = await tx.borrowItem.findFirst({
        where: {
          status: BorrowItemStatus.BORROWING,
          borrowRecord: {
            userId,
            dueDate: { lt: new Date() }
          }
        }
      });

      // 4. Run Centralized Rules
      const ruleResult = runRules(borrowRuleSet, {
        user: {
          id: user.id,
          status: user.status,
          currentBorrowCount: user.currentBorrowCount,
          borrowLimit: globalBorrowLimit // Use global limit from settings
        },
        books: books.map(b => {
          const queueCount = b._count?.reservations || 0;
          const effectiveAvailable = Math.max(0, b.availableQuantity - queueCount);
          
          return {
            id: b.id,
            title: b.title,
            // If this user has a READY reservation for this book, they bypass the queue check
            availableQuantity: b.id === reservedBookId ? Math.max(effectiveAvailable, 1) : effectiveAvailable
          };
        }),
        hasOverdueBooks: !!overdueItem
      });

      if (!ruleResult.ok) {
        throw new AppError(ruleResult.code, ruleResult.details?.message || "Borrowing rule violation");
      }
// ...

      // 4. Create Borrow Record
      const borrowRecord = await tx.borrowRecord.create({
        data: {
          userId,
          dueDate,
          borrowItems: {
            create: bookIds.map((bookId) => ({
              bookId,
              status: BorrowItemStatus.BORROWING,
            })),
          },
        },
        include: {
          borrowItems: true,
        },
      });

      // 5. Update Book availableQuantity (-1) and Handle Reservations
      // Use sequential loop to avoid race conditions if same book appears multiple times
      for (const bookId of bookIds) {
        // A. Identify if this specific book instance is covered by the provided reservationId
        // or any other READY/PENDING reservation for this user.
        let targetReservationId = (data.reservationId && reservation?.bookId === bookId) 
          ? data.reservationId 
          : null;

        const activeReservation = await tx.reservation.findFirst({
          where: {
            id: targetReservationId || undefined,
            userId,
            bookId,
            status: { in: [ReservationStatus.PENDING, ReservationStatus.READY] }
          },
          orderBy: { status: 'desc' } // Prioritize READY over PENDING
        });

        // B. Update book quantity (Always decrement in Simple Model)
        const updatedBook = await tx.book.updateMany({
          where: { 
            id: bookId,
            availableQuantity: { gt: 0 }
          },
          data: { availableQuantity: { decrement: 1 } },
        });

        if (updatedBook.count === 0) {
          throw new AppError(ErrorCode.VALIDATION_ERROR, `Book ${bookId} is no longer available on shelf.`);
        }

        // C. Mark reservation as completed if found
        if (activeReservation) {
          await tx.reservation.update({
            where: { id: activeReservation.id },
            data: { status: ReservationStatus.COMPLETED }
          });
        }

        // D. Rebalance READY reservations if stock is now gone
        await reservationService.rebalanceREADYReservations(bookId, tx, performerId);
      }

      // 6. Update User currentBorrowCount (+ bookIds.length)
      await tx.user.update({
        where: { id: userId },
        data: { currentBorrowCount: { increment: bookIds.length } },
      });

      // Log Audit Event
      await auditService.logEvent({
        action: AuditAction.BORROW_CREATED,
        entityType: AuditEntityType.BORROW,
        entityId: borrowRecord.id,
        userId: performerId,
        metadata: { 
          readerId: userId, 
          bookCount: bookIds.length,
          dueDate: dueDate
        }
      });

      // Send Notification to Reader
      await notificationService.notifyBorrowSuccess(userId, {
        bookTitle: books.map(b => b.title).join(", "),
        dueDate: new Date(dueDate),
        bookId: bookIds[0], // Simplified for now
        borrowRecordId: borrowRecord.id
      });

      return borrowRecord;
    });
  }

  async returnBook(data: ReturnBookDTO, performerId: string) {
    const { borrowItemIds } = data;

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const results = [];
      const now = new Date();

      for (const borrowItemId of borrowItemIds) {
        // 1. Find Borrow Item
        const item = await tx.borrowItem.findUnique({
          where: { id: borrowItemId },
          include: { borrowRecord: true },
        });

        if (!item) {
          throw new AppError(ErrorCode.BORROW_RECORD_NOT_FOUND, ErrorMessage.BORROW_RECORD_NOT_FOUND);
        }

        if (item.status === BorrowItemStatus.RETURNED) {
          continue; // Skip if already returned to avoid double inventory increase
        }

        // 2. Calculate Fine based on settings
        const dueDate = new Date(item.borrowRecord.dueDate);
        const fineAmount = await this.calculateFine(dueDate, now);

        // 3. Update Borrow Item Status & Fine
        const updatedItem = await tx.borrowItem.update({
          where: { id: borrowItemId },
          data: {
            status: BorrowItemStatus.RETURNED,
            returnedAt: now,
            fineAmount: fineAmount,
          },
        });
        // 4. Update Book availableQuantity (+1)
        await tx.book.update({
          where: { id: item.bookId },
          data: { availableQuantity: { increment: 1 } },
        });

        // 5. Update User currentBorrowCount (-1)
        await tx.user.update({
          where: { id: item.borrowRecord.userId },
          data: { currentBorrowCount: { decrement: 1 } },
        });

        // 5.5 Auto-promote next reservation for this book
        await reservationService.promoteNext(item.bookId, tx, performerId);

        results.push(updatedItem);

        // 6. Check if all items in this record are returned to complete the record
        const allItems = await tx.borrowItem.findMany({
          where: { borrowRecordId: item.borrowRecordId },
        });

        const allReturned = allItems.every((i) => i.status === BorrowItemStatus.RETURNED);
        if (allReturned) {
          await tx.borrowRecord.update({
            where: { id: item.borrowRecordId },
            data: { status: "COMPLETED" },
          });
        }

        // Log Audit Event for each item returned
        await auditService.logEvent({
          action: AuditAction.RETURN_COMPLETED,
          entityType: AuditEntityType.BORROW,
          entityId: item.borrowRecordId,
          userId: performerId,
          metadata: { 
            borrowItemId: borrowItemId,
            bookId: item.bookId,
            fineAmount: fineAmount
          }
        });

        // Send Notification to Reader
        const book = await tx.book.findUnique({ where: { id: item.bookId } });
        await notificationService.notifyReturnSuccess(item.borrowRecord.userId, {
          bookTitle: book?.title || "Book",
          bookId: item.bookId,
        });
      }

      return results;
    });
  }

  private async calculateFine(dueDate: Date, returnedAt: Date): Promise<number> {
    // 1. Check if fine is enabled
    const isFineEnabled = await settingService.get<boolean>(SettingKey.ENABLE_FINE);
    if (!isFineEnabled) return 0;

    const diffTime = returnedAt.getTime() - dueDate.getTime();
    if (diffTime <= 0) return 0;

    // 2. Calculate days overdue (any part of a day counts as 1 day)
    const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 3. Fetch fine settings
    const finePerDay = await settingService.get<number>(SettingKey.FINE_PER_DAY);
    const maxFine = await settingService.get<number>(SettingKey.MAX_FINE);

    const calculatedFine = overdueDays * finePerDay;
    return Math.min(calculatedFine, maxFine);
  }
}

export const borrowService = new BorrowService();


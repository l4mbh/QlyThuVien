import prisma from "../../config/db/db";
import { BorrowRepository } from "../../repositories/borrow/borrow.repository";
import { CreateBorrowDTO, ReturnBookDTO } from "../../types/borrow/borrow.entity";
import { ErrorCode } from "../../constants/errors/error.enum";
import { BorrowItemStatus, UserStatus, Prisma } from "@prisma/client";

export class BorrowService {
  private borrowRepository: BorrowRepository;

  constructor() {
    this.borrowRepository = new BorrowRepository();
  }

  async getAllBorrows() {
    return this.borrowRepository.findAllRecords();
  }

  async getBorrowById(id: string) {
    const record = await this.borrowRepository.findRecordById(id);
    if (!record) {
      const error = new Error("Borrow record not found") as any;
      error.errorCode = ErrorCode.BORROW_RECORD_NOT_FOUND;
      throw error;
    }
    return record;
  }

  async createBorrow(data: CreateBorrowDTO) {
    const { userId, bookIds, dueDate } = data;

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Validate User
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw this.createError("User not found", ErrorCode.USER_NOT_FOUND);
      }
      if (user.status === UserStatus.BLOCKED) {
        throw this.createError("User is blocked", ErrorCode.USER_BLOCKED);
      }
      if (user.currentBorrowCount + bookIds.length > user.borrowLimit) {
        throw this.createError("Borrow limit exceeded", ErrorCode.USER_BORROW_LIMIT_EXCEEDED);
      }

      // 2. Validate Books
      const books = await tx.book.findMany({
        where: {
          id: { in: bookIds },
          isArchived: false,
        },
      });

      if (books.length !== bookIds.length) {
        throw this.createError("One or more books not found", ErrorCode.BOOK_NOT_FOUND);
      }

      for (const book of books) {
        if (book.availableQuantity <= 0) {
          throw this.createError(`Book ${book.title} is not available`, ErrorCode.BOOK_NOT_AVAILABLE);
        }
      }

      // 3. Create Borrow Record
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

      // 4. Update Book availableQuantity (-1)
      await Promise.all(
        bookIds.map((bookId) =>
          tx.book.update({
            where: { id: bookId },
            data: { availableQuantity: { decrement: 1 } },
          })
        )
      );

      // 5. Update User currentBorrowCount (+ bookIds.length)
      await tx.user.update({
        where: { id: userId },
        data: { currentBorrowCount: { increment: bookIds.length } },
      });

      return borrowRecord;
    });
  }

  async returnBook(data: ReturnBookDTO) {
    const { borrowItemIds } = data;

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const results = [];

      for (const borrowItemId of borrowItemIds) {
        // 1. Find Borrow Item
        const item = await tx.borrowItem.findUnique({
          where: { id: borrowItemId },
          include: { borrowRecord: true },
        });

        if (!item) {
          throw this.createError(`Borrow item ${borrowItemId} not found`, ErrorCode.BORROW_RECORD_NOT_FOUND);
        }

        if (item.status === BorrowItemStatus.RETURNED) {
          continue; // Skip if already returned to avoid double inventory increase
        }

        // 2. Update Borrow Item Status
        const updatedItem = await tx.borrowItem.update({
          where: { id: borrowItemId },
          data: {
            status: BorrowItemStatus.RETURNED,
            returnedAt: new Date(),
          },
        });

        // 3. Update Book availableQuantity (+1)
        await tx.book.update({
          where: { id: item.bookId },
          data: { availableQuantity: { increment: 1 } },
        });

        // 4. Update User currentBorrowCount (-1)
        await tx.user.update({
          where: { id: item.borrowRecord.userId },
          data: { currentBorrowCount: { decrement: 1 } },
        });

        results.push(updatedItem);

        // 5. Check if all items in this record are returned to complete the record
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
      }

      return results;
    });
  }

  private createError(message: string, errorCode: ErrorCode) {
    const error = new Error(message) as any;
    error.errorCode = errorCode;
    return error;
  }
}

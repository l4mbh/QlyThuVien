import prisma from "../../config/db/db";
import { BorrowRepository } from "../../repositories/borrow/borrow.repository";
import { CreateBorrowDTO, ReturnBookDTO } from "../../types/borrow/borrow.entity";
import { ErrorCode } from "@shared/constants/error-codes";
import { BorrowItemStatus, UserStatus, Prisma } from "@prisma/client";
import { AppError } from "../../utils/app-error";
import { runRules } from "@shared/engine/rule-runner";
import { borrowRuleSet } from "@shared/rules/borrow.rules";

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
      throw new AppError(ErrorCode.BORROW_RECORD_NOT_FOUND, "Borrow record not found");
    }
    return record;
  }

  async createBorrow(data: CreateBorrowDTO) {
    const { userId, bookIds, dueDate } = data;

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Fetch required data for rules
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new AppError(ErrorCode.USER_NOT_FOUND, "User not found");
      }

      const books = await tx.book.findMany({
        where: {
          id: { in: bookIds },
          isArchived: false,
        },
      });

      if (books.length !== bookIds.length) {
        throw new AppError(ErrorCode.BOOK_NOT_FOUND, "One or more books not found");
      }

      // 2. Check for overdue books
      const overdueItem = await tx.borrowItem.findFirst({
        where: {
          status: BorrowItemStatus.BORROWING,
          borrowRecord: {
            userId,
            dueDate: { lt: new Date() }
          }
        }
      });


      // 3. Run Centralized Rules
      const ruleResult = runRules(borrowRuleSet, {
        user: {
          id: user.id,
          status: user.status,
          currentBorrowCount: user.currentBorrowCount,
          borrowLimit: user.borrowLimit
        },
        books: books.map(b => ({
          id: b.id,
          title: b.title,
          availableQuantity: b.availableQuantity
        })),
        hasOverdueBooks: !!overdueItem
      });

      if (!ruleResult.ok) {
        throw new AppError(ruleResult.code, ruleResult.details?.message || "Borrowing rule violation");
      }

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

      // 5. Update Book availableQuantity (-1)
      await Promise.all(
        bookIds.map((bookId) =>
          tx.book.update({
            where: { id: bookId },
            data: { availableQuantity: { decrement: 1 } },
          })
        )
      );

      // 6. Update User currentBorrowCount (+ bookIds.length)
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
      const now = new Date();

      for (const borrowItemId of borrowItemIds) {
        // 1. Find Borrow Item
        const item = await tx.borrowItem.findUnique({
          where: { id: borrowItemId },
          include: { borrowRecord: true },
        });

        if (!item) {
          throw new AppError(ErrorCode.BORROW_RECORD_NOT_FOUND, `Borrow item ${borrowItemId} not found`);
        }

        if (item.status === BorrowItemStatus.RETURNED) {
          continue; // Skip if already returned to avoid double inventory increase
        }

        // 2. Calculate Fine
        const dueDate = new Date(item.borrowRecord.dueDate);
        const fineAmount = this.calculateFine(dueDate, now);

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
      }

      return results;
    });
  }

  private calculateFine(dueDate: Date, returnedAt: Date): number {
    const diffTime = returnedAt.getTime() - dueDate.getTime();
    if (diffTime <= 0) return 0;

    // Calculate days overdue (any part of a day counts as 1 day)
    const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return overdueDays * 5000;
  }
}

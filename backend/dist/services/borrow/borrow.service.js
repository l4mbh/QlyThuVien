"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowService = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
const borrow_repository_1 = require("../../repositories/borrow/borrow.repository");
const error_enum_1 = require("../../constants/errors/error.enum");
const client_1 = require("@prisma/client");
class BorrowService {
    constructor() {
        this.borrowRepository = new borrow_repository_1.BorrowRepository();
    }
    async getAllBorrows() {
        return this.borrowRepository.findAllRecords();
    }
    async getBorrowById(id) {
        const record = await this.borrowRepository.findRecordById(id);
        if (!record) {
            const error = new Error("Borrow record not found");
            error.errorCode = error_enum_1.ErrorCode.BORROW_RECORD_NOT_FOUND;
            throw error;
        }
        return record;
    }
    async createBorrow(data) {
        const { userId, bookIds, dueDate } = data;
        return await db_1.default.$transaction(async (tx) => {
            // 1. Validate User
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw this.createError("User not found", error_enum_1.ErrorCode.USER_NOT_FOUND);
            }
            if (user.status === client_1.UserStatus.BLOCKED) {
                throw this.createError("User is blocked", error_enum_1.ErrorCode.USER_BLOCKED);
            }
            if (user.currentBorrowCount + bookIds.length > user.borrowLimit) {
                throw this.createError("Borrow limit exceeded", error_enum_1.ErrorCode.USER_BORROW_LIMIT_EXCEEDED);
            }
            // 2. Validate Books
            const books = await tx.book.findMany({
                where: {
                    id: { in: bookIds },
                    isArchived: false,
                },
            });
            if (books.length !== bookIds.length) {
                throw this.createError("One or more books not found", error_enum_1.ErrorCode.BOOK_NOT_FOUND);
            }
            for (const book of books) {
                if (book.availableQuantity <= 0) {
                    throw this.createError(`Book ${book.title} is not available`, error_enum_1.ErrorCode.BOOK_NOT_AVAILABLE);
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
                            status: client_1.BorrowItemStatus.BORROWING,
                        })),
                    },
                },
                include: {
                    borrowItems: true,
                },
            });
            // 4. Update Book availableQuantity (-1)
            await Promise.all(bookIds.map((bookId) => tx.book.update({
                where: { id: bookId },
                data: { availableQuantity: { decrement: 1 } },
            })));
            // 5. Update User currentBorrowCount (+ bookIds.length)
            await tx.user.update({
                where: { id: userId },
                data: { currentBorrowCount: { increment: bookIds.length } },
            });
            return borrowRecord;
        });
    }
    async returnBook(data) {
        const { borrowItemIds } = data;
        return await db_1.default.$transaction(async (tx) => {
            const results = [];
            const now = new Date();
            for (const borrowItemId of borrowItemIds) {
                // 1. Find Borrow Item
                const item = await tx.borrowItem.findUnique({
                    where: { id: borrowItemId },
                    include: { borrowRecord: true },
                });
                if (!item) {
                    throw this.createError(`Borrow item ${borrowItemId} not found`, error_enum_1.ErrorCode.BORROW_RECORD_NOT_FOUND);
                }
                if (item.status === client_1.BorrowItemStatus.RETURNED) {
                    continue; // Skip if already returned to avoid double inventory increase
                }
                // 2. Calculate Fine
                const dueDate = new Date(item.borrowRecord.dueDate);
                const fineAmount = this.calculateFine(dueDate, now);
                // 3. Update Borrow Item Status & Fine
                const updatedItem = await tx.borrowItem.update({
                    where: { id: borrowItemId },
                    data: {
                        status: client_1.BorrowItemStatus.RETURNED,
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
                const allReturned = allItems.every((i) => i.status === client_1.BorrowItemStatus.RETURNED);
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
    calculateFine(dueDate, returnedAt) {
        const diffTime = returnedAt.getTime() - dueDate.getTime();
        if (diffTime <= 0)
            return 0;
        // Calculate days overdue (any part of a day counts as 1 day)
        const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return overdueDays * 5000;
    }
    createError(message, errorCode) {
        const error = new Error(message);
        error.errorCode = errorCode;
        return error;
    }
}
exports.BorrowService = BorrowService;

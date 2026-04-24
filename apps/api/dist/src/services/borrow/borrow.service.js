"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowService = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
const borrow_repository_1 = require("../../repositories/borrow/borrow.repository");
const shared_1 = require("@qltv/shared");
const client_1 = require("@prisma/client");
const app_error_1 = require("../../utils/app-error");
const shared_2 = require("@qltv/shared");
const shared_3 = require("@qltv/shared");
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
            throw new app_error_1.AppError(shared_1.ErrorCode.BORROW_RECORD_NOT_FOUND, "Borrow record not found");
        }
        return record;
    }
    async createBorrow(data) {
        const { userId, bookIds, dueDate } = data;
        return await db_1.default.$transaction(async (tx) => {
            // 1. Fetch required data for rules
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new app_error_1.AppError(shared_1.ErrorCode.USER_NOT_FOUND, "User not found");
            }
            const books = await tx.book.findMany({
                where: {
                    id: { in: bookIds },
                    isArchived: false,
                },
            });
            if (books.length !== bookIds.length) {
                throw new app_error_1.AppError(shared_1.ErrorCode.BOOK_NOT_FOUND, "One or more books not found");
            }
            // 2. Check for overdue books
            const overdueItem = await tx.borrowItem.findFirst({
                where: {
                    status: client_1.BorrowItemStatus.BORROWING,
                    borrowRecord: {
                        userId,
                        dueDate: { lt: new Date() }
                    }
                }
            });
            // 3. Run Centralized Rules
            const ruleResult = (0, shared_2.runRules)(shared_3.borrowRuleSet, {
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
                throw new app_error_1.AppError(ruleResult.code, ruleResult.details?.message || "Borrowing rule violation");
            }
            // 4. Create Borrow Record
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
            // 5. Update Book availableQuantity (-1)
            await Promise.all(bookIds.map((bookId) => tx.book.update({
                where: { id: bookId },
                data: { availableQuantity: { decrement: 1 } },
            })));
            // 6. Update User currentBorrowCount (+ bookIds.length)
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
                    throw new app_error_1.AppError(shared_1.ErrorCode.BORROW_RECORD_NOT_FOUND, `Borrow item ${borrowItemId} not found`);
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
}
exports.BorrowService = BorrowService;

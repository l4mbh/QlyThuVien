"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initOverdueJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = __importDefault(require("../config/db/db"));
const notification_service_1 = require("../services/notification/notification.service");
const client_1 = require("@prisma/client");
const initOverdueJob = () => {
    // Run every day at 08:00 AM
    node_cron_1.default.schedule("0 8 * * *", async () => {
        console.log("[Job] Running Overdue Book Checker...");
        try {
            const now = new Date();
            // Find all borrowing items that are overdue
            const overdueItems = await db_1.default.borrowItem.findMany({
                where: {
                    status: client_1.BorrowItemStatus.BORROWING,
                    borrowRecord: {
                        dueDate: {
                            lt: now
                        }
                    }
                },
                include: {
                    borrowRecord: {
                        include: {
                            user: true
                        }
                    },
                    book: true
                }
            });
            console.log(`[Job] Found ${overdueItems.length} overdue items.`);
            for (const item of overdueItems) {
                await notification_service_1.notificationService.notifyOverdue(item.borrowRecord.userId, {
                    bookTitle: item.book.title,
                    dueDate: item.borrowRecord.dueDate,
                    bookId: item.bookId,
                    borrowRecordId: item.borrowRecordId,
                });
            }
            console.log("[Job] Overdue Book Checker completed.");
        }
        catch (error) {
            console.error("[Job] Overdue Book Checker failed:", error);
        }
    });
};
exports.initOverdueJob = initOverdueJob;

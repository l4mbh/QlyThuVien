import cron from "node-cron";
import prisma from "../config/db/db";
import { notificationService } from "../services/notification/notification.service";
import { BorrowItemStatus } from "@prisma/client";

export const initOverdueJob = () => {
  // Run every day at 08:00 AM
  cron.schedule("0 8 * * *", async () => {
    console.log("[Job] Running Overdue Book Checker...");
    
    try {
      const now = new Date();
      
      // Find all borrowing items that are overdue
      const overdueItems = await prisma.borrowItem.findMany({
        where: {
          status: BorrowItemStatus.BORROWING,
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
        await notificationService.notifyOverdue(item.borrowRecord.userId, {
          bookTitle: item.book.title,
          dueDate: item.borrowRecord.dueDate,
          bookId: item.bookId,
          borrowRecordId: item.borrowRecordId,
        });
      }
      
      console.log("[Job] Overdue Book Checker completed.");
    } catch (error) {
      console.error("[Job] Overdue Book Checker failed:", error);
    }
  });
};

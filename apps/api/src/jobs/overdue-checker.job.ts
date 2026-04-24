import cron from "node-cron";
import prisma from "../config/db/db";
import { notificationService } from "../services/notification/notification.service";
import { settingService } from "../services/settings/setting.service";
import { SettingKey } from "@qltv/shared";
import { BorrowItemStatus } from "@prisma/client";

export const initOverdueJob = () => {
  // Chay moi gio, chi thuc hien khi dung gio cau hinh
  cron.schedule("0 * * * *", async () => {
    try {
      const checkTime = await settingService.get<string>(SettingKey.OVERDUE_CHECK_TIME);
      const currentHour = new Date().getHours();
      const configHour = parseInt(checkTime.split(":")[0]);

      if (currentHour !== configHour) return;

      console.log(`[Job] It's ${checkTime}, starting Overdue & Due Soon Checker...`);
      
      const now = new Date();
      
      // 1. Tim tat ca sach da qua han
      const overdueItems = await prisma.borrowItem.findMany({
        where: {
          status: BorrowItemStatus.BORROWING,
          borrowRecord: {
            dueDate: { lt: now }
          }
        },
        include: {
          borrowRecord: { include: { user: true } },
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

      // 2. Tim sach sap den han
      const dueSoonDays = await settingService.get<number>(SettingKey.DUE_SOON_DAYS);
      const dueSoonDate = new Date();
      dueSoonDate.setDate(dueSoonDate.getDate() + dueSoonDays);

      const dueSoonItems = await prisma.borrowItem.findMany({
        where: {
          status: BorrowItemStatus.BORROWING,
          borrowRecord: {
            dueDate: {
              gt: now,
              lte: dueSoonDate
            }
          }
        },
        include: {
          borrowRecord: { include: { user: true } },
          book: true
        }
      });

      console.log(`[Job] Found ${dueSoonItems.length} due soon items.`);
      
      console.log("[Job] Task completed.");
    } catch (error) {
      console.error("[Job] Failed:", error);
    }
  });
};

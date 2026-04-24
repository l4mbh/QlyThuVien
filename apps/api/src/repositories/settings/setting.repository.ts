import prisma from "../../config/db/db";
import { SettingKey } from "@qltv/shared";

export class SettingRepository {
  /**
   * Lấy tất cả cài đặt từ database
   */
  async findAll() {
    return prisma.systemSetting.findMany();
  }

  /**
   * Tìm một cài đặt theo khóa
   */
  async findByKey(key: string) {
    return prisma.systemSetting.findUnique({
      where: { key },
    });
  }

  /**
   * Cập nhật hoặc tạo mới một cài đặt
   */
  async upsert(key: string, value: any, category: string = "GENERAL") {
    return prisma.systemSetting.upsert({
      where: { key },
      update: { 
        value,
        updatedAt: new Date(),
      },
      create: {
        key,
        value,
        category,
      },
    });
  }

  /**
   * Lấy tất cả cấu hình thông báo
   */
  async findAllNotificationSettings() {
    return prisma.notificationSetting.findMany();
  }

  /**
   * Cập nhật cấu hình thông báo
   */
  async upsertNotificationSetting(type: string, roles: any[], isEnabled: boolean) {
    return prisma.notificationSetting.upsert({
      where: { type },
      update: { roles, isEnabled },
      create: { type, roles, isEnabled },
    });
  }
}

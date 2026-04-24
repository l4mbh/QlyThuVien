import { Request, Response, NextFunction } from "express";
import { settingService } from "../../services/settings/setting.service";
import { SettingKey } from "@qltv/shared";

/**
 * Controller xử lý các yêu cầu liên quan đến cấu hình hệ thống
 */
export class SettingController {
  /**
   * Lấy danh sách tất cả các cài đặt
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingService.getAll();
      res.json({ data: settings, code: 0 });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật một cấu hình hệ thống
   */
  async update(req: any, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      const { value } = req.body;
      const userId = req.user.userId;

      await settingService.set(key as SettingKey, value, userId);
      res.json({ data: { success: true }, code: 0 });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy cấu hình thông báo (routing)
   */
  async getNotificationSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingService.getNotificationSettings();
      res.json({ data: settings, code: 0 });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật định tuyến thông báo
   */
  async updateNotificationRouting(req: any, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;
      const { roles, isEnabled } = req.body;
      const userId = req.user.userId;

      await settingService.updateNotificationRouting(type, roles, isEnabled, userId);
      res.json({ data: { success: true }, code: 0 });
    } catch (error) {
      next(error);
    }
  }
}

export const settingController = new SettingController();

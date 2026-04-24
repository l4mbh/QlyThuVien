import { api } from "./api";
import { SettingKey } from "@qltv/shared";

/**
 * Service xử lý các yêu cầu API liên quan đến cấu hình hệ thống
 */
export const settingService = {
  /**
   * Lấy danh sách toàn bộ cấu hình hệ thống
   */
  async getAll() {
    const response = await api.get("/settings");
    return response.data.data;
  },

  /**
   * Cập nhật một cấu hình
   */
  async update(key: SettingKey, value: any) {
    const response = await api.patch(`/settings/${key}`, { value });
    return response.data.data;
  },

  /**
   * Lấy danh sách cấu hình thông báo
   */
  async getNotificationSettings() {
    const response = await api.get("/settings/notifications");
    return response.data.data;
  },

  /**
   * Cập nhật định tuyến thông báo
   */
  async updateNotificationRouting(type: string, roles: string[], isEnabled: boolean) {
    const response = await api.patch(`/settings/notifications/${type}`, { roles, isEnabled });
    return response.data.data;
  }
};

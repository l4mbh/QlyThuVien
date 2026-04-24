import { api } from "@/services/api";
import { type ApiResponse } from "@/types/response.type";

export const settingService = {
  /**
   * Lay danh sach tat ca cai dat
   */
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get("/settings");
    return response.data;
  },

  /**
   * Cap nhat mot cau hinh he thong
   */
  update: async (key: string, value: any): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/settings/${key}`, { value });
    return response.data;
  },

  /**
   * Lay cau hinh thong bao (routing)
   */
  getNotificationSettings: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get("/settings/notifications");
    return response.data;
  },

  /**
   * Cap nhat dinh tuyen thong bao
   */
  updateNotificationRouting: async (type: string, data: { roles: string[], isEnabled: boolean }): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/settings/notifications/${type}`, data);
    return response.data;
  }
};

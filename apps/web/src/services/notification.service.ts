import { api } from "./api";
import { type ApiResponse } from "@/types/response.type";
import { type Notification } from "@/types/notification.type";

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get<ApiResponse<Notification[]>>("/notifications");
    return response.data.data || [];
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return response.data.data!;
  },

  async markAllAsRead(): Promise<{ count: number }> {
    const response = await api.patch<ApiResponse<{ count: number }>>("/notifications/read-all");
    return response.data.data!;
  },
};

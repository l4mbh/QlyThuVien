import { NotificationType } from "../constants/notification";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  metadata?: Record<string, any>;
}

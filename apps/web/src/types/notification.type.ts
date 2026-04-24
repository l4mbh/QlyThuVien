import { 
  NotificationType as SharedNotificationType,
  type Notification as SharedNotification,
  type CreateNotificationDto as SharedCreateNotificationDto
} from "@qltv/shared";

export const NotificationType = SharedNotificationType;
export type NotificationType = SharedNotificationType;

export type Notification = SharedNotification;
export type CreateNotificationDto = SharedCreateNotificationDto;

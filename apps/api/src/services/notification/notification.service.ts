import { 
  CreateNotificationDto, 
  Notification, 
  NotificationType,
  SettingKey
} from "@qltv/shared";
import { NotificationRepository } from "../../repositories/notification/notification.repository";
import { settingService } from "../settings/setting.service";
import prisma from "../../config/db/db";

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  /**
   * Send a notification to a specific user (With Dynamic Routing)
   */
  async sendNotification(data: CreateNotificationDto): Promise<Notification | null> {
    // 1. Check Global Notification Flag
    const isGlobalEnabled = await settingService.get<boolean>(SettingKey.ENABLE_NOTIFICATION);
    if (!isGlobalEnabled) return null;

    // 2. Fetch routing settings for this specific type
    const settings = await settingService.getNotificationSettings();
    const setting = settings.find(s => s.type === data.type);

    if (setting) {
      // Check if this type is enabled
      if (!setting.isEnabled) {
        return null;
      }

      // Check if user role is allowed to receive this type
      const user = await prisma.user.findUnique({ where: { id: data.userId }, select: { role: true } });
      const allowedRoles = setting.roles as string[];
      if (user && !allowedRoles.includes(user.role)) {
        return null;
      }
    }

    console.log(`[NotificationService] Sending [${data.type}] to user ${data.userId}`);
    return this.notificationRepository.create(data);
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.findByUserId(userId);
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    return this.notificationRepository.markAsRead(id);
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<{ count: number }> {
    return this.notificationRepository.markAllAsRead(userId);
  }

  /**
   * Notify about overdue books (Metadata-based)
   */
  async notifyOverdue(userId: string, payload: {
    bookTitle: string;
    dueDate: Date;
    bookId: string;
    borrowRecordId: string;
  }): Promise<Notification | null> {
    return this.sendNotification({
      userId,
      type: NotificationType.OVERDUE,
      title: "Book Overdue Alert!",
      metadata: payload,
    });
  }

  /**
   * Notify about borrow success
   */
  async notifyBorrowSuccess(userId: string, payload: {
    bookTitle: string;
    dueDate: Date;
    bookId: string;
    borrowRecordId: string;
  }): Promise<Notification | null> {
    return this.sendNotification({
      userId,
      type: NotificationType.BORROW_SUCCESS,
      title: "Borrowing Successful",
      metadata: payload,
    });
  }

  /**
   * Notify about return success
   */
  async notifyReturnSuccess(userId: string, payload: {
    bookTitle: string;
    bookId: string;
  }): Promise<Notification | null> {
    return this.sendNotification({
      userId,
      type: NotificationType.RETURN_SUCCESS,
      title: "Book Returned",
      metadata: payload,
    });
  }
}

// Singleton instance
export const notificationService = new NotificationService();

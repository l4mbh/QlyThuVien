import { 
  CreateNotificationDto, 
  Notification, 
  NotificationType 
} from "@qltv/shared";
import { NotificationRepository } from "../../repositories/notification/notification.repository";

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  /**
   * Send a notification to a specific user
   */
  async sendNotification(data: CreateNotificationDto): Promise<Notification> {
    console.log(`[NotificationService] Sending notification to user ${data.userId}:`, data.title);
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
  }): Promise<Notification> {
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
  }): Promise<Notification> {
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
  }): Promise<Notification> {
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

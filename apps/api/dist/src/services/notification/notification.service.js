"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const shared_1 = require("@qltv/shared");
const notification_repository_1 = require("../../repositories/notification/notification.repository");
class NotificationService {
    constructor() {
        this.notificationRepository = new notification_repository_1.NotificationRepository();
    }
    /**
     * Send a notification to a specific user
     */
    async sendNotification(data) {
        return this.notificationRepository.create(data);
    }
    /**
     * Get all notifications for a user
     */
    async getUserNotifications(userId) {
        return this.notificationRepository.findByUserId(userId);
    }
    /**
     * Mark a notification as read
     */
    async markAsRead(id) {
        return this.notificationRepository.markAsRead(id);
    }
    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId) {
        return this.notificationRepository.markAllAsRead(userId);
    }
    /**
     * Notify about overdue books (Metadata-based)
     */
    async notifyOverdue(userId, payload) {
        return this.sendNotification({
            userId,
            type: shared_1.NotificationType.OVERDUE,
            title: "Book Overdue Alert!",
            metadata: payload,
        });
    }
    /**
     * Notify about borrow success
     */
    async notifyBorrowSuccess(userId, payload) {
        return this.sendNotification({
            userId,
            type: shared_1.NotificationType.BORROW_SUCCESS,
            title: "Borrowing Successful",
            metadata: payload,
        });
    }
    /**
     * Notify about return success
     */
    async notifyReturnSuccess(userId, payload) {
        return this.sendNotification({
            userId,
            type: shared_1.NotificationType.RETURN_SUCCESS,
            title: "Book Returned",
            metadata: payload,
        });
    }
}
exports.NotificationService = NotificationService;
// Singleton instance
exports.notificationService = new NotificationService();

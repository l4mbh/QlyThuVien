"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.NotificationController = void 0;
const notification_service_1 = require("../../services/notification/notification.service");
const shared_1 = require("@qltv/shared");
class NotificationController {
    constructor() {
        this.getNotifications = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const notifications = await notification_service_1.notificationService.getUserNotifications(userId);
                const response = {
                    data: notifications,
                    code: shared_1.ErrorCode.SUCCESS
                };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.markAsRead = async (req, res, next) => {
            try {
                const id = req.params.id;
                const notification = await notification_service_1.notificationService.markAsRead(id);
                const response = {
                    data: notification,
                    code: shared_1.ErrorCode.SUCCESS
                };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.markAllAsRead = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const result = await notification_service_1.notificationService.markAllAsRead(userId);
                const response = {
                    data: result,
                    code: shared_1.ErrorCode.SUCCESS
                };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.NotificationController = NotificationController;
exports.notificationController = new NotificationController();

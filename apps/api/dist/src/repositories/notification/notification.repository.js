"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
class NotificationRepository {
    async create(data) {
        return db_1.default.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                title: data.title,
                message: data.message ?? null,
                metadata: (data.metadata || {}),
            },
        });
    }
    async findByUserId(userId) {
        return db_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
    async markAsRead(id) {
        return db_1.default.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return db_1.default.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    async delete(id) {
        await db_1.default.notification.delete({ where: { id } });
    }
}
exports.NotificationRepository = NotificationRepository;

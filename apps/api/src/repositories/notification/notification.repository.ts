import prisma from "../../config/db/db";
import { CreateNotificationDto, Notification } from "@qltv/shared";

export class NotificationRepository {
  async create(data: CreateNotificationDto): Promise<Notification> {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title as string,
        message: data.message ?? null,
        metadata: (data.metadata || {}) as any,
      },
    }) as unknown as Notification;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }) as unknown as Notification[];
  }

  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    }) as unknown as Notification;
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.notification.delete({ where: { id } });
  }
}

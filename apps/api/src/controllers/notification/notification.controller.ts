import { Request, Response, NextFunction } from "express";
import { notificationService } from "../../services/notification/notification.service";
import { ApiResponse, ErrorCode } from "@qltv/shared";

export class NotificationController {
  getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const notifications = await notificationService.getUserNotifications(userId);
      
      const response: ApiResponse = {
        data: notifications,
        code: ErrorCode.SUCCESS
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const notification = await notificationService.markAsRead(id);
      
      const response: ApiResponse = {
        data: notification,
        code: ErrorCode.SUCCESS
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const result = await notificationService.markAllAsRead(userId);
      
      const response: ApiResponse = {
        data: result,
        code: ErrorCode.SUCCESS
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}

export const notificationController = new NotificationController();

import { Router } from "express";
import { notificationController } from "../../controllers/notification/notification.controller";
import { authMiddleware } from "../../middlewares/auth/auth.middleware";

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

router.get("/", notificationController.getNotifications);
router.patch("/:id/read", notificationController.markAsRead);
router.post("/mark-all-read", notificationController.markAllAsRead);

export default router;

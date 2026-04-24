"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../../controllers/notification/notification.controller");
const auth_middleware_1 = require("../../middlewares/auth/auth.middleware");
const router = (0, express_1.Router)();
// All notification routes require authentication
router.use(auth_middleware_1.authMiddleware);
router.get("/", notification_controller_1.notificationController.getNotifications);
router.patch("/:id/read", notification_controller_1.notificationController.markAsRead);
router.patch("/read-all", notification_controller_1.notificationController.markAllAsRead);
exports.default = router;

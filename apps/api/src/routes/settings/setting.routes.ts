import { Router } from "express";
import { settingController } from "../../controllers/settings/setting.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";
import { UserRole } from "@qltv/shared";

const router = Router();

// Tất cả các route trong này đều yêu cầu quyền ADMIN
router.use(authMiddleware);
router.use(roleMiddleware([UserRole.ADMIN]));

/**
 * System Settings Endpoints
 */
router.get("/", settingController.getAll);
router.patch("/:key", settingController.update);

/**
 * Notification Settings Endpoints
 */
router.get("/notifications", settingController.getNotificationSettings);
router.patch("/notifications/:type", settingController.updateNotificationRouting);

export default router;

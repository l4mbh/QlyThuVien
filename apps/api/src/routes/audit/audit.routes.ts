import { Router } from "express";
import { AuditController } from "../../controllers/audit/audit.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();
const auditController = new AuditController();

// Only ADMIN and STAFF can view audit logs
router.get("/", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), auditController.getRecentActivities);
router.get("/history/:type/:id", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), auditController.getEntityHistory);

export default router;

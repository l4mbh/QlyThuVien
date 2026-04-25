import { Router } from "express";
import userRoutes from "./user/user.routes";
import bookRoutes from "./book/book.routes";
import borrowRoutes from "./borrow/borrow.routes";
import authRoutes from "../modules/auth/auth.routes";
import categoryRoutes from "./category/category.routes";
import isbnRoutes from "../modules/isbn/isbn.routes";
import reportRoutes from "./report/report.routes";
import auditRoutes from "./audit/audit.routes";
import notificationRoutes from "./notification/notification.routes";
import settingRoutes from "./settings/setting.routes";
import systemRoutes from "./system/system.routes";
import reservationRoutes from "./reservation/reservation.routes";

import { maintenanceMiddleware } from "../middlewares/system/maintenance.middleware";

const router = Router();

// Global Protection
router.use(maintenanceMiddleware);

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/books", isbnRoutes); 
router.use("/categories", categoryRoutes);
router.use("/borrow", borrowRoutes);
router.use("/reports", reportRoutes);
router.use("/audit-logs", auditRoutes);
router.use("/notifications", notificationRoutes);
router.use("/settings", settingRoutes);
router.use("/system", systemRoutes);
router.use("/reservations", reservationRoutes);

export default router;


import { Router } from "express";
import { ReportController } from "../../controllers/report/report.controller";
import { authMiddleware } from "../../middlewares/auth/auth.middleware";

const router = Router();
const reportController = new ReportController();

router.get("/summary", authMiddleware, reportController.getSummary);
router.get("/borrow-trends", authMiddleware, reportController.getBorrowTrends);
router.get("/top-books", authMiddleware, reportController.getTopBooks);
router.get("/overdue", authMiddleware, reportController.getOverdueItems);
router.get("/monthly", authMiddleware, reportController.getMonthlyReport);
router.get("/inventory", authMiddleware, reportController.getInventoryReport);
router.get("/readers", authMiddleware, reportController.getReaderActivityReport);
router.get("/fines", authMiddleware, reportController.getFineReport);

export default router;

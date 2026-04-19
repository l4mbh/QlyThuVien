import { Router } from "express";
import { BorrowController } from "../../controllers/borrow/borrow.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();
const borrowController = new BorrowController();

router.get("/", authMiddleware, borrowController.getAllBorrows);
router.post("/", authMiddleware, roleMiddleware([UserRole.STAFF, UserRole.ADMIN]), borrowController.createBorrow);
router.post("/return", authMiddleware, roleMiddleware([UserRole.STAFF, UserRole.ADMIN]), borrowController.returnBook);
router.get("/:id", authMiddleware, borrowController.getBorrowById);

export default router;

import { Router } from "express";
import { CategoryController } from "./category.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();
const categoryController = new CategoryController();

router.get("/", authMiddleware, categoryController.getAllCategories);
router.post("/", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), categoryController.createCategory);
router.get("/:id", authMiddleware, categoryController.getCategoryById);

export default router;

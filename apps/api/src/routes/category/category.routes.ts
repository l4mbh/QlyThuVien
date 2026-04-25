import { Router } from "express";
import { CategoryController } from "../../controllers/category/category.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();
const categoryController = new CategoryController();

router.get("/", categoryController.getAllCategories);
router.post("/", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), categoryController.createCategory);
router.put("/:id", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), categoryController.updateCategory);
router.delete("/bulk", authMiddleware, roleMiddleware([UserRole.ADMIN]), categoryController.bulkDelete);
router.delete("/:id", authMiddleware, roleMiddleware([UserRole.ADMIN]), categoryController.deleteCategory);

export default router;


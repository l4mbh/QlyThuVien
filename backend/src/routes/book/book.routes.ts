import { Router } from "express";
import { BookController } from "../../controllers/book/book.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();
const bookController = new BookController();

router.get("/", authMiddleware, bookController.getAllBooks);
router.post("/", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), bookController.createBook);
router.get("/:id", authMiddleware, bookController.getBookById);
router.get("/fetch-isbn/:isbn", authMiddleware, bookController.fetchISBN);
router.patch("/:id", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), bookController.updateBook);

// Inventory Log Routes
router.post("/:id/inventory-adjustments", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), bookController.adjustInventory);
router.get("/:id/inventory-logs", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), bookController.getInventoryLogs);

router.delete("/bulk", authMiddleware, roleMiddleware([UserRole.ADMIN]), bookController.bulkDeleteBooks);
router.delete("/:id", authMiddleware, roleMiddleware([UserRole.ADMIN]), bookController.deleteBook);

export default router;

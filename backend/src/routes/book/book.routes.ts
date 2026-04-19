import { Router } from "express";
import { BookController } from "../../controllers/book/book.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();
const bookController = new BookController();

router.get("/", authMiddleware, bookController.getAllBooks);
router.post("/", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), bookController.createBook);
router.get("/:id", authMiddleware, bookController.getBookById);
router.patch("/:id", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), bookController.updateBook);
router.delete("/:id", authMiddleware, roleMiddleware([UserRole.ADMIN]), bookController.deleteBook);

export default router;

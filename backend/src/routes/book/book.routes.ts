import { Router } from "express";
import { BookController } from "../../controllers/book/book.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";

const router = Router();
const bookController = new BookController();

router.get("/", authMiddleware, bookController.getAllBooks);
router.post("/", authMiddleware, roleMiddleware(["ADMIN", "STAFF"]), bookController.createBook);
router.get("/:id", authMiddleware, bookController.getBookById);
router.patch("/:id", authMiddleware, roleMiddleware(["ADMIN", "STAFF"]), bookController.updateBook);
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), bookController.deleteBook);

export default router;

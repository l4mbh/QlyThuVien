import { Router } from "express";
import userRoutes from "./user/user.routes";
import bookRoutes from "./book/book.routes";
import borrowRoutes from "./borrow/borrow.routes";
import authRoutes from "../modules/auth/auth.routes";
import categoryRoutes from "./category/category.routes";
import isbnRoutes from "../modules/isbn/isbn.routes";
import reportRoutes from "./report/report.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/books", isbnRoutes); // Mount isbn routes under /books to get /books/fetch-isbn
router.use("/categories", categoryRoutes);
router.use("/borrow", borrowRoutes);
router.use("/reports", reportRoutes);

export default router;


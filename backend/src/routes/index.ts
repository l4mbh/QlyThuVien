import { Router } from "express";
import userRoutes from "./user/user.routes";
import bookRoutes from "./book/book.routes";
import borrowRoutes from "./borrow/borrow.routes";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/borrow", borrowRoutes);

export default router;

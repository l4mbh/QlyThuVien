import { Router } from "express";
import { IsbnController } from "./isbn.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();
const isbnController = new IsbnController();

// Use POST /books/fetch-isbn as requested
router.post("/fetch-isbn", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), isbnController.fetchBookByIsbn);

export default router;

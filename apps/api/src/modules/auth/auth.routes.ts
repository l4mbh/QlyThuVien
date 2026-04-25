import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/reader-login", authController.readerLogin);
router.get("/me", authMiddleware, authController.getMe);

export default router;


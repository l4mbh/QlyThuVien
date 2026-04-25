import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();
const userController = new UserController();

router.get("/", authMiddleware, userController.getAllUsers);
router.get("/lookup", authMiddleware, userController.lookupUserByPhone);
router.post("/", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), userController.createUser);
router.get("/:id", authMiddleware, userController.getUserById);
router.patch("/:id", authMiddleware, userController.updateUser);
router.patch("/:id/block", authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.STAFF]), userController.blockUser);

export default router;


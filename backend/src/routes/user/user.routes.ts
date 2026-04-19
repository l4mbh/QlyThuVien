import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";

const router = Router();
const userController = new UserController();

router.get("/", authMiddleware, userController.getAllUsers);
router.post("/", authMiddleware, roleMiddleware(["ADMIN"]), userController.createUser);
router.get("/:id", authMiddleware, userController.getUserById);
router.patch("/:id", authMiddleware, userController.updateUser);
router.patch("/:id/block", authMiddleware, roleMiddleware(["ADMIN"]), userController.blockUser);

export default router;

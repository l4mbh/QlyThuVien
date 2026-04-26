import { Router } from "express";
import { ReservationController } from "../../controllers/reservation/reservation.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();
const reservationController = new ReservationController();

// Staff/Admin can see all reservations
router.get("/", authMiddleware, roleMiddleware([UserRole.STAFF, UserRole.ADMIN]), reservationController.getAllReservations);
router.get("/urgent", authMiddleware, roleMiddleware([UserRole.STAFF, UserRole.ADMIN]), reservationController.getUrgentReservations);

// Reader/Staff/Admin can see their own
router.get("/my", authMiddleware, reservationController.getMyReservations);

// Create reservation (Open to all identified users)
router.post("/", authMiddleware, reservationController.createReservation);

// Cancel reservation (Self or Staff/Admin)
router.post("/:id/cancel", authMiddleware, reservationController.cancelReservation);

export default router;

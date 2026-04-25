import { ReservationStatus } from "@prisma/client";
import { reservationService } from "../services/reservation/reservation.service";
import prisma from "../config/db/db";
import cron from "node-cron";

/**
 * Job to cleanup expired reservations (READY status but passed expiresAt)
 * Runs periodically to promote the next person in queue if someone fails to pick up
 */
export const cleanupExpiredReservations = async () => {
  console.log("[Job] Running reservation cleanup job...");
  
  try {
    const now = new Date();
    
    // Find all READY reservations that have expired
    const expiredReservations = await prisma.reservation.findMany({
      where: {
        status: ReservationStatus.READY,
        expiresAt: {
          lt: now
        }
      }
    });

    if (expiredReservations.length === 0) {
      console.log("[Job] No expired reservations found.");
      return;
    }

    console.log(`[Job] Found ${expiredReservations.length} expired reservations. Processing...`);

    for (const res of expiredReservations) {
      try {
        await reservationService.markAsExpired(res.id);
        console.log(`[Job] Reservation ${res.id} marked as EXPIRED.`);
      } catch (err: any) {
        console.error(`[Job] Failed to expire reservation ${res.id}: ${err.message}`);
      }
    }

    console.log("[Job] Reservation cleanup job completed.");
  } catch (error: any) {
    console.error(`[Job] Critical error in reservation cleanup job: ${error.message}`);
  }
};

export const initReservationCleanupJob = () => {
  // Run every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    await cleanupExpiredReservations();
  });
  console.log("[Job] Reservation cleanup scheduled (every 15m)");
};

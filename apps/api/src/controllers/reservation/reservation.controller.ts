import { Request, Response, NextFunction } from "express";
import { reservationService } from "../../services/reservation/reservation.service";
import { ErrorCode, ApiResponse } from "@qltv/shared";

export class ReservationController {
  getAllReservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const list = await reservationService.getAllReservations();
      const response: ApiResponse = { data: list, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getMyReservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const list = await reservationService.getMyReservations(userId);
      const response: ApiResponse = { data: list, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performerId = (req as any).user?.userId || "SYSTEM"; // Handle guest or identified
      // If identified by phone, userId might be in body or resolved in service
      const result = await reservationService.createReservation(req.body, performerId);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  cancelReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performerId = (req as any).user.userId as string;
      const result = await reservationService.cancelReservation(req.params.id as string, performerId);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  markAsExpired = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performerId = (req as any).user.userId as string;
      const result = await reservationService.markAsExpired(req.params.id as string, undefined, performerId);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}

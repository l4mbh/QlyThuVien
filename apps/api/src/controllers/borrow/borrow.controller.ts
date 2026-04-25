import { Request, Response, NextFunction } from "express";
import { borrowService } from "../../services/borrow/borrow.service";
import { ErrorCode } from "@qltv/shared";
import { ApiResponse } from "@qltv/shared";

export class BorrowController {
  constructor() {}

  getAllBorrows = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrows = await borrowService.getAllBorrows();
      const response: ApiResponse = { data: borrows, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getMyBorrowed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const borrows = await borrowService.getMyBorrowed(userId);
      const response: ApiResponse = { data: borrows, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getBorrowById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrow = await borrowService.getBorrowById(req.params.id as string);
      const response: ApiResponse = { data: borrow, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  createBorrow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performerId = (req as any).user.userId;
      const borrow = await borrowService.createBorrow(req.body, performerId);
      const response: ApiResponse = { data: borrow, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  returnBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performerId = (req as any).user.userId;
      const result = await borrowService.returnBook(req.body, performerId);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}


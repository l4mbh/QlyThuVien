import { Request, Response, NextFunction } from "express";
import { BorrowService } from "../../services/borrow/borrow.service";
import { ErrorCode } from "@qltv/shared";
import { ApiResponse } from "@qltv/shared";

export class BorrowController {
  private borrowService: BorrowService;

  constructor() {
    this.borrowService = new BorrowService();
  }

  getAllBorrows = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrows = await this.borrowService.getAllBorrows();
      const response: ApiResponse = { data: borrows, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getMyBorrowed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const borrows = await this.borrowService.getMyBorrowed(userId);
      const response: ApiResponse = { data: borrows, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getBorrowById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrow = await this.borrowService.getBorrowById(req.params.id as string);
      const response: ApiResponse = { data: borrow, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  createBorrow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performerId = (req as any).user.userId;
      const borrow = await this.borrowService.createBorrow(req.body, performerId);
      const response: ApiResponse = { data: borrow, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  returnBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performerId = (req as any).user.userId;
      const result = await this.borrowService.returnBook(req.body, performerId);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}


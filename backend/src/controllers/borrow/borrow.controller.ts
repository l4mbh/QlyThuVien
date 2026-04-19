import { Request, Response, NextFunction } from "express";
import { BorrowService } from "../../services/borrow/borrow.service";
import { ErrorCode } from "../../constants/errors/error.enum";
import { ApiResponse } from "../../types/shared/response.type";

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
      const borrow = await this.borrowService.createBorrow(req.body);
      const response: ApiResponse = { data: borrow, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  returnBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.borrowService.returnBook(req.body);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}

import { Request, Response, NextFunction } from "express";
import { bookService } from "../../services/book/book.service";
import { isbnService } from "../../modules/isbn/isbn.service";
import { ErrorCode } from "@qltv/shared";
import { ApiResponse } from "@qltv/shared";

export class BookController {
  constructor() {}

  getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, categoryId, available, sort, page, limit } = req.query;
      const books = await bookService.getAllBooks({
        search: search as string,
        categoryId: categoryId as string,
        available: available === 'true' ? true : available === 'false' ? false : undefined,
        sort: sort as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      });
      const response: ApiResponse = { data: books, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await bookService.getBookById(req.params.id as string);
      const response: ApiResponse = { data: book, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const book = await bookService.createBook(req.body, userId);
      const response: ApiResponse = { data: book, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const book = await bookService.updateBook(req.params.id as string, req.body, userId);
      const response: ApiResponse = { data: book, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const book = await bookService.deleteBook(req.params.id as string, userId);
      const response: ApiResponse = { data: book, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  bulkDeleteBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      const result = await bookService.bulkDeleteBooks(ids);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  fetchISBN = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const info = await isbnService.fetchBookByIsbn(req.params.isbn as string);
      const response: ApiResponse = { data: info, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  adjustInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.user must exist because this route will be protected by authMiddleware
      const userId = (req as any).user.userId;
      const result = await bookService.adjustInventory(req.params.id as string, userId, req.body);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getInventoryLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await bookService.getInventoryLogs(req.params.id as string);
      const response: ApiResponse = { data: logs, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}



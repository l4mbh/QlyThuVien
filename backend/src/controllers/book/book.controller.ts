import { Request, Response, NextFunction } from "express";
import { BookService } from "../../services/book/book.service";
import { ErrorCode } from "../../constants/errors/error.enum";
import { ApiResponse } from "../../types/shared/response.type";

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const books = await this.bookService.getAllBooks();
      const response: ApiResponse = { data: books, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.bookService.getBookById(req.params.id as string);
      const response: ApiResponse = { data: book, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.bookService.createBook(req.body);
      const response: ApiResponse = { data: book, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.bookService.updateBook(req.params.id as string, req.body);
      const response: ApiResponse = { data: book, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.bookService.deleteBook(req.params.id as string);
      const response: ApiResponse = { data: book, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}

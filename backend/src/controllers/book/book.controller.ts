import { Request, Response, NextFunction } from "express";
import { BookService, IsbnService } from "../../services/book/book.service";
import { ErrorCode } from "../../constants/errors/error.enum";
import { ApiResponse } from "../../types/shared/response.type";

export class BookController {
  private bookService: BookService;
  private isbnService: IsbnService;

  constructor() {
    this.bookService = new BookService();
    this.isbnService = new IsbnService();
  }

  getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, categoryId, available, sort, page, limit } = req.query;
      const books = await this.bookService.getAllBooks({
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

  bulkDeleteBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      const result = await this.bookService.bulkDeleteBooks(ids);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  fetchISBN = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const info = await this.isbnService.fetchBookInfo(req.params.isbn as string);
      const response: ApiResponse = { data: info, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}

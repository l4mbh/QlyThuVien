"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const book_service_1 = require("../../services/book/book.service");
const error_codes_1 = require("@shared/constants/error-codes");
class BookController {
    constructor() {
        this.getAllBooks = async (req, res, next) => {
            try {
                const { search, categoryId, available, sort, page, limit } = req.query;
                const books = await this.bookService.getAllBooks({
                    search: search,
                    categoryId: categoryId,
                    available: available === 'true' ? true : available === 'false' ? false : undefined,
                    sort: sort,
                    page: page ? parseInt(page) : undefined,
                    limit: limit ? parseInt(limit) : undefined
                });
                const response = { data: books, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.getBookById = async (req, res, next) => {
            try {
                const book = await this.bookService.getBookById(req.params.id);
                const response = { data: book, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.createBook = async (req, res, next) => {
            try {
                const book = await this.bookService.createBook(req.body);
                const response = { data: book, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateBook = async (req, res, next) => {
            try {
                const book = await this.bookService.updateBook(req.params.id, req.body);
                const response = { data: book, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteBook = async (req, res, next) => {
            try {
                const book = await this.bookService.deleteBook(req.params.id);
                const response = { data: book, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.bulkDeleteBooks = async (req, res, next) => {
            try {
                const { ids } = req.body;
                const result = await this.bookService.bulkDeleteBooks(ids);
                const response = { data: result, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.fetchISBN = async (req, res, next) => {
            try {
                const info = await this.isbnService.fetchBookInfo(req.params.isbn);
                const response = { data: info, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.adjustInventory = async (req, res, next) => {
            try {
                // req.user must exist because this route will be protected by authMiddleware
                const userId = req.user.userId;
                const result = await this.bookService.adjustInventory(req.params.id, userId, req.body);
                const response = { data: result, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.getInventoryLogs = async (req, res, next) => {
            try {
                const logs = await this.bookService.getInventoryLogs(req.params.id);
                const response = { data: logs, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.bookService = new book_service_1.BookService();
        this.isbnService = new book_service_1.IsbnService();
    }
}
exports.BookController = BookController;

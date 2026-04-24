"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsbnService = exports.BookService = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = __importDefault(require("../../config/db/db"));
const book_repository_1 = require("../../repositories/book/book.repository");
const book_entity_1 = require("../../types/book/book.entity");
const error_codes_1 = require("@shared/constants/error-codes");
const category_service_1 = require("../category/category.service");
const generateCallNumber_1 = require("../../utils/generateCallNumber");
const app_error_1 = require("../../utils/app-error");
class BookService {
    constructor() {
        this.bookRepository = new book_repository_1.BookRepository();
        this.categoryService = new category_service_1.CategoryService();
    }
    async getAllBooks(filter) {
        return this.bookRepository.findAll(filter);
    }
    async getBookById(id) {
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new app_error_1.AppError(error_codes_1.ErrorCode.BOOK_NOT_FOUND, "Book not found");
        }
        return book;
    }
    async createBook(data) {
        const existingBook = await this.bookRepository.findByIsbn(data.isbn);
        if (existingBook) {
            throw new app_error_1.AppError(error_codes_1.ErrorCode.BOOK_ALREADY_EXISTS, "Book with this ISBN already exists");
        }
        // Handle Category
        let categoryId = data.categoryId;
        let category;
        if (!categoryId) {
            category = await this.categoryService.getOrCreateCategory("Unknown", "000");
            categoryId = category.id;
        }
        else {
            category = await this.categoryService.getCategoryById(categoryId);
            if (!category) {
                throw new app_error_1.AppError(error_codes_1.ErrorCode.CATEGORY_NOT_FOUND, "Category not found");
            }
        }
        // Handle Call Number
        if (!data.callNumber) {
            data.callNumber = await (0, generateCallNumber_1.generateCallNumber)(data.author, data.publishedYear || new Date().getFullYear(), category.code || "000");
        }
        return this.bookRepository.create({
            ...data,
            categoryId
        });
    }
    async updateBook(id, data) {
        await this.getBookById(id);
        return this.bookRepository.update(id, data);
    }
    async deleteBook(id) {
        await this.getBookById(id);
        return this.bookRepository.softDelete(id);
    }
    async bulkDeleteBooks(ids) {
        return this.bookRepository.bulkDelete(ids);
    }
    async adjustInventory(bookId, userId, data) {
        const book = await this.getBookById(bookId);
        const newAvailable = book.availableQuantity + data.change;
        if (newAvailable < 0) {
            throw new app_error_1.AppError(error_codes_1.ErrorCode.VALIDATION_ERROR, "Insufficient available quantity (cannot decrease below 0).");
        }
        let newTotal = book.totalQuantity;
        if (data.reason === book_entity_1.InventoryLogReason.RESTOCK) {
            newTotal = book.totalQuantity + data.change;
        }
        else if (data.reason === book_entity_1.InventoryLogReason.DAMAGED || data.reason === book_entity_1.InventoryLogReason.LOST) {
            newTotal = book.totalQuantity - Math.abs(data.change);
        } // MANUAL_ADJUST only affects availableQuantity
        const borrowedCount = book.totalQuantity - book.availableQuantity;
        if (newTotal < borrowedCount) {
            throw new app_error_1.AppError(error_codes_1.ErrorCode.VALIDATION_ERROR, "Total quantity cannot be less than the number of books currently borrowed.");
        }
        return db_1.default.$transaction(async (tx) => {
            const updatedBook = await tx.book.update({
                where: { id: bookId },
                data: {
                    totalQuantity: newTotal,
                    availableQuantity: newAvailable
                },
                include: { category: true }
            });
            await tx.inventoryLog.create({
                data: {
                    bookId,
                    userId,
                    change: data.change,
                    reason: data.reason,
                    note: data.note || null
                }
            });
            return updatedBook;
        });
    }
    async getInventoryLogs(bookId) {
        return db_1.default.inventoryLog.findMany({
            where: { bookId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true }
                }
            }
        });
    }
}
exports.BookService = BookService;
class IsbnService {
    async fetchBookInfo(isbn) {
        // 1. Try Google Books API first
        try {
            const googleRes = await axios_1.default.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
            if (googleRes.data.totalItems > 0) {
                const item = googleRes.data.items[0].volumeInfo;
                return {
                    title: item.title,
                    author: item.authors?.join(", ") || "Unknown",
                    category: item.categories?.[0] || "Unknown",
                    publishedYear: item.publishedDate ? item.publishedDate.split("-")[0] : undefined,
                    coverUrl: item.imageLinks?.thumbnail || item.imageLinks?.smallThumbnail,
                    source: "Google Books"
                };
            }
        }
        catch (error) {
            console.warn("Google Books fetch failed, trying fallback...", error);
        }
        // 2. Fallback to Open Library API
        try {
            const openLibraryRes = await axios_1.default.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
            const data = openLibraryRes.data[`ISBN:${isbn}`];
            if (data) {
                return {
                    title: data.title,
                    author: data.authors?.map((a) => a.name).join(", ") || "Unknown",
                    category: data.subjects?.[0]?.name || "Unknown",
                    publishedYear: data.publish_date ? data.publish_date.toString().match(/\d{4}/)?.[0] : undefined,
                    coverUrl: data.cover?.large || data.cover?.medium || data.cover?.small,
                    source: "Open Library"
                };
            }
        }
        catch (error) {
            console.error("Open Library fallback failed:", error);
        }
        // 3. If both fail
        throw new app_error_1.AppError(error_codes_1.ErrorCode.BOOK_NOT_FOUND, "Could not find book info from any source");
    }
}
exports.IsbnService = IsbnService;

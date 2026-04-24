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
const shared_1 = require("@qltv/shared");
const category_service_1 = require("../category/category.service");
const generateCallNumber_1 = require("../../utils/generateCallNumber");
const app_error_1 = require("../../utils/app-error");
const audit_service_1 = require("../audit/audit.service");
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
            throw new app_error_1.AppError(shared_1.ErrorCode.BOOK_NOT_FOUND, "Book not found");
        }
        return book;
    }
    async createBook(data, userId) {
        const existingBook = await this.bookRepository.findByIsbn(data.isbn);
        if (existingBook) {
            throw new app_error_1.AppError(shared_1.ErrorCode.BOOK_ALREADY_EXISTS, "Book with this ISBN already exists");
        }
        // Handle Category
        let categoryId = data.categoryId;
        let category;
        if (!categoryId) {
            category = await this.categoryService.getOrCreateCategory("Unknown", "000", userId);
            categoryId = category.id;
        }
        else {
            category = await this.categoryService.getCategoryById(categoryId);
            if (!category) {
                throw new app_error_1.AppError(shared_1.ErrorCode.CATEGORY_NOT_FOUND, "Category not found");
            }
        }
        // Handle Call Number
        if (!data.callNumber) {
            data.callNumber = await (0, generateCallNumber_1.generateCallNumber)(data.author, data.publishedYear || new Date().getFullYear(), category.code || "000");
        }
        const book = await this.bookRepository.create({
            ...data,
            categoryId
        });
        // Log Event
        await audit_service_1.auditService.logEvent({
            action: shared_1.AuditAction.CREATE_BOOK,
            entityType: shared_1.AuditEntityType.BOOK,
            entityId: book.id,
            userId,
            metadata: { title: book.title, isbn: book.isbn }
        });
        return book;
    }
    async updateBook(id, data, userId) {
        await this.getBookById(id);
        const book = await this.bookRepository.update(id, data);
        // Log Event
        await audit_service_1.auditService.logEvent({
            action: shared_1.AuditAction.UPDATE_BOOK,
            entityType: shared_1.AuditEntityType.BOOK,
            entityId: book.id,
            userId,
            metadata: { title: book.title, changes: data }
        });
        return book;
    }
    async deleteBook(id, userId) {
        await this.getBookById(id);
        const book = await this.bookRepository.softDelete(id);
        // Log Event
        await audit_service_1.auditService.logEvent({
            action: shared_1.AuditAction.DELETE_BOOK,
            entityType: shared_1.AuditEntityType.BOOK,
            entityId: book.id,
            userId,
            metadata: { title: book.title }
        });
        return book;
    }
    async bulkDeleteBooks(ids) {
        return this.bookRepository.bulkDelete(ids);
    }
    async adjustInventory(bookId, userId, data) {
        const book = await this.getBookById(bookId);
        const newAvailable = book.availableQuantity + data.change;
        if (newAvailable < 0) {
            throw new app_error_1.AppError(shared_1.ErrorCode.VALIDATION_ERROR, "Insufficient available quantity (cannot decrease below 0).");
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
            throw new app_error_1.AppError(shared_1.ErrorCode.VALIDATION_ERROR, "Total quantity cannot be less than the number of books currently borrowed.");
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
            // Log Audit Event
            await audit_service_1.auditService.logEvent({
                action: shared_1.AuditAction.INVENTORY_ADJUSTED,
                entityType: shared_1.AuditEntityType.BOOK,
                entityId: bookId,
                userId,
                metadata: {
                    title: updatedBook.title,
                    change: data.change,
                    reason: data.reason,
                    newAvailable: updatedBook.availableQuantity
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
        throw new app_error_1.AppError(shared_1.ErrorCode.BOOK_NOT_FOUND, "Could not find book info from any source");
    }
}
exports.IsbnService = IsbnService;

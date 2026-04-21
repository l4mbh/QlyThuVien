"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsbnService = exports.BookService = void 0;
const axios_1 = __importDefault(require("axios"));
const book_repository_1 = require("../../repositories/book/book.repository");
const error_enum_1 = require("../../constants/errors/error.enum");
const category_service_1 = require("../category/category.service");
const generateCallNumber_1 = require("../../utils/generateCallNumber");
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
            const error = new Error("Book not found");
            error.errorCode = error_enum_1.ErrorCode.BOOK_NOT_FOUND;
            throw error;
        }
        return book;
    }
    async createBook(data) {
        const existingBook = await this.bookRepository.findByIsbn(data.isbn);
        if (existingBook) {
            const error = new Error("Book with this ISBN already exists");
            error.errorCode = error_enum_1.ErrorCode.BOOK_ALREADY_EXISTS;
            throw error;
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
                const error = new Error("Category not found");
                error.errorCode = error_enum_1.ErrorCode.CATEGORY_NOT_FOUND;
                throw error;
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
        const error = new Error("Could not find book info from any source");
        error.errorCode = error_enum_1.ErrorCode.ISBN_NOT_FOUND;
        throw error;
    }
}
exports.IsbnService = IsbnService;

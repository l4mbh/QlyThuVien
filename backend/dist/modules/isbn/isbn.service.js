"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsbnService = void 0;
const env_1 = require("../../config/env/env");
class IsbnService {
    async fetchFromGoogleBooks(isbn) {
        const apiKey = env_1.ENV.GOOGLE_BOOKS_API_KEY;
        const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}${apiKey ? `&key=${apiKey}` : ""}`;
        const response = await fetch(url);
        if (!response.ok)
            throw new Error("Google Books API request failed");
        const data = (await response.json());
        if (!data.items || data.items.length === 0) {
            throw new Error("No book found with this ISBN on Google Books");
        }
        const info = data.items[0].volumeInfo;
        return {
            title: info.title || "Unknown Title",
            author: info.authors ? info.authors[0] : "Unknown Author",
            category: info.categories ? info.categories[0] : "Unknown",
            publishedYear: info.publishedDate ? info.publishedDate.split("-")[0] : new Date().getFullYear(),
            coverUrl: info.imageLinks?.thumbnail,
        };
    }
    async fetchFromOpenLibrary(isbn) {
        const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
        const response = await fetch(url);
        if (!response.ok)
            throw new Error("OpenLibrary API request failed");
        const data = (await response.json());
        const bookKey = `ISBN:${isbn}`;
        const book = data[bookKey];
        if (!book) {
            throw new Error("No book found with this ISBN on OpenLibrary");
        }
        return {
            title: book.title || "Unknown Title",
            author: book.authors ? book.authors[0].name : "Unknown Author",
            category: book.subjects ? book.subjects[0].name : "Unknown",
            publishedYear: book.publish_date ? book.publish_date.match(/\d{4}/)?.[0] || new Date().getFullYear() : new Date().getFullYear(),
            coverUrl: book.cover?.large || book.cover?.medium,
        };
    }
    async fetchBookByIsbn(isbn) {
        try {
            // Primary: Google Books
            return await this.fetchFromGoogleBooks(isbn);
        }
        catch (error) {
            console.warn(`Google Books failed for ISBN ${isbn}, falling back to OpenLibrary. Error:`, error);
            // Fallback: OpenLibrary
            return await this.fetchFromOpenLibrary(isbn);
        }
    }
}
exports.IsbnService = IsbnService;

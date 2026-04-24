import { ENV } from "../../config/env/env";
import { AppError } from "../../utils/app-error";
import { ErrorCode } from "@shared/constants/error-codes";

export interface ExternalBookInfo {
  title: string;
  author: string;
  category: string;
  publishedYear: string | number;
  coverUrl?: string;
}

export class IsbnService {
  async fetchFromGoogleBooks(isbn: string): Promise<ExternalBookInfo> {
    const apiKey = ENV.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}${apiKey ? `&key=${apiKey}` : ""}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new AppError(ErrorCode.BOOK_NOT_FOUND, "Google Books API request failed");
    
    const data = (await response.json()) as any;
    if (!data.items || data.items.length === 0) {
      throw new AppError(ErrorCode.BOOK_NOT_FOUND, "No book found with this ISBN on Google Books");
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

  async fetchFromOpenLibrary(isbn: string): Promise<ExternalBookInfo> {
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
    
    const response = await fetch(url);
    if (!response.ok) throw new AppError(ErrorCode.BOOK_NOT_FOUND, "OpenLibrary API request failed");
    
    const data = (await response.json()) as any;
    const bookKey = `ISBN:${isbn}`;
    const book = data[bookKey];
    
    if (!book) {
      throw new AppError(ErrorCode.BOOK_NOT_FOUND, "No book found with this ISBN on OpenLibrary");
    }

    return {
      title: book.title || "Unknown Title",
      author: book.authors ? book.authors[0].name : "Unknown Author",
      category: book.subjects ? book.subjects[0].name : "Unknown",
      publishedYear: book.publish_date ? book.publish_date.match(/\d{4}/)?.[0] || new Date().getFullYear() : new Date().getFullYear(),
      coverUrl: book.cover?.large || book.cover?.medium,
    };
  }

  async fetchBookByIsbn(isbn: string): Promise<ExternalBookInfo> {
    try {
      // Primary: Google Books
      return await this.fetchFromGoogleBooks(isbn);
    } catch (error) {
      console.warn(`Google Books failed for ISBN ${isbn}, falling back to OpenLibrary. Error:`, error);
      // Fallback: OpenLibrary
      return await this.fetchFromOpenLibrary(isbn);
    }
  }
}


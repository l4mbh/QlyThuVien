import axios from "axios";
import { BookRepository } from "../../repositories/book/book.repository";
import { CreateBookDTO, UpdateBookDTO, BookEntity, BookFilterDTO } from "../../types/book/book.entity";
import { ErrorCode } from "../../constants/errors/error.enum";
import { CategoryService } from "../category/category.service";
import { generateCallNumber } from "../../utils/generateCallNumber";
import { PaginatedData } from "../../types/shared/response.type";

export class BookService {
  private bookRepository: BookRepository;
  private categoryService: CategoryService;

  constructor() {
    this.bookRepository = new BookRepository();
    this.categoryService = new CategoryService();
  }

  async getAllBooks(filter?: BookFilterDTO): Promise<PaginatedData<BookEntity>> {
    return this.bookRepository.findAll(filter);
  }

  async getBookById(id: string): Promise<BookEntity> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      const error = new Error("Book not found") as any;
      error.errorCode = ErrorCode.BOOK_NOT_FOUND;
      throw error;
    }
    return book;
  }

  async createBook(data: CreateBookDTO): Promise<BookEntity> {
    const existingBook = await this.bookRepository.findByIsbn(data.isbn);
    if (existingBook) {
      const error = new Error("Book with this ISBN already exists") as any;
      error.errorCode = ErrorCode.BOOK_ALREADY_EXISTS;
      throw error;
    }

    // Handle Category
    let categoryId = data.categoryId;
    let category;
    if (!categoryId) {
      category = await this.categoryService.getOrCreateCategory("Unknown", "000");
      categoryId = category.id;
    } else {
      category = await this.categoryService.getCategoryById(categoryId);
      if (!category) {
        const error = new Error("Category not found") as any;
        error.errorCode = ErrorCode.CATEGORY_NOT_FOUND;
        throw error;
      }
    }

    // Handle Call Number
    if (!data.callNumber) {
      data.callNumber = await generateCallNumber(
        data.author,
        data.publishedYear || new Date().getFullYear(),
        category.code || "000"
      );
    }

    return this.bookRepository.create({
      ...data,
      categoryId
    });
  }

  async updateBook(id: string, data: UpdateBookDTO): Promise<BookEntity> {
    await this.getBookById(id);
    return this.bookRepository.update(id, data);
  }

  async deleteBook(id: string): Promise<BookEntity> {
    await this.getBookById(id);
    return this.bookRepository.softDelete(id);
  }
}

export class IsbnService {
  async fetchBookInfo(isbn: string) {
    // 1. Try Google Books API first
    try {
      const googleRes = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
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
    } catch (error) {
      console.warn("Google Books fetch failed, trying fallback...", error);
    }

    // 2. Fallback to Open Library API
    try {
      const openLibraryRes = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
      const data = openLibraryRes.data[`ISBN:${isbn}`];
      
      if (data) {
        return {
          title: data.title,
          author: data.authors?.map((a: any) => a.name).join(", ") || "Unknown",
          category: data.subjects?.[0]?.name || "Unknown",
          publishedYear: data.publish_date ? data.publish_date.toString().match(/\d{4}/)?.[0] : undefined,
          coverUrl: data.cover?.large || data.cover?.medium || data.cover?.small,
          source: "Open Library"
        };
      }
    } catch (error) {
      console.error("Open Library fallback failed:", error);
    }

    // 3. If both fail
    const error = new Error("Could not find book info from any source") as any;
    error.errorCode = ErrorCode.ISBN_NOT_FOUND;
    throw error;
  }
}

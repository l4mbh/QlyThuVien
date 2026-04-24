import axios from "axios";
import prisma from "../../config/db/db";
import { BookRepository } from "../../repositories/book/book.repository";
import { CreateBookDTO, UpdateBookDTO, BookEntity, BookFilterDTO, AdjustInventoryDTO, InventoryLogEntity, InventoryLogReason } from "../../types/book/book.entity";
import { ErrorCode } from "@qltv/shared";
import { CategoryService } from "../category/category.service";
import { generateCallNumber } from "../../utils/generateCallNumber";
import { PaginatedData } from "@qltv/shared";
import { AppError } from "../../utils/app-error";

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
      throw new AppError(ErrorCode.BOOK_NOT_FOUND, "Book not found");
    }
    return book;
  }

  async createBook(data: CreateBookDTO): Promise<BookEntity> {
    const existingBook = await this.bookRepository.findByIsbn(data.isbn);
    if (existingBook) {
      throw new AppError(ErrorCode.BOOK_ALREADY_EXISTS, "Book with this ISBN already exists");
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
        throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, "Category not found");
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

  async bulkDeleteBooks(ids: string[]): Promise<{ count: number }> {
    return this.bookRepository.bulkDelete(ids);
  }

  async adjustInventory(bookId: string, userId: string, data: AdjustInventoryDTO): Promise<BookEntity> {
    const book = await this.getBookById(bookId);

    const newAvailable = book.availableQuantity + data.change;
    if (newAvailable < 0) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Insufficient available quantity (cannot decrease below 0).");
    }

    let newTotal = book.totalQuantity;
    if (data.reason === InventoryLogReason.RESTOCK) {
      newTotal = book.totalQuantity + data.change;
    } else if (data.reason === InventoryLogReason.DAMAGED || data.reason === InventoryLogReason.LOST) {
      newTotal = book.totalQuantity - Math.abs(data.change);
    } // MANUAL_ADJUST only affects availableQuantity

    const borrowedCount = book.totalQuantity - book.availableQuantity;
    if (newTotal < borrowedCount) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Total quantity cannot be less than the number of books currently borrowed.");
    }


    return prisma.$transaction(async (tx) => {
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

      return updatedBook as unknown as BookEntity;
    });
  }

  async getInventoryLogs(bookId: string): Promise<InventoryLogEntity[]> {
    return prisma.inventoryLog.findMany({
      where: { bookId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true }
        }
      }
    }) as unknown as InventoryLogEntity[];
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
    throw new AppError(ErrorCode.BOOK_NOT_FOUND, "Could not find book info from any source");
  }
}



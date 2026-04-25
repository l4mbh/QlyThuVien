import prisma from "../../config/db/db";
import { BookRepository } from "../../repositories/book/book.repository";
import { CreateBookDTO, UpdateBookDTO, BookEntity, BookFilterDTO, AdjustInventoryDTO, InventoryLogEntity, InventoryLogReason } from "../../types/book/book.entity";
import { ErrorCode, AuditAction, AuditEntityType, ErrorMessage } from "@qltv/shared";
import { categoryService } from "../category/category.service";
import { generateCallNumber } from "../../utils/generateCallNumber";
import { PaginatedData } from "@qltv/shared";
import { AppError } from "../../utils/app-error";
import { auditService } from "../audit/audit.service";

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  async getAllBooks(filter?: BookFilterDTO): Promise<PaginatedData<BookEntity>> {
    return this.bookRepository.findAll(filter);
  }

  async getBookById(id: string): Promise<BookEntity> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new AppError(ErrorCode.BOOK_NOT_FOUND, ErrorMessage.BOOK_NOT_FOUND);
    }
    return book;
  }

  async createBook(data: CreateBookDTO, userId: string): Promise<BookEntity> {
    const existingBook = await this.bookRepository.findByIsbn(data.isbn);
    if (existingBook) {
      throw new AppError(ErrorCode.BOOK_ALREADY_EXISTS, ErrorMessage.BOOK_ALREADY_EXISTS);
    }

    // Handle Category
    let categoryId = data.categoryId;
    let category;
    if (!categoryId) {
      category = await categoryService.getOrCreateCategory("Unknown", "000", userId);
      categoryId = category.id;
    } else {
      category = await categoryService.getCategoryById(categoryId);
      if (!category) {
        throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, ErrorMessage.CATEGORY_NOT_FOUND);
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

    const book = await this.bookRepository.create({
      ...data,
      categoryId
    });

    // Log Event
    await auditService.logEvent({
      action: AuditAction.CREATE_BOOK,
      entityType: AuditEntityType.BOOK,
      entityId: book.id,
      userId,
      metadata: { title: book.title, isbn: book.isbn }
    });

    return book;
  }

  async updateBook(id: string, data: UpdateBookDTO, userId: string): Promise<BookEntity> {
    await this.getBookById(id);
    const book = await this.bookRepository.update(id, data);

    // Log Event
    await auditService.logEvent({
      action: AuditAction.UPDATE_BOOK,
      entityType: AuditEntityType.BOOK,
      entityId: book.id,
      userId,
      metadata: { title: book.title, changes: data }
    });

    return book;
  }

  async deleteBook(id: string, userId: string): Promise<BookEntity> {
    await this.getBookById(id);
    const book = await this.bookRepository.softDelete(id);

    // Log Event
    await auditService.logEvent({
      action: AuditAction.DELETE_BOOK,
      entityType: AuditEntityType.BOOK,
      entityId: book.id,
      userId,
      metadata: { title: book.title }
    });

    return book;
  }

  async bulkDeleteBooks(ids: string[]): Promise<{ count: number }> {
    return this.bookRepository.bulkDelete(ids);
  }

  async adjustInventory(bookId: string, userId: string, data: AdjustInventoryDTO): Promise<BookEntity> {
    const book = await this.getBookById(bookId);

    const newAvailable = book.availableQuantity + data.change;
    if (newAvailable < 0) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, ErrorMessage.INSUFFICIENT_QUANTITY);
    }

    let newTotal = book.totalQuantity;
    if (data.reason === InventoryLogReason.RESTOCK) {
      newTotal = book.totalQuantity + data.change;
    } else if (data.reason === InventoryLogReason.DAMAGED || data.reason === InventoryLogReason.LOST) {
      newTotal = book.totalQuantity - Math.abs(data.change);
    } // MANUAL_ADJUST only affects availableQuantity

    const borrowedCount = book.totalQuantity - book.availableQuantity;
    if (newTotal < borrowedCount) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, ErrorMessage.QUANTITY_LIMIT_VIOLATION);
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

      // Log Audit Event
      await auditService.logEvent({
        action: AuditAction.INVENTORY_ADJUSTED,
        entityType: AuditEntityType.BOOK,
        entityId: bookId,
        userId,
        metadata: {
          title: updatedBook.title,
          change: data.change,
          reason: data.reason,
          newAvailable: updatedBook.availableQuantity
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

export const bookService = new BookService();




import { BookRepository } from "../../repositories/book/book.repository";
import { CreateBookDTO, UpdateBookDTO, BookEntity } from "../../types/book/book.entity";
import { ErrorCode } from "../../constants/errors/error.enum";
import { CategoryService } from "../../modules/category/category.service";
import { generateCallNumber } from "../../utils/generateCallNumber";

export class BookService {
  private bookRepository: BookRepository;
  private categoryService: CategoryService;

  constructor() {
    this.bookRepository = new BookRepository();
    this.categoryService = new CategoryService();
  }

  async getAllBooks(): Promise<BookEntity[]> {
    return this.bookRepository.findAll();
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

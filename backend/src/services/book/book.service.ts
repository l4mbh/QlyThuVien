import { BookRepository } from "../../repositories/book/book.repository";
import { CreateBookDTO, UpdateBookDTO, BookEntity } from "../../types/book/book.entity";
import { ErrorCode } from "../../constants/errors/error.enum";

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
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
    return this.bookRepository.create(data);
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

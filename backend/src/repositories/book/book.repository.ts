import prisma from "../../config/db/db";
import { CreateBookDTO, UpdateBookDTO, BookEntity } from "../../types/book/book.entity";

export class BookRepository {
  async findAll(): Promise<BookEntity[]> {
    return prisma.book.findMany({
      where: { isArchived: false },
    });
  }

  async findById(id: string): Promise<BookEntity | null> {
    return prisma.book.findUnique({ where: { id } });
  }

  async findByIsbn(isbn: string): Promise<BookEntity | null> {
    return prisma.book.findUnique({ where: { isbn } });
  }

  async create(data: CreateBookDTO): Promise<BookEntity> {
    return prisma.book.create({
      data: {
        ...data,
        availableQuantity: data.totalQuantity,
      },
    });
  }

  async update(id: string, data: UpdateBookDTO): Promise<BookEntity> {
    return prisma.book.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<BookEntity> {
    return prisma.book.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  async updateAvailableQuantity(id: string, increment: number): Promise<BookEntity> {
    return prisma.book.update({
      where: { id },
      data: {
        availableQuantity: {
          increment: increment,
        },
      },
    });
  }
}

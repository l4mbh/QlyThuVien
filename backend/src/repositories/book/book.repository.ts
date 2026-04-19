import prisma from "../../config/db/db";
import { CreateBookDTO, UpdateBookDTO, BookEntity } from "../../types/book/book.entity";

export class BookRepository {
  async findAll(): Promise<BookEntity[]> {
    return prisma.book.findMany({
      where: { isArchived: false },
      include: { category: true },
    }) as unknown as BookEntity[];
  }

  async findById(id: string): Promise<BookEntity | null> {
    return prisma.book.findUnique({ 
      where: { id },
      include: { category: true }
    }) as unknown as BookEntity;
  }

  async findByIsbn(isbn: string): Promise<BookEntity | null> {
    return prisma.book.findUnique({ where: { isbn } }) as unknown as BookEntity;
  }

  async create(data: CreateBookDTO): Promise<BookEntity> {
    const { publishedYear, ...createData } = data;
    return prisma.book.create({
      data: {
        ...createData,
        availableQuantity: data.totalQuantity,
      },
      include: { category: true }
    }) as unknown as BookEntity;
  }

  async update(id: string, data: UpdateBookDTO): Promise<BookEntity> {
    return prisma.book.update({ 
      where: { id }, 
      data,
      include: { category: true }
    }) as unknown as BookEntity;
  }

  async softDelete(id: string): Promise<BookEntity> {
    return prisma.book.update({
      where: { id },
      data: { isArchived: true },
    }) as unknown as BookEntity;
  }

  async updateAvailableQuantity(id: string, increment: number): Promise<BookEntity> {
    return prisma.book.update({
      where: { id },
      data: {
        availableQuantity: {
          increment: increment,
        },
      },
    }) as unknown as BookEntity;
  }
}

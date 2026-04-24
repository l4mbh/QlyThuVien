import prisma from "../../config/db/db";
import { CreateBookDTO, UpdateBookDTO, BookEntity, BookFilterDTO } from "../../types/book/book.entity";
import { paginate } from "../../utils/pagination.helper";
import { PaginatedData } from "@qltv/shared";

export class BookRepository {
  async findAll(filter: BookFilterDTO = {}): Promise<PaginatedData<BookEntity>> {
    const { search, categoryId, available, sort, page, limit } = filter;

    const where: any = { isArchived: false };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (available !== undefined) {
      if (available) {
        where.availableQuantity = { gt: 0 };
      } else {
        where.availableQuantity = 0;
      }
    }

    const orderBy: any = {};
    if (sort === 'az') {
      orderBy.title = 'asc';
    } else if (sort === 'author') {
      orderBy.author = 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    return paginate<BookEntity>(
      prisma.book,
      {
        where,
        orderBy,
        include: { category: true },
      },
      { page: page || 1, limit: limit || 10 }
    );
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
    const { publishedYear, categoryId, ...createData } = data;
    return prisma.book.create({
      data: {
        ...createData,
        availableQuantity: data.totalQuantity,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
      include: { category: true }
    }) as unknown as BookEntity;
  }

  async update(id: string, data: UpdateBookDTO): Promise<BookEntity> {
    const { categoryId, ...updateData } = data;
    return prisma.book.update({ 
      where: { id }, 
      data: {
        ...updateData,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
      include: { category: true }
    }) as unknown as BookEntity;
  }

  async softDelete(id: string): Promise<BookEntity> {
    return prisma.book.update({
      where: { id },
      data: { isArchived: true },
    }) as unknown as BookEntity;
  }

  async bulkDelete(ids: string[]): Promise<{ count: number }> {
    return prisma.book.updateMany({
      where: { id: { in: ids } },
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
    }) as unknown as BookEntity;
  }
}


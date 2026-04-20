import prisma from "../../config/db/db";
import { CategoryEntity, CreateCategoryDTO, UpdateCategoryDTO, CategoryFilterDTO } from "../../types/category/category.entity";
import { paginate } from "../../utils/pagination.helper";
import { PaginatedData } from "../../types/shared/response.type";

export class CategoryRepository {
  async findAll(filter: CategoryFilterDTO = {}): Promise<PaginatedData<CategoryEntity>> {
    const { search, page, limit } = filter;
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    return paginate<CategoryEntity>(
      prisma.category,
      {
        where,
        orderBy: { createdAt: "desc" },
      },
      { page: page || 1, limit: limit || 10 }
    );
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    return prisma.category.findFirst({
      where: { name },
    });
  }

  async findByNameExcludeId(name: string, excludeId: string): Promise<CategoryEntity | null> {
    return prisma.category.findFirst({
      where: { 
        name,
        NOT: { id: excludeId }
      },
    });
  }

  async findByIdWithCount(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { books: true }
        }
      }
    });
  }

  async findByIdsWithCount(ids: string[]) {
    return prisma.category.findMany({
      where: { id: { in: ids } },
      include: {
        _count: {
          select: { books: true }
        }
      }
    });
  }

  async create(data: CreateCategoryDTO): Promise<CategoryEntity> {
    return prisma.category.create({
      data: {
        name: data.name,
        code: data.code || null,
      },
    });
  }

  async update(id: string, data: UpdateCategoryDTO): Promise<CategoryEntity> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }

  async deleteMany(ids: string[]): Promise<void> {
    await prisma.category.deleteMany({
      where: { id: { in: ids } },
    });
  }
}

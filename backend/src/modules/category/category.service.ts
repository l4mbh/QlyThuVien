import prisma from "../../config/db/db";
import { CreateCategoryDTO, CategoryEntity } from "../../types/category/category.entity";

export class CategoryService {
  async getAllCategories(): Promise<CategoryEntity[]> {
    return prisma.category.findMany();
  }

  async getCategoryById(id: string): Promise<CategoryEntity | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    return prisma.category.findFirst({ where: { name } });
  }

  async createCategory(data: CreateCategoryDTO): Promise<CategoryEntity> {
    return prisma.category.create({
      data: {
        name: data.name,
        code: data.code || "000",
      },
    });
  }

  async getOrCreateCategory(name: string, code: string): Promise<CategoryEntity> {
    const existing = await this.findByName(name);
    if (existing) return existing;
    return this.createCategory({ name, code });
  }
}

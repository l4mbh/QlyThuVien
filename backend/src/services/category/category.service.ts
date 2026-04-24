import { CategoryRepository } from "../../repositories/category/category.repository";
import { CategoryEntity, CreateCategoryDTO, UpdateCategoryDTO, CategoryFilterDTO } from "../../types/category/category.entity";
import { ErrorCode } from "@shared/constants/error-codes";
import { PaginatedData } from "../../types/shared/response.type";
import { AppError } from "../../utils/app-error";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAllCategories(filter: CategoryFilterDTO = {}): Promise<PaginatedData<CategoryEntity>> {
    return this.categoryRepository.findAll(filter);
  }

  async getCategoryById(id: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findById(id);
  }

  async createCategory(data: CreateCategoryDTO): Promise<CategoryEntity> {
    const existing = await this.categoryRepository.findByName(data.name);

    if (existing) {
      throw new AppError(ErrorCode.CATEGORY_ALREADY_EXISTS, "Category already exists");
    }

    return this.categoryRepository.create(data);
  }

  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, "Category not found");
    }

    if (data.name) {
      const existing = await this.categoryRepository.findByNameExcludeId(data.name, id);
      if (existing) {
        throw new AppError(ErrorCode.CATEGORY_ALREADY_EXISTS, "Category name already exists");
      }
    }

    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findByIdWithCount(id);

    if (!category) {
      throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, "Category not found");
    }

    if (category._count.books > 0) {
      throw new AppError(ErrorCode.CATEGORY_HAS_BOOKS, "Cannot delete category because it contains books");
    }

    await this.categoryRepository.delete(id);
  }

  async deleteCategories(ids: string[]): Promise<void> {
    const categories = await this.categoryRepository.findByIdsWithCount(ids);

    if (categories.length === 0) {
      throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, "Categories not found");
    }

    const categoriesWithBooks = categories.filter(c => c._count.books > 0);
    if (categoriesWithBooks.length > 0) {
      const names = categoriesWithBooks.map(c => c.name).join(", ");
      throw new AppError(ErrorCode.CATEGORY_HAS_BOOKS, `Cannot delete categories [${names}] because they contain books`);
    }

    await this.categoryRepository.deleteMany(ids);
  }

  async getOrCreateCategory(name: string, code: string): Promise<CategoryEntity> {
    const existing = await this.categoryRepository.findByName(name);
    if (existing) return existing;

    return this.createCategory({ name, code });
  }
}

import { CategoryRepository } from "../../repositories/category/category.repository";
import { CategoryEntity, CreateCategoryDTO, UpdateCategoryDTO, CategoryFilterDTO } from "../../types/category/category.entity";
import { ErrorCode } from "../../constants/errors/error.enum";
import { PaginatedData } from "../../types/shared/response.type";

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
      const error: any = new Error("Category already exists");
      error.errorCode = ErrorCode.CATEGORY_ALREADY_EXISTS;
      throw error;
    }

    return this.categoryRepository.create(data);
  }

  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      const error: any = new Error("Category not found");
      error.errorCode = ErrorCode.CATEGORY_NOT_FOUND;
      throw error;
    }

    if (data.name) {
      const existing = await this.categoryRepository.findByNameExcludeId(data.name, id);
      if (existing) {
        const error: any = new Error("Category name already exists");
        error.errorCode = ErrorCode.CATEGORY_ALREADY_EXISTS;
        throw error;
      }
    }

    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findByIdWithCount(id);

    if (!category) {
      const error: any = new Error("Category not found");
      error.errorCode = ErrorCode.CATEGORY_NOT_FOUND;
      throw error;
    }

    if (category._count.books > 0) {
      const error: any = new Error("Cannot delete category because it contains books");
      error.errorCode = ErrorCode.CATEGORY_HAS_BOOKS;
      throw error;
    }

    await this.categoryRepository.delete(id);
  }

  async deleteCategories(ids: string[]): Promise<void> {
    const categories = await this.categoryRepository.findByIdsWithCount(ids);

    if (categories.length === 0) {
      const error: any = new Error("Categories not found");
      error.errorCode = ErrorCode.CATEGORY_NOT_FOUND;
      throw error;
    }

    const categoriesWithBooks = categories.filter(c => c._count.books > 0);
    if (categoriesWithBooks.length > 0) {
      const names = categoriesWithBooks.map(c => c.name).join(", ");
      const error: any = new Error(`Cannot delete categories [${names}] because they contain books`);
      error.errorCode = ErrorCode.CATEGORY_HAS_BOOKS;
      throw error;
    }

    await this.categoryRepository.deleteMany(ids);
  }

  async getOrCreateCategory(name: string, code: string): Promise<CategoryEntity> {
    const existing = await this.categoryRepository.findByName(name);
    if (existing) return existing;

    return this.createCategory({ name, code });
  }
}

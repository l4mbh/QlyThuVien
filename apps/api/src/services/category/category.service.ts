import { CategoryRepository } from "../../repositories/category/category.repository";
import { CategoryEntity, CreateCategoryDTO, UpdateCategoryDTO, CategoryFilterDTO } from "../../types/category/category.entity";
import { ErrorCode, AuditAction, AuditEntityType, ErrorMessage } from "@qltv/shared";
import { PaginatedData } from "@qltv/shared";
import { AppError } from "../../utils/app-error";
import { auditService } from "../audit/audit.service";

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

  async createCategory(data: CreateCategoryDTO, userId: string): Promise<CategoryEntity> {
    const existing = await this.categoryRepository.findByName(data.name);

    if (existing) {
      throw new AppError(ErrorCode.CATEGORY_ALREADY_EXISTS, ErrorMessage.CATEGORY_ALREADY_EXISTS);
    }

    const category = await this.categoryRepository.create(data);

    // Log Event
    await auditService.logEvent({
      action: AuditAction.CREATE_CATEGORY,
      entityType: AuditEntityType.CATEGORY,
      entityId: category.id,
      userId,
      metadata: { name: category.name, code: category.code }
    });

    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryDTO, userId: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, ErrorMessage.CATEGORY_NOT_FOUND);
    }

    if (data.name) {
      const existing = await this.categoryRepository.findByNameExcludeId(data.name, id);
      if (existing) {
        throw new AppError(ErrorCode.CATEGORY_ALREADY_EXISTS, ErrorMessage.CATEGORY_ALREADY_EXISTS);
      }
    }

    const updatedCategory = await this.categoryRepository.update(id, data);

    // Log Event
    await auditService.logEvent({
      action: AuditAction.UPDATE_CATEGORY,
      entityType: AuditEntityType.CATEGORY,
      entityId: updatedCategory.id,
      userId,
      metadata: { name: updatedCategory.name, changes: data }
    });

    return updatedCategory;
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const category = await this.categoryRepository.findByIdWithCount(id);

    if (!category) {
      throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, ErrorMessage.CATEGORY_NOT_FOUND);
    }

    if (category._count.books > 0) {
      throw new AppError(ErrorCode.CATEGORY_HAS_BOOKS, ErrorMessage.CATEGORY_HAS_BOOKS);
    }

    await this.categoryRepository.delete(id);

    // Log Event
    await auditService.logEvent({
      action: AuditAction.DELETE_CATEGORY,
      entityType: AuditEntityType.CATEGORY,
      entityId: id,
      userId,
      metadata: { name: category.name }
    });
  }

  async deleteCategories(ids: string[], userId: string): Promise<void> {
    const categories = await this.categoryRepository.findByIdsWithCount(ids);

    if (categories.length === 0) {
      throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, ErrorMessage.CATEGORY_NOT_FOUND);
    }

    const categoriesWithBooks = categories.filter(c => c._count.books > 0);
    if (categoriesWithBooks.length > 0) {
      const names = categoriesWithBooks.map(c => c.name).join(", ");
      throw new AppError(ErrorCode.CATEGORY_HAS_BOOKS, `Cannot delete categories [${names}] because they contain books`);
    }

    await this.categoryRepository.deleteMany(ids);

    // Log Event for each
    for (const category of categories) {
      await auditService.logEvent({
        action: AuditAction.DELETE_CATEGORY,
        entityType: AuditEntityType.CATEGORY,
        entityId: category.id,
        userId,
        metadata: { name: category.name, bulk: true }
      });
    }
  }

  async getOrCreateCategory(name: string, code: string, userId: string): Promise<CategoryEntity> {
    const existing = await this.categoryRepository.findByName(name);
    if (existing) return existing;

    return this.createCategory({ name, code }, userId);
  }
}

export const categoryService = new CategoryService();


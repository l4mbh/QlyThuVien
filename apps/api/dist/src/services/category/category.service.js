"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_repository_1 = require("../../repositories/category/category.repository");
const shared_1 = require("@qltv/shared");
const app_error_1 = require("../../utils/app-error");
class CategoryService {
    constructor() {
        this.categoryRepository = new category_repository_1.CategoryRepository();
    }
    async getAllCategories(filter = {}) {
        return this.categoryRepository.findAll(filter);
    }
    async getCategoryById(id) {
        return this.categoryRepository.findById(id);
    }
    async createCategory(data) {
        const existing = await this.categoryRepository.findByName(data.name);
        if (existing) {
            throw new app_error_1.AppError(shared_1.ErrorCode.CATEGORY_ALREADY_EXISTS, "Category already exists");
        }
        return this.categoryRepository.create(data);
    }
    async updateCategory(id, data) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new app_error_1.AppError(shared_1.ErrorCode.CATEGORY_NOT_FOUND, "Category not found");
        }
        if (data.name) {
            const existing = await this.categoryRepository.findByNameExcludeId(data.name, id);
            if (existing) {
                throw new app_error_1.AppError(shared_1.ErrorCode.CATEGORY_ALREADY_EXISTS, "Category name already exists");
            }
        }
        return this.categoryRepository.update(id, data);
    }
    async deleteCategory(id) {
        const category = await this.categoryRepository.findByIdWithCount(id);
        if (!category) {
            throw new app_error_1.AppError(shared_1.ErrorCode.CATEGORY_NOT_FOUND, "Category not found");
        }
        if (category._count.books > 0) {
            throw new app_error_1.AppError(shared_1.ErrorCode.CATEGORY_HAS_BOOKS, "Cannot delete category because it contains books");
        }
        await this.categoryRepository.delete(id);
    }
    async deleteCategories(ids) {
        const categories = await this.categoryRepository.findByIdsWithCount(ids);
        if (categories.length === 0) {
            throw new app_error_1.AppError(shared_1.ErrorCode.CATEGORY_NOT_FOUND, "Categories not found");
        }
        const categoriesWithBooks = categories.filter(c => c._count.books > 0);
        if (categoriesWithBooks.length > 0) {
            const names = categoriesWithBooks.map(c => c.name).join(", ");
            throw new app_error_1.AppError(shared_1.ErrorCode.CATEGORY_HAS_BOOKS, `Cannot delete categories [${names}] because they contain books`);
        }
        await this.categoryRepository.deleteMany(ids);
    }
    async getOrCreateCategory(name, code) {
        const existing = await this.categoryRepository.findByName(name);
        if (existing)
            return existing;
        return this.createCategory({ name, code });
    }
}
exports.CategoryService = CategoryService;

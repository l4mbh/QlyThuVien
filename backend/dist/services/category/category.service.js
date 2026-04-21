"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_repository_1 = require("../../repositories/category/category.repository");
const error_enum_1 = require("../../constants/errors/error.enum");
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
            const error = new Error("Category already exists");
            error.errorCode = error_enum_1.ErrorCode.CATEGORY_ALREADY_EXISTS;
            throw error;
        }
        return this.categoryRepository.create(data);
    }
    async updateCategory(id, data) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            const error = new Error("Category not found");
            error.errorCode = error_enum_1.ErrorCode.CATEGORY_NOT_FOUND;
            throw error;
        }
        if (data.name) {
            const existing = await this.categoryRepository.findByNameExcludeId(data.name, id);
            if (existing) {
                const error = new Error("Category name already exists");
                error.errorCode = error_enum_1.ErrorCode.CATEGORY_ALREADY_EXISTS;
                throw error;
            }
        }
        return this.categoryRepository.update(id, data);
    }
    async deleteCategory(id) {
        const category = await this.categoryRepository.findByIdWithCount(id);
        if (!category) {
            const error = new Error("Category not found");
            error.errorCode = error_enum_1.ErrorCode.CATEGORY_NOT_FOUND;
            throw error;
        }
        if (category._count.books > 0) {
            const error = new Error("Cannot delete category because it contains books");
            error.errorCode = error_enum_1.ErrorCode.CATEGORY_HAS_BOOKS;
            throw error;
        }
        await this.categoryRepository.delete(id);
    }
    async deleteCategories(ids) {
        const categories = await this.categoryRepository.findByIdsWithCount(ids);
        if (categories.length === 0) {
            const error = new Error("Categories not found");
            error.errorCode = error_enum_1.ErrorCode.CATEGORY_NOT_FOUND;
            throw error;
        }
        const categoriesWithBooks = categories.filter(c => c._count.books > 0);
        if (categoriesWithBooks.length > 0) {
            const names = categoriesWithBooks.map(c => c.name).join(", ");
            const error = new Error(`Cannot delete categories [${names}] because they contain books`);
            error.errorCode = error_enum_1.ErrorCode.CATEGORY_HAS_BOOKS;
            throw error;
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

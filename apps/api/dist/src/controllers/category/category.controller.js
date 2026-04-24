"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../../services/category/category.service");
const shared_1 = require("@qltv/shared");
const category_schema_1 = require("../../schemas/category/category.schema");
const app_error_1 = require("../../utils/app-error");
class CategoryController {
    constructor() {
        this.getAllCategories = async (req, res, next) => {
            try {
                const { search, page, limit } = req.query;
                const categories = await this.categoryService.getAllCategories({
                    search: search,
                    page: page ? parseInt(page) : undefined,
                    limit: limit ? parseInt(limit) : undefined,
                });
                res.json({ data: categories, code: shared_1.ErrorCode.SUCCESS });
            }
            catch (error) {
                next(error);
            }
        };
        this.createCategory = async (req, res, next) => {
            try {
                const validation = category_schema_1.createCategorySchema.safeParse(req.body);
                if (!validation.success) {
                    throw new app_error_1.AppError(shared_1.ErrorCode.VALIDATION_ERROR, validation.error.issues[0].message);
                }
                const category = await this.categoryService.createCategory(validation.data);
                res.json({ data: category, code: shared_1.ErrorCode.SUCCESS });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateCategory = async (req, res, next) => {
            try {
                const id = req.params.id;
                const validation = category_schema_1.updateCategorySchema.safeParse(req.body);
                if (!validation.success) {
                    throw new app_error_1.AppError(shared_1.ErrorCode.VALIDATION_ERROR, validation.error.issues[0].message);
                }
                const category = await this.categoryService.updateCategory(id, validation.data);
                res.json({ data: category, code: shared_1.ErrorCode.SUCCESS });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteCategory = async (req, res, next) => {
            try {
                const id = req.params.id;
                await this.categoryService.deleteCategory(id);
                res.json({ data: { success: true }, code: shared_1.ErrorCode.SUCCESS });
            }
            catch (error) {
                next(error);
            }
        };
        this.bulkDelete = async (req, res, next) => {
            try {
                const { ids } = req.body;
                if (!ids || !Array.isArray(ids) || ids.length === 0) {
                    throw new app_error_1.AppError(shared_1.ErrorCode.VALIDATION_ERROR, "Invalid or empty IDs list");
                }
                await this.categoryService.deleteCategories(ids);
                res.json({ data: { success: true }, code: shared_1.ErrorCode.SUCCESS });
            }
            catch (error) {
                next(error);
            }
        };
        this.categoryService = new category_service_1.CategoryService();
    }
}
exports.CategoryController = CategoryController;

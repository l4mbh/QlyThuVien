"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../../services/category/category.service");
const error_enum_1 = require("../../constants/errors/error.enum");
const error_messages_1 = require("../../constants/errors/error.messages");
const category_schema_1 = require("../../schemas/category/category.schema");
class CategoryController {
    constructor() {
        this.getAllCategories = async (req, res) => {
            try {
                const { search, page, limit } = req.query;
                const categories = await this.categoryService.getAllCategories({
                    search: search,
                    page: page ? parseInt(page) : undefined,
                    limit: limit ? parseInt(limit) : undefined,
                });
                res.json({ data: categories, code: error_enum_1.ErrorCode.SUCCESS });
            }
            catch (error) {
                res.json({
                    error: { msg: error.message || error_messages_1.ErrorMessages[error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR] },
                    code: error.errorCode || error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR,
                });
            }
        };
        this.createCategory = async (req, res) => {
            try {
                const validation = category_schema_1.createCategorySchema.safeParse(req.body);
                if (!validation.success) {
                    return res.json({
                        error: { msg: validation.error.issues[0].message },
                        code: error_enum_1.ErrorCode.VALIDATION_ERROR,
                    });
                }
                const category = await this.categoryService.createCategory(validation.data);
                res.json({ data: category, code: error_enum_1.ErrorCode.SUCCESS });
            }
            catch (error) {
                res.json({
                    error: { msg: error.message || error_messages_1.ErrorMessages[error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR] },
                    code: error.errorCode || error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR,
                });
            }
        };
        this.updateCategory = async (req, res) => {
            try {
                const id = req.params.id;
                const validation = category_schema_1.updateCategorySchema.safeParse(req.body);
                if (!validation.success) {
                    return res.json({
                        error: { msg: validation.error.issues[0].message },
                        code: error_enum_1.ErrorCode.VALIDATION_ERROR,
                    });
                }
                const category = await this.categoryService.updateCategory(id, validation.data);
                res.json({ data: category, code: error_enum_1.ErrorCode.SUCCESS });
            }
            catch (error) {
                res.json({
                    error: { msg: error.message || error_messages_1.ErrorMessages[error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR] },
                    code: error.errorCode || error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR,
                });
            }
        };
        this.deleteCategory = async (req, res) => {
            try {
                const id = req.params.id;
                await this.categoryService.deleteCategory(id);
                res.json({ data: { success: true }, code: error_enum_1.ErrorCode.SUCCESS });
            }
            catch (error) {
                res.json({
                    error: { msg: error.message || error_messages_1.ErrorMessages[error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR] },
                    code: error.errorCode || error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR,
                });
            }
        };
        this.bulkDelete = async (req, res) => {
            try {
                const { ids } = req.body;
                if (!ids || !Array.isArray(ids) || ids.length === 0) {
                    return res.json({
                        error: { msg: "Invalid or empty IDs list" },
                        code: error_enum_1.ErrorCode.VALIDATION_ERROR,
                    });
                }
                await this.categoryService.deleteCategories(ids);
                res.json({ data: { success: true }, code: error_enum_1.ErrorCode.SUCCESS });
            }
            catch (error) {
                res.json({
                    error: { msg: error.message || error_messages_1.ErrorMessages[error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR] },
                    code: error.errorCode || error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR,
                });
            }
        };
        this.categoryService = new category_service_1.CategoryService();
    }
}
exports.CategoryController = CategoryController;

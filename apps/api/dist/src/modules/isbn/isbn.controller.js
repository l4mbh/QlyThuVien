"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsbnController = void 0;
const isbn_service_1 = require("./isbn.service");
const mapCategory_1 = require("../../utils/mapCategory");
const generateCallNumber_1 = require("../../utils/generateCallNumber");
const shared_1 = require("@qltv/shared");
const app_error_1 = require("../../utils/app-error");
class IsbnController {
    constructor() {
        this.fetchBookByIsbn = async (req, res, next) => {
            try {
                const { isbn } = req.body;
                if (!isbn) {
                    throw new app_error_1.AppError(shared_1.ErrorCode.VALIDATION_ERROR, "ISBN is required");
                }
                const bookInfo = await this.isbnService.fetchBookByIsbn(isbn);
                // Auto-suggest category
                const suggestedCategory = (0, mapCategory_1.mapCategory)(bookInfo.category);
                // Auto-generate call number (mocking for suggest)
                const callNumber = await (0, generateCallNumber_1.generateCallNumber)(bookInfo.author, bookInfo.publishedYear, suggestedCategory.code);
                res.json({
                    data: {
                        ...bookInfo,
                        suggestedCategory,
                        callNumber
                    },
                    code: shared_1.ErrorCode.SUCCESS
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.isbnService = new isbn_service_1.IsbnService();
    }
}
exports.IsbnController = IsbnController;

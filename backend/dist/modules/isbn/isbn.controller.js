"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsbnController = void 0;
const isbn_service_1 = require("./isbn.service");
const mapCategory_1 = require("../../utils/mapCategory");
const generateCallNumber_1 = require("../../utils/generateCallNumber");
const error_enum_1 = require("../../constants/errors/error.enum");
const error_messages_1 = require("../../constants/errors/error.messages");
class IsbnController {
    constructor() {
        this.fetchBookByIsbn = async (req, res) => {
            try {
                const { isbn } = req.body;
                if (!isbn) {
                    return res.json({
                        error: { msg: error_messages_1.ErrorMessages[error_enum_1.ErrorCode.VALIDATION_ERROR] },
                        code: error_enum_1.ErrorCode.VALIDATION_ERROR
                    });
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
                    code: 0
                });
            }
            catch (error) {
                res.json({
                    error: { msg: error.message || error_messages_1.ErrorMessages[error_enum_1.ErrorCode.ISBN_FETCH_FAILED] },
                    code: error.errorCode || error_enum_1.ErrorCode.ISBN_FETCH_FAILED
                });
            }
        };
        this.isbnService = new isbn_service_1.IsbnService();
    }
}
exports.IsbnController = IsbnController;

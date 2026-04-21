"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = void 0;
const error_enum_1 = require("./error.enum");
exports.ErrorMessages = {
    [error_enum_1.ErrorCode.SUCCESS]: "Operation successful",
    [error_enum_1.ErrorCode.UNAUTHORIZED]: "Unauthorized access",
    [error_enum_1.ErrorCode.INVALID_CREDENTIALS]: "Invalid email or password",
    [error_enum_1.ErrorCode.TOKEN_INVALID]: "Invalid token",
    [error_enum_1.ErrorCode.TOKEN_EXPIRED]: "Token has expired",
    [error_enum_1.ErrorCode.FORBIDDEN]: "Permission denied",
    [error_enum_1.ErrorCode.NOT_FOUND]: "Resource not found",
    [error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR]: "Internal server error",
    [error_enum_1.ErrorCode.VALIDATION_ERROR]: "Validation error",
    [error_enum_1.ErrorCode.USER_NOT_FOUND]: "User not found",
    [error_enum_1.ErrorCode.USER_ALREADY_EXISTS]: "User with this email already exists",
    [error_enum_1.ErrorCode.USER_BLOCKED]: "User is currently blocked",
    [error_enum_1.ErrorCode.USER_BORROW_LIMIT_EXCEEDED]: "User has reached the maximum borrow limit",
    [error_enum_1.ErrorCode.BOOK_NOT_FOUND]: "Book not found",
    [error_enum_1.ErrorCode.BOOK_NOT_AVAILABLE]: "Book is not available for borrowing",
    [error_enum_1.ErrorCode.BOOK_ALREADY_EXISTS]: "Book with this ISBN already exists",
    [error_enum_1.ErrorCode.BORROW_RECORD_NOT_FOUND]: "Borrow record not found",
    [error_enum_1.ErrorCode.INVALID_BORROW_OPERATION]: "Invalid borrow operation",
    [error_enum_1.ErrorCode.CATEGORY_NOT_FOUND]: "Category not found",
    [error_enum_1.ErrorCode.CATEGORY_ALREADY_EXISTS]: "Category with this name already exists",
    [error_enum_1.ErrorCode.CATEGORY_HAS_BOOKS]: "Cannot delete category because it contains books",
    [error_enum_1.ErrorCode.ISBN_NOT_FOUND]: "ISBN not found in external sources",
    [error_enum_1.ErrorCode.ISBN_FETCH_FAILED]: "Failed to fetch book data from external APIs",
};

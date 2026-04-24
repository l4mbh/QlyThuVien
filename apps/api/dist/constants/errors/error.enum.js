"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["SUCCESS"] = 0] = "SUCCESS";
    // Auth & General
    ErrorCode[ErrorCode["UNAUTHORIZED"] = 401001] = "UNAUTHORIZED";
    ErrorCode[ErrorCode["INVALID_CREDENTIALS"] = 401002] = "INVALID_CREDENTIALS";
    ErrorCode[ErrorCode["TOKEN_INVALID"] = 401003] = "TOKEN_INVALID";
    ErrorCode[ErrorCode["TOKEN_EXPIRED"] = 401004] = "TOKEN_EXPIRED";
    ErrorCode[ErrorCode["FORBIDDEN"] = 403001] = "FORBIDDEN";
    ErrorCode[ErrorCode["NOT_FOUND"] = 404001] = "NOT_FOUND";
    ErrorCode[ErrorCode["INTERNAL_SERVER_ERROR"] = 500001] = "INTERNAL_SERVER_ERROR";
    ErrorCode[ErrorCode["VALIDATION_ERROR"] = 400001] = "VALIDATION_ERROR";
    // User
    ErrorCode[ErrorCode["USER_NOT_FOUND"] = 404101] = "USER_NOT_FOUND";
    ErrorCode[ErrorCode["USER_ALREADY_EXISTS"] = 400101] = "USER_ALREADY_EXISTS";
    ErrorCode[ErrorCode["USER_BLOCKED"] = 403101] = "USER_BLOCKED";
    ErrorCode[ErrorCode["USER_BORROW_LIMIT_EXCEEDED"] = 400102] = "USER_BORROW_LIMIT_EXCEEDED";
    // Book
    ErrorCode[ErrorCode["BOOK_NOT_FOUND"] = 404201] = "BOOK_NOT_FOUND";
    ErrorCode[ErrorCode["BOOK_NOT_AVAILABLE"] = 400201] = "BOOK_NOT_AVAILABLE";
    ErrorCode[ErrorCode["BOOK_ALREADY_EXISTS"] = 400202] = "BOOK_ALREADY_EXISTS";
    // Borrow
    ErrorCode[ErrorCode["BORROW_RECORD_NOT_FOUND"] = 404301] = "BORROW_RECORD_NOT_FOUND";
    ErrorCode[ErrorCode["INVALID_BORROW_OPERATION"] = 400301] = "INVALID_BORROW_OPERATION";
    // Category
    ErrorCode[ErrorCode["CATEGORY_NOT_FOUND"] = 404401] = "CATEGORY_NOT_FOUND";
    ErrorCode[ErrorCode["CATEGORY_ALREADY_EXISTS"] = 400401] = "CATEGORY_ALREADY_EXISTS";
    ErrorCode[ErrorCode["CATEGORY_HAS_BOOKS"] = 400402] = "CATEGORY_HAS_BOOKS";
    // ISBN
    ErrorCode[ErrorCode["ISBN_NOT_FOUND"] = 404501] = "ISBN_NOT_FOUND";
    ErrorCode[ErrorCode["ISBN_FETCH_FAILED"] = 400501] = "ISBN_FETCH_FAILED";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));

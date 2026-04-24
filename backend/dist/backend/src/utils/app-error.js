"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
/**
 * Custom Error class cho ứng dụng.
 * Cho phép throw lỗi kèm theo mã lỗi (string code) từ shared constants.
 */
class AppError extends Error {
    constructor(code, message, isOperational = true) {
        super(message);
        this.code = code;
        this.isOperational = isOperational;
        // Đảm bảo prototype chain đúng (quan trọng khi dùng instanceof)
        Object.setPrototypeOf(this, AppError.prototype);
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;

import { ErrorCode } from "@shared/constants/error-codes";

/**
 * Custom Error class cho ứng dụng.
 * Cho phép throw lỗi kèm theo mã lỗi (string code) từ shared constants.
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(code: string, message?: string, isOperational = true) {
    super(message);
    this.code = code;
    this.isOperational = isOperational;

    // Đảm bảo prototype chain đúng (quan trọng khi dùng instanceof)
    Object.setPrototypeOf(this, AppError.prototype);
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

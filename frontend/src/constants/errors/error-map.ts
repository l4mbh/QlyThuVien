import { ErrorCode } from "@shared/constants/error-codes";

/**
 * Mapping from ErrorCode (String) to User-friendly English messages.
 * This is the single source of truth for error messages on the Frontend.
 */
export const ErrorMessages: Record<string, string> = {
  // General
  [ErrorCode.SUCCESS]: "Operation successful",
  [ErrorCode.INTERNAL_SERVER_ERROR]: "System error, please try again later",
  [ErrorCode.VALIDATION_ERROR]: "Invalid data provided",
  [ErrorCode.UNAUTHORIZED]: "Please login to continue",
  [ErrorCode.FORBIDDEN]: "You do not have permission to perform this action",
  [ErrorCode.NOT_FOUND]: "Requested data not found",

  // Auth
  [ErrorCode.INVALID_CREDENTIALS]: "Incorrect email or password",
  [ErrorCode.TOKEN_EXPIRED]: "Session expired, please login again",
  [ErrorCode.TOKEN_INVALID]: "Invalid session token",

  // User
  [ErrorCode.USER_NOT_FOUND]: "User not found",
  [ErrorCode.USER_ALREADY_EXISTS]: "Email is already registered",
  [ErrorCode.USER_BLOCKED]: "Your account has been blocked",

  // Book
  [ErrorCode.BOOK_NOT_FOUND]: "Book not found",
  [ErrorCode.BOOK_ALREADY_EXISTS]: "This ISBN already exists in the system",
  [ErrorCode.OUT_OF_STOCK]: "No copies available for borrowing",

  // Borrow
  [ErrorCode.BORROW_LIMIT_EXCEEDED]: "You have exceeded the borrowing limit",
  [ErrorCode.HAS_OVERDUE_BOOKS]: "You have overdue books, please return them before borrowing new ones",
  [ErrorCode.BORROW_RECORD_NOT_FOUND]: "Borrow record not found",
  [ErrorCode.INVALID_BORROW_OPERATION]: "Invalid borrow operation",

  // Category
  [ErrorCode.CATEGORY_NOT_FOUND]: "Category not found",
  [ErrorCode.CATEGORY_ALREADY_EXISTS]: "Category name already exists",
  [ErrorCode.CATEGORY_HAS_BOOKS]: "Cannot delete category containing books",
};

/**
 * Get error message based on error code.
 * Falls back to a default message if the code is not in the map.
 */
export const getErrorMessage = (code: string | number): string => {
  return ErrorMessages[code as string] || "An unexpected error occurred, please try again";
};

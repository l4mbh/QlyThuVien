import { ErrorCode } from "./error.enum";

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.SUCCESS]: "Operation successful",
  
  [ErrorCode.UNAUTHORIZED]: "Unauthorized access",
  [ErrorCode.INVALID_CREDENTIALS]: "Invalid email or password",
  [ErrorCode.TOKEN_INVALID]: "Invalid token",
  [ErrorCode.TOKEN_EXPIRED]: "Token has expired",
  [ErrorCode.FORBIDDEN]: "Permission denied",
  [ErrorCode.NOT_FOUND]: "Resource not found",
  [ErrorCode.INTERNAL_SERVER_ERROR]: "Internal server error",
  [ErrorCode.VALIDATION_ERROR]: "Validation error",

  [ErrorCode.USER_NOT_FOUND]: "User not found",
  [ErrorCode.USER_ALREADY_EXISTS]: "User with this email already exists",
  [ErrorCode.USER_BLOCKED]: "User is currently blocked",
  [ErrorCode.USER_BORROW_LIMIT_EXCEEDED]: "User has reached the maximum borrow limit",

  [ErrorCode.BOOK_NOT_FOUND]: "Book not found",
  [ErrorCode.BOOK_NOT_AVAILABLE]: "Book is not available for borrowing",
  [ErrorCode.BOOK_ALREADY_EXISTS]: "Book with this ISBN already exists",

  [ErrorCode.BORROW_RECORD_NOT_FOUND]: "Borrow record not found",
  [ErrorCode.INVALID_BORROW_OPERATION]: "Invalid borrow operation",

  [ErrorCode.CATEGORY_NOT_FOUND]: "Category not found",
  [ErrorCode.CATEGORY_ALREADY_EXISTS]: "Category with this name already exists",
  [ErrorCode.CATEGORY_HAS_BOOKS]: "Cannot delete category because it contains books",

  [ErrorCode.ISBN_NOT_FOUND]: "ISBN not found in external sources",
  [ErrorCode.ISBN_FETCH_FAILED]: "Failed to fetch book data from external APIs",
};

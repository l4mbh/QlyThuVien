/**
 * Centralized messages for the entire system.
 * Values matched with apps/web/src/constants/errors/error-map.ts for consistency.
 */

export const ErrorMessage = {
  // General
  SUCCESS: "Operation successful",
  INTERNAL_SERVER_ERROR: "System error, please try again later",
  VALIDATION_ERROR: "Invalid data provided",
  UNAUTHORIZED: "Please login to continue",
  FORBIDDEN: "You do not have permission to perform this action",
  NOT_FOUND: "Requested data not found",
  MAINTENANCE_MODE: "System is under maintenance. Please come back later.",

  // Auth
  INVALID_CREDENTIALS: "Incorrect email or password",
  TOKEN_EXPIRED: "Session expired, please login again",
  TOKEN_INVALID: "Invalid session token",

  // User
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "Email is already registered",
  USER_BLOCKED: "Your account has been blocked",

  // Book
  BOOK_NOT_FOUND: "Book not found",
  BOOK_ALREADY_EXISTS: "This ISBN already exists in the system",
  OUT_OF_STOCK: "No copies available for borrowing",

  // Borrow
  BORROW_LIMIT_EXCEEDED: "You have exceeded the borrowing limit",
  HAS_OVERDUE_BOOKS: "You have overdue books, please return them before borrowing new ones",
  BORROW_RECORD_NOT_FOUND: "Borrow record not found",
  INVALID_BORROW_OPERATION: "Invalid borrow operation",

  // Category
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_ALREADY_EXISTS: "Category name already exists",
  CATEGORY_HAS_BOOKS: "Cannot delete category containing books",

  // Reservation
  RESERVATION_NOT_FOUND: "Reservation record not found",
  ALREADY_RESERVED: "You already have an active reservation for this book",
  INVALID_RESERVATION_STATUS: "Invalid reservation status for this operation",
  RESERVATION_LIMIT_EXCEEDED: "You have reached your maximum reservation limit",

  // Specific Validation
  ISBN_REQUIRED: "ISBN is required",
  PHONE_REQUIRED: "Phone number is required",
  INVALID_ID_LIST: "Invalid or empty IDs list provided",
  INSUFFICIENT_QUANTITY: "Insufficient available quantity",
  QUANTITY_LIMIT_VIOLATION: "Total quantity cannot be less than current borrowed count",
  API_REQUEST_FAILED: "External API request failed",
  NOT_FOUND_ON_SOURCE: "Resource not found on external source",
} as const;

export const NotificationMessage = {
  // Titles
  BORROW_SUCCESS_TITLE: "Borrowing Successful",
  RETURN_SUCCESS_TITLE: "Book Returned",
  OVERDUE_TITLE: "Book Overdue Alert!",
  RESERVATION_READY_TITLE: "Your reserved book is ready!",
  QUEUE_UPDATE_TITLE: "Queue Status Update",
  SYSTEM_TITLE: "System Notification",

  // Templates
  BORROW_SUCCESS_BODY: (bookTitle: string, dueDate: string) => `You have successfully borrowed "${bookTitle}". Please return it by ${dueDate}.`,
  RETURN_SUCCESS_BODY: (bookTitle: string) => `You have successfully returned "${bookTitle}". Thank you!`,
  OVERDUE_BODY: (bookTitle: string, dueDate: string) => `The book "${bookTitle}" was due on ${dueDate}. Please return it to avoid fines.`,
  RESERVATION_READY_BODY: (bookTitle: string, date: string) => `The book "${bookTitle}" you reserved is ready. Please collect it by ${date}.`,
  QUEUE_UPDATE_BODY: (bookTitle: string, pos: number) => `Your position in the queue for "${bookTitle}" is now #${pos}.`,
} as const;

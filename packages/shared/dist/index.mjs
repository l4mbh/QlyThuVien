// src/constants/error-codes.ts
var ErrorCode = {
  // General
  SUCCESS: "SUCCESS",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  // Auth
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  // User
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  USER_BLOCKED: "USER_BLOCKED",
  // Book
  BOOK_NOT_FOUND: "BOOK_NOT_FOUND",
  BOOK_ALREADY_EXISTS: "BOOK_ALREADY_EXISTS",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  // Borrow
  BORROW_LIMIT_EXCEEDED: "BORROW_LIMIT_EXCEEDED",
  HAS_OVERDUE_BOOKS: "HAS_OVERDUE_BOOKS",
  BORROW_RECORD_NOT_FOUND: "BORROW_RECORD_NOT_FOUND",
  INVALID_BORROW_OPERATION: "INVALID_BORROW_OPERATION",
  // Category
  CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND",
  CATEGORY_ALREADY_EXISTS: "CATEGORY_ALREADY_EXISTS",
  CATEGORY_HAS_BOOKS: "CATEGORY_HAS_BOOKS"
};

// src/rules/borrow.rules.ts
var isUserActive = ({ user }) => {
  if (user.status !== "ACTIVE") {
    return { ok: false, code: ErrorCode.USER_BLOCKED };
  }
  return { ok: true };
};
var withinLimit = ({ user, books }) => {
  if (user.currentBorrowCount + books.length > user.borrowLimit) {
    return {
      ok: false,
      code: ErrorCode.BORROW_LIMIT_EXCEEDED,
      details: {
        limit: user.borrowLimit,
        current: user.currentBorrowCount,
        requested: books.length
      }
    };
  }
  return { ok: true };
};
var booksAvailable = ({ books }) => {
  const unavailableBooks = books.filter((b) => b.availableQuantity <= 0);
  if (unavailableBooks.length > 0) {
    return {
      ok: false,
      code: ErrorCode.OUT_OF_STOCK,
      details: {
        books: unavailableBooks.map((b) => b.title)
      }
    };
  }
  return { ok: true };
};
var noOverdue = ({ hasOverdueBooks }) => {
  if (hasOverdueBooks) {
    return { ok: false, code: ErrorCode.HAS_OVERDUE_BOOKS };
  }
  return { ok: true };
};
var borrowRuleSet = [
  isUserActive,
  noOverdue,
  withinLimit,
  booksAvailable
];

// src/engine/rule-runner.ts
var runRules = (rules, input) => {
  for (const rule of rules) {
    const result = rule(input);
    if (!result.ok) {
      return result;
    }
  }
  return { ok: true };
};
export {
  ErrorCode,
  booksAvailable,
  borrowRuleSet,
  isUserActive,
  noOverdue,
  runRules,
  withinLimit
};

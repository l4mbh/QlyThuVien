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

// src/constants/audit.ts
var AuditAction = /* @__PURE__ */ ((AuditAction2) => {
  AuditAction2["CREATE_BOOK"] = "CREATE_BOOK";
  AuditAction2["UPDATE_BOOK"] = "UPDATE_BOOK";
  AuditAction2["DELETE_BOOK"] = "DELETE_BOOK";
  AuditAction2["CREATE_CATEGORY"] = "CREATE_CATEGORY";
  AuditAction2["UPDATE_CATEGORY"] = "UPDATE_CATEGORY";
  AuditAction2["DELETE_CATEGORY"] = "DELETE_CATEGORY";
  AuditAction2["BORROW_CREATED"] = "BORROW_CREATED";
  AuditAction2["RETURN_COMPLETED"] = "RETURN_COMPLETED";
  AuditAction2["BORROW_OVERDUE"] = "BORROW_OVERDUE";
  AuditAction2["INVENTORY_ADJUSTED"] = "INVENTORY_ADJUSTED";
  AuditAction2["USER_CREATED"] = "USER_CREATED";
  AuditAction2["USER_UPDATED"] = "USER_UPDATED";
  AuditAction2["USER_BLOCKED"] = "USER_BLOCKED";
  return AuditAction2;
})(AuditAction || {});
var AuditEntityType = /* @__PURE__ */ ((AuditEntityType2) => {
  AuditEntityType2["BOOK"] = "BOOK";
  AuditEntityType2["USER"] = "USER";
  AuditEntityType2["BORROW"] = "BORROW";
  AuditEntityType2["CATEGORY"] = "CATEGORY";
  AuditEntityType2["SYSTEM"] = "SYSTEM";
  return AuditEntityType2;
})(AuditEntityType || {});

// src/constants/notification.ts
var NotificationType = /* @__PURE__ */ ((NotificationType2) => {
  NotificationType2["OVERDUE"] = "OVERDUE";
  NotificationType2["BORROW_SUCCESS"] = "BORROW_SUCCESS";
  NotificationType2["RETURN_SUCCESS"] = "RETURN_SUCCESS";
  NotificationType2["SYSTEM"] = "SYSTEM";
  NotificationType2["FINE_ASSIGNED"] = "FINE_ASSIGNED";
  return NotificationType2;
})(NotificationType || {});

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
  AuditAction,
  AuditEntityType,
  ErrorCode,
  NotificationType,
  booksAvailable,
  borrowRuleSet,
  isUserActive,
  noOverdue,
  runRules,
  withinLimit
};

import type { Rule } from "../types/rules";

import { ErrorCode } from "../constants/error-codes";

/**
 * Context required for evaluating Borrowing Rules.
 */
export interface BorrowContext {
  user: {
    id: string;
    status: string; // "ACTIVE" | "BLOCKED"
    currentBorrowCount: number;
    borrowLimit: number;
  };
  books: Array<{
    id: string;
    title: string;
    availableQuantity: number;
  }>;
  hasOverdueBooks?: boolean;
}

/**
 * Rule: User must be ACTIVE to borrow books.
 */
export const isUserActive: Rule<BorrowContext> = ({ user }) => {
  if (user.status !== "ACTIVE") {
    return { ok: false, code: ErrorCode.USER_BLOCKED };
  }
  return { ok: true };
};

/**
 * Rule: User cannot exceed their borrowing limit.
 */
export const withinLimit: Rule<BorrowContext> = ({ user, books }) => {
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

/**
 * Rule: All requested books must be available in stock.
 */
export const booksAvailable: Rule<BorrowContext> = ({ books }) => {
  const unavailableBooks = books.filter(b => b.availableQuantity <= 0);
  
  if (unavailableBooks.length > 0) {
    return { 
      ok: false, 
      code: ErrorCode.OUT_OF_STOCK,
      details: {
        books: unavailableBooks.map(b => b.title)
      }
    };
  }
  return { ok: true };
};

/**
 * Rule: User must not have any overdue books.
 */
export const noOverdue: Rule<BorrowContext> = ({ hasOverdueBooks }) => {
  if (hasOverdueBooks) {
    return { ok: false, code: ErrorCode.HAS_OVERDUE_BOOKS };
  }
  return { ok: true };
};

/**
 * Standard Borrow Rule Set.
 * Order matters: check user status first, then overdue, then limits, then stock.
 */
export const borrowRuleSet: Array<Rule<BorrowContext>> = [
  isUserActive,
  noOverdue,
  withinLimit,
  booksAvailable
];



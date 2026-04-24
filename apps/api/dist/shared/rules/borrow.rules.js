"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRuleSet = exports.noOverdue = exports.booksAvailable = exports.withinLimit = exports.isUserActive = void 0;
const error_codes_1 = require("../constants/error-codes");
/**
 * Rule: User must be ACTIVE to borrow books.
 */
const isUserActive = ({ user }) => {
    if (user.status !== "ACTIVE") {
        return { ok: false, code: error_codes_1.ErrorCode.USER_BLOCKED };
    }
    return { ok: true };
};
exports.isUserActive = isUserActive;
/**
 * Rule: User cannot exceed their borrowing limit.
 */
const withinLimit = ({ user, books }) => {
    if (user.currentBorrowCount + books.length > user.borrowLimit) {
        return {
            ok: false,
            code: error_codes_1.ErrorCode.BORROW_LIMIT_EXCEEDED,
            details: {
                limit: user.borrowLimit,
                current: user.currentBorrowCount,
                requested: books.length
            }
        };
    }
    return { ok: true };
};
exports.withinLimit = withinLimit;
/**
 * Rule: All requested books must be available in stock.
 */
const booksAvailable = ({ books }) => {
    const unavailableBooks = books.filter(b => b.availableQuantity <= 0);
    if (unavailableBooks.length > 0) {
        return {
            ok: false,
            code: error_codes_1.ErrorCode.OUT_OF_STOCK,
            details: {
                books: unavailableBooks.map(b => b.title)
            }
        };
    }
    return { ok: true };
};
exports.booksAvailable = booksAvailable;
/**
 * Rule: User must not have any overdue books.
 */
const noOverdue = ({ hasOverdueBooks }) => {
    if (hasOverdueBooks) {
        return { ok: false, code: error_codes_1.ErrorCode.HAS_OVERDUE_BOOKS };
    }
    return { ok: true };
};
exports.noOverdue = noOverdue;
/**
 * Standard Borrow Rule Set.
 * Order matters: check user status first, then overdue, then limits, then stock.
 */
exports.borrowRuleSet = [
    exports.isUserActive,
    exports.noOverdue,
    exports.withinLimit,
    exports.booksAvailable
];

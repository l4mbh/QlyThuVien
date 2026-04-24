/**
 * Standardized Error Codes list (String-based).
 * Facilitates mapping and localization on the Frontend.
 */
declare const ErrorCode: {
    readonly SUCCESS: "SUCCESS";
    readonly INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly TOKEN_INVALID: "TOKEN_INVALID";
    readonly USER_NOT_FOUND: "USER_NOT_FOUND";
    readonly USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS";
    readonly USER_BLOCKED: "USER_BLOCKED";
    readonly BOOK_NOT_FOUND: "BOOK_NOT_FOUND";
    readonly BOOK_ALREADY_EXISTS: "BOOK_ALREADY_EXISTS";
    readonly OUT_OF_STOCK: "OUT_OF_STOCK";
    readonly BORROW_LIMIT_EXCEEDED: "BORROW_LIMIT_EXCEEDED";
    readonly HAS_OVERDUE_BOOKS: "HAS_OVERDUE_BOOKS";
    readonly BORROW_RECORD_NOT_FOUND: "BORROW_RECORD_NOT_FOUND";
    readonly INVALID_BORROW_OPERATION: "INVALID_BORROW_OPERATION";
    readonly CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND";
    readonly CATEGORY_ALREADY_EXISTS: "CATEGORY_ALREADY_EXISTS";
    readonly CATEGORY_HAS_BOOKS: "CATEGORY_HAS_BOOKS";
};
type ErrorCodeType = keyof typeof ErrorCode;

/**
 * Standardized actions for system audit logs
 */
declare enum AuditAction {
    CREATE_BOOK = "CREATE_BOOK",
    UPDATE_BOOK = "UPDATE_BOOK",
    DELETE_BOOK = "DELETE_BOOK",
    CREATE_CATEGORY = "CREATE_CATEGORY",
    UPDATE_CATEGORY = "UPDATE_CATEGORY",
    DELETE_CATEGORY = "DELETE_CATEGORY",
    BORROW_CREATED = "BORROW_CREATED",
    RETURN_COMPLETED = "RETURN_COMPLETED",
    BORROW_OVERDUE = "BORROW_OVERDUE",
    INVENTORY_ADJUSTED = "INVENTORY_ADJUSTED",
    USER_CREATED = "USER_CREATED",
    USER_UPDATED = "USER_UPDATED",
    USER_BLOCKED = "USER_BLOCKED"
}
/**
 * Entity types that can be audited
 */
declare enum AuditEntityType {
    BOOK = "BOOK",
    USER = "USER",
    BORROW = "BORROW",
    CATEGORY = "CATEGORY",
    SYSTEM = "SYSTEM"
}

/**
 * Types of notifications in the system
 */
declare enum NotificationType {
    OVERDUE = "OVERDUE",
    BORROW_SUCCESS = "BORROW_SUCCESS",
    RETURN_SUCCESS = "RETURN_SUCCESS",
    SYSTEM = "SYSTEM",
    FINE_ASSIGNED = "FINE_ASSIGNED"
}

/**
 * Định nghĩa chuẩn cho kết quả của một Rule.
 * ok: true - Hợp lệ
 * ok: false - Vi phạm, kèm mã lỗi (string) và thông tin chi tiết (nếu có)
 */
type RuleResult = {
    ok: true;
} | {
    ok: false;
    code: string;
    details?: any;
};
/**
 * Định nghĩa một Rule là một hàm nhận vào context T và trả về RuleResult.
 */
type Rule<T> = (input: T) => RuleResult;

/**
 * Context required for evaluating Borrowing Rules.
 */
interface BorrowContext {
    user: {
        id: string;
        status: string;
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
declare const isUserActive: Rule<BorrowContext>;
/**
 * Rule: User cannot exceed their borrowing limit.
 */
declare const withinLimit: Rule<BorrowContext>;
/**
 * Rule: All requested books must be available in stock.
 */
declare const booksAvailable: Rule<BorrowContext>;
/**
 * Rule: User must not have any overdue books.
 */
declare const noOverdue: Rule<BorrowContext>;
/**
 * Standard Borrow Rule Set.
 * Order matters: check user status first, then overdue, then limits, then stock.
 */
declare const borrowRuleSet: Array<Rule<BorrowContext>>;

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
interface PaginatedData<T> {
    items: T[];
    meta: PaginationMeta;
}
interface ApiResponse<T = any> {
    data?: T;
    code: string | number;
    error?: {
        msg: string;
    };
}

interface AuditLog {
    id: string;
    action: AuditAction;
    entityType: AuditEntityType;
    entityId: string;
    userId: string;
    userName?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
interface CreateAuditLogDto {
    action: AuditAction;
    entityType: AuditEntityType;
    entityId: string;
    userId: string;
    metadata?: Record<string, any>;
}

interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message?: string;
    metadata?: Record<string, any>;
    isRead: boolean;
    createdAt: Date;
}
interface CreateNotificationDto {
    userId: string;
    type: NotificationType;
    title: string;
    message?: string;
    metadata?: Record<string, any>;
}

/**
 * Hàm thực thi danh sách các rules theo chuỗi (pipeline).
 * Sẽ dừng lại ở rule đầu tiên trả về kết quả không thành công (ok: false).
 *
 * @param input Dữ liệu context cần kiểm tra
 * @param rules Mảng các rules thực thi
 * @returns RuleResult
 */
declare const runRules: <T>(rules: Rule<T>[], input: T) => RuleResult;

export { type ApiResponse, AuditAction, AuditEntityType, type AuditLog, type BorrowContext, type CreateAuditLogDto, type CreateNotificationDto, ErrorCode, type ErrorCodeType, type Notification, NotificationType, type PaginatedData, type PaginationMeta, type Rule, type RuleResult, booksAvailable, borrowRuleSet, isUserActive, noOverdue, runRules, withinLimit };

import { z } from 'zod';
import { AxiosInstance } from 'axios';

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
    readonly MAINTENANCE_MODE: "MAINTENANCE_MODE";
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
    readonly RESERVATION_NOT_FOUND: "RESERVATION_NOT_FOUND";
    readonly ALREADY_RESERVED: "ALREADY_RESERVED";
    readonly INVALID_RESERVATION_STATUS: "INVALID_RESERVATION_STATUS";
    readonly RESERVATION_LIMIT_EXCEEDED: "RESERVATION_LIMIT_EXCEEDED";
};
type ErrorCodeType = keyof typeof ErrorCode;

/**
 * Centralized Query Keys for React Query
 * Following a hierarchical structure for efficient cache invalidation
 */
declare const QUERY_KEYS: {
    readonly BOOKS: {
        readonly ALL: "books";
        readonly LIST: "books_list";
        readonly DETAIL: (id: string) => string[];
    };
    readonly CATEGORIES: {
        readonly ALL: "categories";
        readonly LIST: "categories_list";
        readonly DETAIL: (id: string) => string[];
    };
    readonly USERS: {
        readonly ALL: "users";
        readonly LIST: "users_list";
        readonly DETAIL: (id: string) => string[];
    };
    readonly PROFILE: {
        readonly DETAIL: "profile";
    };
    readonly BORROWS: {
        readonly ALL: "borrows";
        readonly LIST: "borrows_list";
        readonly DETAIL: (id: string) => string[];
        readonly MY: readonly ["borrows_my"];
    };
    readonly NOTIFICATIONS: {
        readonly ALL: "notifications";
        readonly LIST: "notifications_list";
    };
    readonly RESERVATIONS: {
        readonly ALL: "reservations";
        readonly LIST: "reservations_list";
        readonly MY: readonly ["reservations_my"];
    };
};

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
    USER_BLOCKED = "USER_BLOCKED",
    SYSTEM_CONFIG_UPDATED = "SYSTEM_CONFIG_UPDATED",
    NOTIFICATION_CONFIG_UPDATED = "NOTIFICATION_CONFIG_UPDATED",
    RESERVATION_CREATED = "RESERVATION_CREATED",
    RESERVATION_CANCELLED = "RESERVATION_CANCELLED",
    RESERVATION_PROMOTED = "RESERVATION_PROMOTED",
    RESERVATION_COMPLETED = "RESERVATION_COMPLETED"
}
/**
 * Entity types that can be audited
 */
declare enum AuditEntityType {
    BOOK = "BOOK",
    USER = "USER",
    BORROW = "BORROW",
    CATEGORY = "CATEGORY",
    SYSTEM = "SYSTEM",
    RESERVATION = "RESERVATION"
}

/**
 * Types of notifications in the system
 */
declare enum NotificationType {
    OVERDUE = "OVERDUE",
    BORROW_SUCCESS = "BORROW_SUCCESS",
    RETURN_SUCCESS = "RETURN_SUCCESS",
    SYSTEM = "SYSTEM",
    FINE_ASSIGNED = "FINE_ASSIGNED",
    RESERVATION_READY = "RESERVATION_READY",
    RESERVATION_CANCELLED = "RESERVATION_CANCELLED",
    QUEUE_UPDATE = "QUEUE_UPDATE"
}

/**
 * Danh sách các khóa cấu hình hệ thống
 */
declare enum SettingKey {
    BORROW_LIMIT = "BORROW_LIMIT",
    BORROW_DURATION_DAYS = "BORROW_DURATION_DAYS",
    FINE_PER_DAY = "FINE_PER_DAY",
    MAX_FINE = "MAX_FINE",
    DUE_SOON_DAYS = "DUE_SOON_DAYS",
    OVERDUE_CHECK_TIME = "OVERDUE_CHECK_TIME",
    ENABLE_FINE = "ENABLE_FINE",
    ENABLE_NOTIFICATION = "ENABLE_NOTIFICATION",
    MAINTENANCE_MODE = "MAINTENANCE_MODE"
}
/**
 * Giá trị mặc định (Fallback) khi database chưa có dữ liệu
 */
declare const DEFAULT_SETTINGS: Record<SettingKey, any>;
/**
 * Phân nhóm settings để hiển thị UI
 */
declare const SETTING_CATEGORIES: {
    BORROW: SettingKey[];
    FINE: SettingKey[];
    NOTIFICATION: SettingKey[];
    SYSTEM: SettingKey[];
};

/**
 * Centralized messages for the entire system.
 * Values matched with apps/web/src/constants/errors/error-map.ts for consistency.
 */
declare const ErrorMessage: {
    readonly SUCCESS: "Operation successful";
    readonly INTERNAL_SERVER_ERROR: "System error, please try again later";
    readonly VALIDATION_ERROR: "Invalid data provided";
    readonly UNAUTHORIZED: "Please login to continue";
    readonly FORBIDDEN: "You do not have permission to perform this action";
    readonly NOT_FOUND: "Requested data not found";
    readonly MAINTENANCE_MODE: "System is under maintenance. Please come back later.";
    readonly INVALID_CREDENTIALS: "Incorrect email or password";
    readonly TOKEN_EXPIRED: "Session expired, please login again";
    readonly TOKEN_INVALID: "Invalid session token";
    readonly USER_NOT_FOUND: "User not found";
    readonly USER_ALREADY_EXISTS: "Email is already registered";
    readonly USER_BLOCKED: "Your account has been blocked";
    readonly BOOK_NOT_FOUND: "Book not found";
    readonly BOOK_ALREADY_EXISTS: "This ISBN already exists in the system";
    readonly OUT_OF_STOCK: "No copies available for borrowing";
    readonly BORROW_LIMIT_EXCEEDED: "You have exceeded the borrowing limit";
    readonly HAS_OVERDUE_BOOKS: "You have overdue books, please return them before borrowing new ones";
    readonly BORROW_RECORD_NOT_FOUND: "Borrow record not found";
    readonly INVALID_BORROW_OPERATION: "Invalid borrow operation";
    readonly CATEGORY_NOT_FOUND: "Category not found";
    readonly CATEGORY_ALREADY_EXISTS: "Category name already exists";
    readonly CATEGORY_HAS_BOOKS: "Cannot delete category containing books";
    readonly RESERVATION_NOT_FOUND: "Reservation record not found";
    readonly ALREADY_RESERVED: "You already have an active reservation for this book";
    readonly INVALID_RESERVATION_STATUS: "Invalid reservation status for this operation";
    readonly RESERVATION_LIMIT_EXCEEDED: "You have reached your maximum reservation limit";
    readonly ISBN_REQUIRED: "ISBN is required";
    readonly PHONE_REQUIRED: "Phone number is required";
    readonly INVALID_ID_LIST: "Invalid or empty IDs list provided";
    readonly INSUFFICIENT_QUANTITY: "Insufficient available quantity";
    readonly QUANTITY_LIMIT_VIOLATION: "Total quantity cannot be less than current borrowed count";
    readonly API_REQUEST_FAILED: "External API request failed";
    readonly NOT_FOUND_ON_SOURCE: "Resource not found on external source";
};
declare const NotificationMessage: {
    readonly BORROW_SUCCESS_TITLE: "Borrowing Successful";
    readonly RETURN_SUCCESS_TITLE: "Book Returned";
    readonly OVERDUE_TITLE: "Book Overdue Alert!";
    readonly RESERVATION_READY_TITLE: "Your reserved book is ready!";
    readonly QUEUE_UPDATE_TITLE: "Queue Status Update";
    readonly RESERVATION_CANCELLED_TITLE: "Reservation Cancelled";
    readonly SYSTEM_TITLE: "System Notification";
    readonly BORROW_SUCCESS_BODY: (bookTitle: string, dueDate: string) => string;
    readonly RETURN_SUCCESS_BODY: (bookTitle: string) => string;
    readonly OVERDUE_BODY: (bookTitle: string, dueDate: string) => string;
    readonly RESERVATION_READY_BODY: (bookTitle: string, date: string) => string;
    readonly QUEUE_UPDATE_BODY: (bookTitle: string, pos: number) => string;
    readonly RESERVATION_CANCELLED_BODY: (bookTitle: string, reason: string, note?: string) => string;
};

/**
 * Schema dùng để validate request cập nhật một setting
 */
declare const UpdateSettingSchema: z.ZodObject<{
    key: z.ZodEnum<typeof SettingKey>;
    value: z.ZodAny;
}, z.core.$strip>;
type UpdateSettingDto = z.infer<typeof UpdateSettingSchema>;
/**
 * Định nghĩa các bộ quy tắc validation riêng cho từng khóa cấu hình
 * Giúp đảm bảo dữ liệu nhập vào từ Admin UI luôn đúng logic
 */
declare const SettingValidationMap: Partial<Record<SettingKey, z.ZodTypeAny>>;

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

/**
 * Hàm thực thi danh sách các rules theo chuỗi (pipeline).
 * Sẽ dừng lại ở rule đầu tiên trả về kết quả không thành công (ok: false).
 *
 * @param input Dữ liệu context cần kiểm tra
 * @param rules Mảng các rules thực thi
 * @returns RuleResult
 */
declare const runRules: <T>(rules: Rule<T>[], input: T) => RuleResult;

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

declare enum UserRole {
    ADMIN = "ADMIN",
    STAFF = "STAFF",
    READER = "READER"
}
declare enum UserStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED"
}

interface CreateBorrowDTO {
    userId?: string;
    phone?: string;
    bookIds: string[];
    dueDate: string | Date;
    reservationId?: string;
}
interface ReturnBookDTO {
    borrowItemIds: string[];
}

interface CreateReservationDTO {
    userId?: string;
    phone?: string;
    bookId: string;
}
interface ReservationEntity {
    id: string;
    userId: string;
    bookId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date | null;
}

interface BookEntity {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    description?: string;
    coverUrl?: string;
    categoryId: string;
    totalQuantity: number;
    availableQuantity: number;
    callNumber?: string;
    category?: CategoryEntity;
    effectiveAvailable?: number;
    queueCount?: number;
    createdAt: string;
    updatedAt: string;
}
interface CategoryEntity {
    id: string;
    name: string;
    description?: string;
    booksCount?: number;
    createdAt: string;
    updatedAt: string;
}
interface UserEntity {
    id: string;
    username: string;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'STAFF' | 'READER';
    status: 'ACTIVE' | 'BLOCKED';
    createdAt: string;
    updatedAt: string;
}
interface BorrowEntity {
    id: string;
    bookId: string;
    readerId: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
    fineAmount: number;
    book?: BookEntity;
    reader?: UserEntity;
    createdAt: string;
    updatedAt: string;
}
interface NotificationEntity {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
}

interface ApiClientConfig {
    baseURL: string;
    getToken?: () => string | null;
    getExtraHeaders?: () => Record<string, string>;
    onUnauthorized?: () => void;
    onError?: (message: string) => void;
}
declare const createSharedApiClient: (config: ApiClientConfig) => AxiosInstance;

declare const createBookApi: (api: AxiosInstance) => {
    list: (params?: any) => Promise<any>;
    get: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
    bulkDelete: (ids: string[]) => Promise<any>;
    fetchISBN: (isbn: string) => Promise<any>;
    adjustInventory: (id: string, data: any) => Promise<any>;
    getInventoryLogs: (id: string) => Promise<any>;
};
declare const createCategoryApi: (api: AxiosInstance) => {
    list: (params?: any) => Promise<any>;
    get: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
};
declare const createBorrowApi: (api: AxiosInstance) => {
    list: (params?: any) => Promise<any>;
    getMyBorrowed: () => Promise<any>;
    borrow: (data: {
        bookId: string;
        readerId: string;
    }) => Promise<any>;
    return: (id: string) => Promise<any>;
};
declare const createNotificationApi: (api: AxiosInstance) => {
    getAll: (params?: any) => Promise<any>;
    markAsRead: (id: string) => Promise<any>;
    markAllAsRead: () => Promise<any>;
};
declare const createReservationApi: (api: AxiosInstance) => {
    list: (params?: any) => Promise<any>;
    getMy: () => Promise<any>;
    create: (data: {
        bookId: string;
        phone?: string;
        userId?: string;
    }) => Promise<any>;
    cancel: (id: string, data?: {
        reason: string;
        note?: string;
    }) => Promise<any>;
};

/**
 * Normalize phone number to international format (+84...)
 * Rules:
 * - Remove spaces, dots, dashes, parentheses
 * - 0912345678 -> +84912345678
 * - 912345678 -> +84912345678
 * - 84912345678 -> +84912345678
 */
declare const normalizePhone: (phone: string) => string;

export { type ApiClientConfig, type ApiResponse, AuditAction, AuditEntityType, type AuditLog, type BookEntity, type BorrowContext, type BorrowEntity, type CategoryEntity, type CreateAuditLogDto, type CreateBorrowDTO, type CreateNotificationDto, type CreateReservationDTO, DEFAULT_SETTINGS, ErrorCode, type ErrorCodeType, ErrorMessage, type Notification, type NotificationEntity, NotificationMessage, NotificationType, type PaginatedData, type PaginationMeta, QUERY_KEYS, type ReservationEntity, type ReturnBookDTO, type Rule, type RuleResult, SETTING_CATEGORIES, SettingKey, SettingValidationMap, type UpdateSettingDto, UpdateSettingSchema, type UserEntity, UserRole, UserStatus, booksAvailable, borrowRuleSet, createBookApi, createBorrowApi, createCategoryApi, createNotificationApi, createReservationApi, createSharedApiClient, isUserActive, noOverdue, normalizePhone, runRules, withinLimit };

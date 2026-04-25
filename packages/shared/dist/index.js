"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuditAction: () => AuditAction,
  AuditEntityType: () => AuditEntityType,
  DEFAULT_SETTINGS: () => DEFAULT_SETTINGS,
  ErrorCode: () => ErrorCode,
  ErrorMessage: () => ErrorMessage,
  NotificationMessage: () => NotificationMessage,
  NotificationType: () => NotificationType,
  QUERY_KEYS: () => QUERY_KEYS,
  SETTING_CATEGORIES: () => SETTING_CATEGORIES,
  SettingKey: () => SettingKey,
  SettingValidationMap: () => SettingValidationMap,
  UpdateSettingSchema: () => UpdateSettingSchema,
  UserRole: () => UserRole,
  UserStatus: () => UserStatus,
  booksAvailable: () => booksAvailable,
  borrowRuleSet: () => borrowRuleSet,
  createBookApi: () => createBookApi,
  createBorrowApi: () => createBorrowApi,
  createCategoryApi: () => createCategoryApi,
  createNotificationApi: () => createNotificationApi,
  createReservationApi: () => createReservationApi,
  createSharedApiClient: () => createSharedApiClient,
  isUserActive: () => isUserActive,
  noOverdue: () => noOverdue,
  normalizePhone: () => normalizePhone,
  runRules: () => runRules,
  withinLimit: () => withinLimit
});
module.exports = __toCommonJS(index_exports);

// src/constants/error-codes.ts
var ErrorCode = {
  // General
  SUCCESS: "SUCCESS",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  MAINTENANCE_MODE: "MAINTENANCE_MODE",
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
  CATEGORY_HAS_BOOKS: "CATEGORY_HAS_BOOKS",
  // Reservation
  RESERVATION_NOT_FOUND: "RESERVATION_NOT_FOUND",
  ALREADY_RESERVED: "ALREADY_RESERVED",
  INVALID_RESERVATION_STATUS: "INVALID_RESERVATION_STATUS",
  RESERVATION_LIMIT_EXCEEDED: "RESERVATION_LIMIT_EXCEEDED"
};

// src/constants/queryKeys.ts
var QUERY_KEYS = {
  BOOKS: {
    ALL: "books",
    LIST: "books_list",
    DETAIL: (id) => ["books_detail", id]
  },
  CATEGORIES: {
    ALL: "categories",
    LIST: "categories_list",
    DETAIL: (id) => ["categories_detail", id]
  },
  USERS: {
    ALL: "users",
    LIST: "users_list",
    DETAIL: (id) => ["users_detail", id]
  },
  PROFILE: {
    DETAIL: "profile"
  },
  BORROWS: {
    ALL: "borrows",
    LIST: "borrows_list",
    DETAIL: (id) => ["borrows_detail", id],
    MY: ["borrows_my"]
  },
  NOTIFICATIONS: {
    ALL: "notifications",
    LIST: "notifications_list"
  },
  RESERVATIONS: {
    ALL: "reservations",
    LIST: "reservations_list",
    MY: ["reservations_my"]
  }
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
  AuditAction2["SYSTEM_CONFIG_UPDATED"] = "SYSTEM_CONFIG_UPDATED";
  AuditAction2["NOTIFICATION_CONFIG_UPDATED"] = "NOTIFICATION_CONFIG_UPDATED";
  AuditAction2["RESERVATION_CREATED"] = "RESERVATION_CREATED";
  AuditAction2["RESERVATION_CANCELLED"] = "RESERVATION_CANCELLED";
  AuditAction2["RESERVATION_PROMOTED"] = "RESERVATION_PROMOTED";
  AuditAction2["RESERVATION_COMPLETED"] = "RESERVATION_COMPLETED";
  return AuditAction2;
})(AuditAction || {});
var AuditEntityType = /* @__PURE__ */ ((AuditEntityType2) => {
  AuditEntityType2["BOOK"] = "BOOK";
  AuditEntityType2["USER"] = "USER";
  AuditEntityType2["BORROW"] = "BORROW";
  AuditEntityType2["CATEGORY"] = "CATEGORY";
  AuditEntityType2["SYSTEM"] = "SYSTEM";
  AuditEntityType2["RESERVATION"] = "RESERVATION";
  return AuditEntityType2;
})(AuditEntityType || {});

// src/constants/notification.ts
var NotificationType = /* @__PURE__ */ ((NotificationType2) => {
  NotificationType2["OVERDUE"] = "OVERDUE";
  NotificationType2["BORROW_SUCCESS"] = "BORROW_SUCCESS";
  NotificationType2["RETURN_SUCCESS"] = "RETURN_SUCCESS";
  NotificationType2["SYSTEM"] = "SYSTEM";
  NotificationType2["FINE_ASSIGNED"] = "FINE_ASSIGNED";
  NotificationType2["RESERVATION_READY"] = "RESERVATION_READY";
  NotificationType2["QUEUE_UPDATE"] = "QUEUE_UPDATE";
  return NotificationType2;
})(NotificationType || {});

// src/constants/settings.ts
var SettingKey = /* @__PURE__ */ ((SettingKey2) => {
  SettingKey2["BORROW_LIMIT"] = "BORROW_LIMIT";
  SettingKey2["BORROW_DURATION_DAYS"] = "BORROW_DURATION_DAYS";
  SettingKey2["FINE_PER_DAY"] = "FINE_PER_DAY";
  SettingKey2["MAX_FINE"] = "MAX_FINE";
  SettingKey2["DUE_SOON_DAYS"] = "DUE_SOON_DAYS";
  SettingKey2["OVERDUE_CHECK_TIME"] = "OVERDUE_CHECK_TIME";
  SettingKey2["ENABLE_FINE"] = "ENABLE_FINE";
  SettingKey2["ENABLE_NOTIFICATION"] = "ENABLE_NOTIFICATION";
  SettingKey2["MAINTENANCE_MODE"] = "MAINTENANCE_MODE";
  return SettingKey2;
})(SettingKey || {});
var DEFAULT_SETTINGS = {
  ["BORROW_LIMIT" /* BORROW_LIMIT */]: 5,
  ["BORROW_DURATION_DAYS" /* BORROW_DURATION_DAYS */]: 14,
  ["FINE_PER_DAY" /* FINE_PER_DAY */]: 5e3,
  ["MAX_FINE" /* MAX_FINE */]: 1e5,
  ["DUE_SOON_DAYS" /* DUE_SOON_DAYS */]: 2,
  ["OVERDUE_CHECK_TIME" /* OVERDUE_CHECK_TIME */]: "08:00",
  ["ENABLE_FINE" /* ENABLE_FINE */]: true,
  ["ENABLE_NOTIFICATION" /* ENABLE_NOTIFICATION */]: true,
  ["MAINTENANCE_MODE" /* MAINTENANCE_MODE */]: false
};
var SETTING_CATEGORIES = {
  BORROW: ["BORROW_LIMIT" /* BORROW_LIMIT */, "BORROW_DURATION_DAYS" /* BORROW_DURATION_DAYS */],
  FINE: ["FINE_PER_DAY" /* FINE_PER_DAY */, "MAX_FINE" /* MAX_FINE */, "ENABLE_FINE" /* ENABLE_FINE */],
  NOTIFICATION: ["DUE_SOON_DAYS" /* DUE_SOON_DAYS */, "OVERDUE_CHECK_TIME" /* OVERDUE_CHECK_TIME */, "ENABLE_NOTIFICATION" /* ENABLE_NOTIFICATION */],
  SYSTEM: ["MAINTENANCE_MODE" /* MAINTENANCE_MODE */]
};

// src/constants/messages.ts
var ErrorMessage = {
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
  NOT_FOUND_ON_SOURCE: "Resource not found on external source"
};
var NotificationMessage = {
  // Titles
  BORROW_SUCCESS_TITLE: "Borrowing Successful",
  RETURN_SUCCESS_TITLE: "Book Returned",
  OVERDUE_TITLE: "Book Overdue Alert!",
  RESERVATION_READY_TITLE: "Your reserved book is ready!",
  QUEUE_UPDATE_TITLE: "Queue Status Update",
  SYSTEM_TITLE: "System Notification",
  // Templates
  BORROW_SUCCESS_BODY: (bookTitle, dueDate) => `You have successfully borrowed "${bookTitle}". Please return it by ${dueDate}.`,
  RETURN_SUCCESS_BODY: (bookTitle) => `You have successfully returned "${bookTitle}". Thank you!`,
  OVERDUE_BODY: (bookTitle, dueDate) => `The book "${bookTitle}" was due on ${dueDate}. Please return it to avoid fines.`,
  RESERVATION_READY_BODY: (bookTitle, date) => `The book "${bookTitle}" you reserved is ready. Please collect it by ${date}.`,
  QUEUE_UPDATE_BODY: (bookTitle, pos) => `Your position in the queue for "${bookTitle}" is now #${pos}.`
};

// src/schemas/settings/setting.schema.ts
var import_zod = require("zod");
var UpdateSettingSchema = import_zod.z.object({
  key: import_zod.z.nativeEnum(SettingKey),
  value: import_zod.z.any()
});
var SettingValidationMap = {
  ["BORROW_LIMIT" /* BORROW_LIMIT */]: import_zod.z.number().min(1, "Borrow limit must be at least 1").max(100),
  ["BORROW_DURATION_DAYS" /* BORROW_DURATION_DAYS */]: import_zod.z.number().min(1, "Duration must be at least 1 day"),
  ["FINE_PER_DAY" /* FINE_PER_DAY */]: import_zod.z.number().min(0, "Fine cannot be negative"),
  ["MAX_FINE" /* MAX_FINE */]: import_zod.z.number().min(0),
  ["DUE_SOON_DAYS" /* DUE_SOON_DAYS */]: import_zod.z.number().min(1).max(14),
  ["OVERDUE_CHECK_TIME" /* OVERDUE_CHECK_TIME */]: import_zod.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  ["ENABLE_FINE" /* ENABLE_FINE */]: import_zod.z.boolean(),
  ["ENABLE_NOTIFICATION" /* ENABLE_NOTIFICATION */]: import_zod.z.boolean(),
  ["MAINTENANCE_MODE" /* MAINTENANCE_MODE */]: import_zod.z.boolean()
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

// src/types/user.ts
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["ADMIN"] = "ADMIN";
  UserRole2["STAFF"] = "STAFF";
  UserRole2["READER"] = "READER";
  return UserRole2;
})(UserRole || {});
var UserStatus = /* @__PURE__ */ ((UserStatus2) => {
  UserStatus2["ACTIVE"] = "ACTIVE";
  UserStatus2["BLOCKED"] = "BLOCKED";
  return UserStatus2;
})(UserStatus || {});

// src/api/factory.ts
var import_axios = __toESM(require("axios"));
var createSharedApiClient = (config) => {
  const instance = import_axios.default.create({
    baseURL: config.baseURL,
    headers: {
      "Content-Type": "application/json"
    }
  });
  instance.interceptors.request.use(
    (req) => {
      const token = config.getToken?.();
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
      const extraHeaders = config.getExtraHeaders?.();
      if (extraHeaders) {
        Object.assign(req.headers, extraHeaders);
      }
      return req;
    },
    (error) => Promise.reject(error)
  );
  instance.interceptors.response.use(
    (response) => {
      const { data } = response;
      if (data && data.code && data.code !== "SUCCESS" && data.code !== 200 && data.code !== 0) {
        const errorMsg = data.message || "Unknown error occurred";
        if (data.code === "UNAUTHORIZED" || data.code === "TOKEN_EXPIRED") {
          config.onUnauthorized?.();
        }
        config.onError?.(errorMsg);
        return Promise.reject(data);
      }
      return response;
    },
    (error) => {
      const message = error.response?.data?.message || error.message || "Network Error";
      if (error.response?.status === 401) {
        config.onUnauthorized?.();
      }
      config.onError?.(message);
      return Promise.reject(error);
    }
  );
  return instance;
};

// src/api/index.ts
var createBookApi = (api) => ({
  list: (params) => api.get("/books", { params }).then((res) => res.data),
  get: (id) => api.get(`/books/${id}`).then((res) => res.data),
  create: (data) => api.post("/books", data).then((res) => res.data),
  update: (id, data) => api.patch(`/books/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/books/${id}`).then((res) => res.data),
  bulkDelete: (ids) => api.delete("/books/bulk", { data: { ids } }).then((res) => res.data),
  fetchISBN: (isbn) => api.get(`/books/fetch-isbn/${isbn}`).then((res) => res.data),
  adjustInventory: (id, data) => api.post(`/books/${id}/inventory-adjustments`, data).then((res) => res.data),
  getInventoryLogs: (id) => api.get(`/books/${id}/inventory-logs`).then((res) => res.data)
});
var createCategoryApi = (api) => ({
  list: (params) => api.get("/categories", { params }).then((res) => res.data),
  get: (id) => api.get(`/categories/${id}`).then((res) => res.data),
  create: (data) => api.post("/categories", data).then((res) => res.data),
  update: (id, data) => api.patch(`/categories/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/categories/${id}`).then((res) => res.data)
});
var createBorrowApi = (api) => ({
  list: (params) => api.get("/borrows", { params }).then((res) => res.data),
  getMyBorrowed: () => api.get("/borrows/my").then((res) => res.data),
  borrow: (data) => api.post("/borrows", data).then((res) => res.data),
  return: (id) => api.post(`/borrows/${id}/return`).then((res) => res.data)
});
var createNotificationApi = (api) => ({
  getAll: (params) => api.get("/notifications", { params }).then((res) => res.data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`).then((res) => res.data),
  markAllAsRead: () => api.post("/notifications/mark-all-read").then((res) => res.data)
});
var createReservationApi = (api) => ({
  list: (params) => api.get("/reservations", { params }).then((res) => res.data),
  getMy: () => api.get("/reservations/my").then((res) => res.data),
  create: (data) => api.post("/reservations", data).then((res) => res.data),
  cancel: (id) => api.post(`/reservations/${id}/cancel`).then((res) => res.data)
});

// src/utils/phone.ts
var normalizePhone = (phone) => {
  if (!phone) return "";
  let cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("0")) {
    return "+84" + cleaned.substring(1);
  }
  if (cleaned.startsWith("84") && !cleaned.startsWith("+")) {
    return "+" + cleaned;
  }
  if (/^\d{9}$/.test(cleaned)) {
    return "+84" + cleaned;
  }
  if (cleaned.startsWith("+84")) {
    return cleaned;
  }
  if (!cleaned.startsWith("+") && cleaned.length >= 9) {
    return "+84" + cleaned;
  }
  return cleaned;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuditAction,
  AuditEntityType,
  DEFAULT_SETTINGS,
  ErrorCode,
  ErrorMessage,
  NotificationMessage,
  NotificationType,
  QUERY_KEYS,
  SETTING_CATEGORIES,
  SettingKey,
  SettingValidationMap,
  UpdateSettingSchema,
  UserRole,
  UserStatus,
  booksAvailable,
  borrowRuleSet,
  createBookApi,
  createBorrowApi,
  createCategoryApi,
  createNotificationApi,
  createReservationApi,
  createSharedApiClient,
  isUserActive,
  noOverdue,
  normalizePhone,
  runRules,
  withinLimit
});

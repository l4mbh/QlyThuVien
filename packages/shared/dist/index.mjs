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
  CATEGORY_HAS_BOOKS: "CATEGORY_HAS_BOOKS"
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

// src/schemas/settings/setting.schema.ts
import { z } from "zod";
var UpdateSettingSchema = z.object({
  key: z.nativeEnum(SettingKey),
  value: z.any()
});
var SettingValidationMap = {
  ["BORROW_LIMIT" /* BORROW_LIMIT */]: z.number().min(1, "Borrow limit must be at least 1").max(100),
  ["BORROW_DURATION_DAYS" /* BORROW_DURATION_DAYS */]: z.number().min(1, "Duration must be at least 1 day"),
  ["FINE_PER_DAY" /* FINE_PER_DAY */]: z.number().min(0, "Fine cannot be negative"),
  ["MAX_FINE" /* MAX_FINE */]: z.number().min(0),
  ["DUE_SOON_DAYS" /* DUE_SOON_DAYS */]: z.number().min(1).max(14),
  ["OVERDUE_CHECK_TIME" /* OVERDUE_CHECK_TIME */]: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  ["ENABLE_FINE" /* ENABLE_FINE */]: z.boolean(),
  ["ENABLE_NOTIFICATION" /* ENABLE_NOTIFICATION */]: z.boolean(),
  ["MAINTENANCE_MODE" /* MAINTENANCE_MODE */]: z.boolean()
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
import axios from "axios";
var createSharedApiClient = (config) => {
  const instance = axios.create({
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
export {
  AuditAction,
  AuditEntityType,
  DEFAULT_SETTINGS,
  ErrorCode,
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
  createSharedApiClient,
  isUserActive,
  noOverdue,
  normalizePhone,
  runRules,
  withinLimit
};

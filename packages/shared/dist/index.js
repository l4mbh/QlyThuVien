"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuditAction: () => AuditAction,
  AuditEntityType: () => AuditEntityType,
  DEFAULT_SETTINGS: () => DEFAULT_SETTINGS,
  ErrorCode: () => ErrorCode,
  NotificationType: () => NotificationType,
  SETTING_CATEGORIES: () => SETTING_CATEGORIES,
  SettingKey: () => SettingKey,
  SettingValidationMap: () => SettingValidationMap,
  UpdateSettingSchema: () => UpdateSettingSchema,
  UserRole: () => UserRole,
  UserStatus: () => UserStatus,
  booksAvailable: () => booksAvailable,
  borrowRuleSet: () => borrowRuleSet,
  isUserActive: () => isUserActive,
  noOverdue: () => noOverdue,
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuditAction,
  AuditEntityType,
  DEFAULT_SETTINGS,
  ErrorCode,
  NotificationType,
  SETTING_CATEGORIES,
  SettingKey,
  SettingValidationMap,
  UpdateSettingSchema,
  UserRole,
  UserStatus,
  booksAvailable,
  borrowRuleSet,
  isUserActive,
  noOverdue,
  runRules,
  withinLimit
});

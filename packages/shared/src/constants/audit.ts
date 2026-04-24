/**
 * Standardized actions for system audit logs
 */
export enum AuditAction {
  // Book actions
  CREATE_BOOK = "CREATE_BOOK",
  UPDATE_BOOK = "UPDATE_BOOK",
  DELETE_BOOK = "DELETE_BOOK",

  // Category actions
  CREATE_CATEGORY = "CREATE_CATEGORY",
  UPDATE_CATEGORY = "UPDATE_CATEGORY",
  DELETE_CATEGORY = "DELETE_CATEGORY",

  // Borrow actions
  BORROW_CREATED = "BORROW_CREATED",
  RETURN_COMPLETED = "RETURN_COMPLETED",
  BORROW_OVERDUE = "BORROW_OVERDUE",

  // Inventory actions
  INVENTORY_ADJUSTED = "INVENTORY_ADJUSTED",
  
  // User/Member actions
  USER_CREATED = "USER_CREATED",
  USER_UPDATED = "USER_UPDATED",
  USER_BLOCKED = "USER_BLOCKED",
}

/**
 * Entity types that can be audited
 */
export enum AuditEntityType {
  BOOK = "BOOK",
  USER = "USER",
  BORROW = "BORROW",
  CATEGORY = "CATEGORY",
  SYSTEM = "SYSTEM",
}

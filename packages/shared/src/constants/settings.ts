/**
 * Danh sách các khóa cấu hình hệ thống
 */
export enum SettingKey {
  // Borrow Rules
  BORROW_LIMIT = "BORROW_LIMIT",
  BORROW_DURATION_DAYS = "BORROW_DURATION_DAYS",
  
  // Fine Rules
  FINE_PER_DAY = "FINE_PER_DAY",
  MAX_FINE = "MAX_FINE",
  
  // Notification Rules
  DUE_SOON_DAYS = "DUE_SOON_DAYS",
  OVERDUE_CHECK_TIME = "OVERDUE_CHECK_TIME",
  
  // System Feature Flags
  ENABLE_FINE = "ENABLE_FINE",
  ENABLE_NOTIFICATION = "ENABLE_NOTIFICATION",
  MAINTENANCE_MODE = "MAINTENANCE_MODE"
}

/**
 * Giá trị mặc định (Fallback) khi database chưa có dữ liệu
 */
export const DEFAULT_SETTINGS: Record<SettingKey, any> = {
  [SettingKey.BORROW_LIMIT]: 5,
  [SettingKey.BORROW_DURATION_DAYS]: 14,
  
  [SettingKey.FINE_PER_DAY]: 5000,
  [SettingKey.MAX_FINE]: 100000,
  
  [SettingKey.DUE_SOON_DAYS]: 2,
  [SettingKey.OVERDUE_CHECK_TIME]: "08:00",
  
  [SettingKey.ENABLE_FINE]: true,
  [SettingKey.ENABLE_NOTIFICATION]: true,
  [SettingKey.MAINTENANCE_MODE]: false
};

/**
 * Phân nhóm settings để hiển thị UI
 */
export const SETTING_CATEGORIES = {
  BORROW: [SettingKey.BORROW_LIMIT, SettingKey.BORROW_DURATION_DAYS],
  FINE: [SettingKey.FINE_PER_DAY, SettingKey.MAX_FINE, SettingKey.ENABLE_FINE],
  NOTIFICATION: [SettingKey.DUE_SOON_DAYS, SettingKey.OVERDUE_CHECK_TIME, SettingKey.ENABLE_NOTIFICATION],
  SYSTEM: [SettingKey.MAINTENANCE_MODE]
};

import { 
  SettingKey, 
  DEFAULT_SETTINGS, 
  SettingValidationMap,
  SETTING_CATEGORIES,
  AuditAction,
  AuditEntityType
} from "@qltv/shared";
import { SettingRepository } from "../../repositories/settings/setting.repository";
import { auditService } from "../audit/audit.service";

export class SettingService {
  private repository: SettingRepository;
  private cache: Map<string, any> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.repository = new SettingRepository();
  }

  /**
   * Khởi tạo cache từ Database khi server start
   */
  async init() {
    if (this.isInitialized) return;
    
    console.log("[SettingService] Warming up cache...");
    try {
      const settings = await this.repository.findAll();
      
      // Nạp dữ liệu từ DB vào Cache
      settings.forEach(s => {
        this.cache.set(s.key, s.value);
      });

      this.isInitialized = true;
      console.log(`[SettingService] Cache initialized with ${settings.length} items.`);
    } catch (error) {
      console.error("[SettingService] Failed to initialize cache:", error);
    }
  }

  /**
   * Lấy giá trị cấu hình (Bulletproof logic: Cache -> DB -> Default)
   */
  async get<T = any>(key: SettingKey): Promise<T> {
    // 1. Kiểm tra cache
    if (this.cache.has(key)) {
      return this.cache.get(key) as T;
    }

    // 2. Nếu cache chưa có, thử đọc DB
    const dbSetting = await this.repository.findByKey(key);
    if (dbSetting) {
      this.cache.set(key, dbSetting.value);
      return dbSetting.value as T;
    }

    // 3. Fallback về Default nếu cả DB cũng không có
    return DEFAULT_SETTINGS[key] as T;
  }

  /**
   * Cập nhật cấu hình hệ thống
   */
  async set(key: SettingKey, value: any, userId: string): Promise<void> {
    // 1. Validation logic bằng Zod Map đã định nghĩa ở shared
    const validator = SettingValidationMap[key];
    if (validator) {
      const result = validator.safeParse(value);
      if (!result.success) {
        const errorMsg = result.error.issues.map(e => e.message).join(", ");
        throw new Error(`Validation failed for ${key}: ${errorMsg}`);
      }
      value = result.data; // Sử dụng dữ liệu đã được parse/transform
    }

    // 2. Lấy giá trị cũ để log audit
    const oldValue = await this.get(key);

    // 3. Xác định category
    const category = this.getCategory(key);

    // 4. Cập nhật Database & Cache
    await this.repository.upsert(key, value, category);
    this.cache.set(key, value);

    // 5. Ghi Log Audit
    await auditService.logEvent({
      action: AuditAction.SYSTEM_CONFIG_UPDATED,
      entityType: AuditEntityType.SYSTEM,
      entityId: key,
      userId,
      metadata: { oldValue, newValue: value }
    });
    
    console.log(`[SettingService] Setting ${key} updated by ${userId}`);
  }

  /**
   * Lấy toàn bộ settings (Merge với defaults cho UI)
   */
  async getAll() {
    const dbSettings = await this.repository.findAll();
    
    return Object.values(SettingKey).map(key => {
      const dbItem = dbSettings.find(s => s.key === key);
      return {
        key,
        value: dbItem ? dbItem.value : DEFAULT_SETTINGS[key],
        category: dbItem ? dbItem.category : this.getCategory(key),
        description: dbItem ? dbItem.description : `System configuration for ${key}`
      };
    });
  }

  /**
   * Quản lý cấu hình thông báo (Routing)
   */
  async getNotificationSettings() {
    return this.repository.findAllNotificationSettings();
  }

  async updateNotificationRouting(type: string, roles: any[], isEnabled: boolean, userId: string) {
    const settings = await this.getNotificationSettings();
    const oldSetting = settings.find(s => s.type === type);
    
    await this.repository.upsertNotificationSetting(type, roles, isEnabled);
    
    await auditService.logEvent({
      action: AuditAction.NOTIFICATION_CONFIG_UPDATED,
      entityType: AuditEntityType.SYSTEM,
      entityId: type,
      userId,
      metadata: { 
        oldRoles: oldSetting?.roles, 
        newRoles: roles,
        isEnabled 
      }
    });
  }

  private getCategory(key: SettingKey): string {
    for (const [cat, keys] of Object.entries(SETTING_CATEGORIES)) {
      if ((keys as string[]).includes(key)) return cat;
    }
    return "GENERAL";
  }
}

export const settingService = new SettingService();

import { z } from "zod";
import { SettingKey } from "../../constants/settings";

/**
 * Schema dùng để validate request cập nhật một setting
 */
export const UpdateSettingSchema = z.object({
  key: z.nativeEnum(SettingKey),
  value: z.any()
});

export type UpdateSettingDto = z.infer<typeof UpdateSettingSchema>;

/**
 * Định nghĩa các bộ quy tắc validation riêng cho từng khóa cấu hình
 * Giúp đảm bảo dữ liệu nhập vào từ Admin UI luôn đúng logic
 */
export const SettingValidationMap: Partial<Record<SettingKey, z.ZodTypeAny>> = {
  [SettingKey.BORROW_LIMIT]: z.number().min(1, "Borrow limit must be at least 1").max(100),
  [SettingKey.BORROW_DURATION_DAYS]: z.number().min(1, "Duration must be at least 1 day"),
  [SettingKey.FINE_PER_DAY]: z.number().min(0, "Fine cannot be negative"),
  [SettingKey.MAX_FINE]: z.number().min(0),
  [SettingKey.DUE_SOON_DAYS]: z.number().min(1).max(14),
  [SettingKey.OVERDUE_CHECK_TIME]: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  [SettingKey.ENABLE_FINE]: z.boolean(),
  [SettingKey.ENABLE_NOTIFICATION]: z.boolean(),
  [SettingKey.MAINTENANCE_MODE]: z.boolean()
};

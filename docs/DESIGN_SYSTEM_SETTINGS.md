# 🎨 DESIGN: System Settings Module (Bulletproof Version)

**Ngày tạo:** 2026-04-24
**Trạng thái:** Refined & Production-Ready

---

## 1. Dữ liệu (Prisma Schema)

### Table: `SystemSetting`
Dùng `Json` để lưu giá trị, giúp tự động handle type (number, boolean, object).
```prisma
model SystemSetting {
  key         String   @id
  value       Json     // Chứa giá trị thực (5, true, "08:00")
  category    String   @default("GENERAL") // Phân nhóm UI: BORROW, FINE, SYSTEM
  description String?
  updatedAt   DateTime @updatedAt
}
```

### Table: `NotificationSetting`
```prisma
model NotificationSetting {
  type        String   @id
  roles       Json     // Array of UserRole enum: ["ADMIN", "STAFF"]
  isEnabled   Boolean  @default(true)
  updatedAt   DateTime @updatedAt
}
```

---

## 2. Logic Phục Hồi (Default Value Strategy)

Để hệ thống không bao giờ bị "gãy" khi DB trống, ta quản lý Default trong code:

```typescript
// packages/shared/src/constants/settings.ts
export const DEFAULT_SETTINGS = {
  BORROW_LIMIT: 5,
  BORROW_DURATION_DAYS: 14,
  FINE_PER_DAY: 5000,
  DUE_SOON_DAYS: 2,
  OVERDUE_CHECK_TIME: "08:00"
};
```

---

## 3. Quản lý Cache & Validation (Backend Service)

### Cache Strategy
- **Store:** `Map<string, any>` (Memory cache).
- **Preload:** Hàm `init()` sẽ load toàn bộ DB vào Map khi server start (Warm cache).
- **Invalidate:** Khi `set(key, value)`, cập nhật DB xong sẽ update thẳng vào Map.

### Validation Layer (Zod)
Mọi thay đổi phải đi qua bộ lọc type-check:
- `BORROW_LIMIT` -> `z.number().min(1)`
- `FINE_PER_DAY` -> `z.number().min(0)`

### Audit Log Integration
Mỗi khi `set()` thành công, tự động gọi:
```typescript
await auditService.log({
  action: "SETTING_UPDATED",
  entityType: "SYSTEM_SETTING",
  entityId: key,
  metadata: { oldValue, newValue }
});
```

---

## 4. Giao diện (Frontend) - Smart UI Mapping

Dựa vào kiểu dữ liệu của `value` (JSON) và `key`, UI sẽ tự render input tương ứng:

| Type (JSON) | UI Component | Ví dụ |
| :--- | :--- | :--- |
| `number` | Input (Number) | Borrow Limit |
| `boolean` | Switch / Toggle | Enable Fine |
| `string` | Input (Text) | Description |
| `string` (time pattern) | Time Picker | Overdue Check Time |

---

## 5. Danh mục Settings (Grouping)

- **📚 Borrowing:** Limit, Duration.
- **💰 Finance:** Fine per day, Max fine.
- **🔔 Notifications:** Due soon days, Check time.
- **⚙️ System:** Feature flags, Maintenance mode.

---

## 🧪 Acceptance Criteria (Refined)

- [x] **Type Integrity:** Đổi `BORROW_LIMIT` thành string "abc" phải bị Backend chặn (400 Bad Request).
- [x] **Fallback:** Xóa trắng table `system_settings` trong DB, app vẫn phải chạy bình thường với giá trị Default.
- [x] **Audit Trace:** Kiểm tra table `audit_logs` thấy đúng log của việc thay đổi setting kèm giá trị cũ/mới.
- [x] **Realtime:** Đổi setting ở Tab 1, chuyển sang Tab 2 gọi API phải thấy giá trị mới ngay lập tức (nhờ Cache update).

---

*Tạo bởi AWF 2.1 - Solution Architect*

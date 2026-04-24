# Phase 03: Backend Service & Cache
Status: ⬜ Pending

## Objective
Xây dựng "bộ não" xử lý settings với hiệu năng cao (Cache) và bảo mật (Audit Log).

## Implementation Steps
1. [ ] [NEW] `apps/api/src/repositories/settings/setting.repository.ts`: Thao tác CRUD cơ bản với Prisma.
2. [ ] [NEW] `apps/api/src/services/settings/setting.service.ts`:
    - Logic `get(key)`: Ưu tiên lấy từ Map cache -> DB -> Default.
    - Logic `set(key, value)`: Validate -> Save DB -> Update Cache -> Log Audit.
    - Logic `init()`: Load toàn bộ DB vào cache khi server start.
3. [ ] [MODIFY] `apps/api/src/index.ts`: Gọi `settingService.init()` khi khởi động server.

## Test Criteria
- [ ] `get()` trả về giá trị đúng từ DB.
- [ ] Khi DB trống, `get()` phải trả về giá trị trong `DEFAULT_SETTINGS`.
- [ ] Thời gian lấy giá trị lần 2 phải cực nhanh (vì dùng Cache).

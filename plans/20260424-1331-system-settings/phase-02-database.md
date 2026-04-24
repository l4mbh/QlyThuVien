# Phase 02: Database Migration
Status: ⬜ Pending

## Objective
Tạo cấu trúc lưu trữ cho Settings trong Database.

## Implementation Steps
1. [ ] [MODIFY] `apps/api/prisma/schema.prisma`: Thêm model `SystemSetting` và `NotificationSetting` với trường `Json`.
2. [ ] [RUN] `npx prisma migrate dev --name add_system_settings`: Cập nhật database.
3. [ ] [NEW] `apps/api/prisma/seed.ts` (Update): Thêm dữ liệu mẫu ban đầu từ `DEFAULT_SETTINGS`.

## Test Criteria
- [ ] Database có 2 bảng mới với đúng cấu trúc.
- [ ] Chạy `prisma studio` thấy dữ liệu mẫu đã được nạp thành công.

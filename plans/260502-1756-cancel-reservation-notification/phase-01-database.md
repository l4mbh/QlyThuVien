# Phase 01: Database Schema
Status: ⬜ Pending
Dependencies: None

## Objective
Cập nhật cơ sở dữ liệu để hỗ trợ lưu trữ lý do huỷ và ghi chú huỷ cho `Reservation`.

## Requirements
### Functional
- [ ] Thêm `cancelReason` và `cancelNote` vào bảng `Reservation`.
- [ ] Chạy migration để áp dụng thay đổi vào DB.

### Non-Functional
- [ ] Đảm bảo kiểu dữ liệu là Optional (`String?`) vì chỉ dùng khi huỷ.

## Implementation Steps
1. [ ] Step 1 - Mở `apps/api/prisma/schema.prisma`.
2. [ ] Step 2 - Thêm trường `cancelReason String?` và `cancelNote String?` vào model `Reservation`.
3. [ ] Step 3 - Chạy `npx prisma db push` trong `apps/api` để cập nhật DB cục bộ.

## Files to Create/Modify
- `apps/api/prisma/schema.prisma` - Bổ sung trường cho Reservation.

## Test Criteria
- [ ] Cấu trúc DB được cập nhật thành công không sinh lỗi.

---
Next Phase: `phase-02-shared.md`

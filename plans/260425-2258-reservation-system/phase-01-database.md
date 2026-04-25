# Phase 01: Database Foundation
Status: ⬜ Pending
Dependencies: None

## Objective
Thiết lập cấu trúc dữ liệu cho Reservation và mở rộng User model để phục vụ quản lý Reader.

## Implementation Steps
1. [ ] **Update `schema.prisma`**:
   - Thêm `enum ReservationStatus { PENDING, READY, COMPLETED, CANCELLED, EXPIRED }`.
   - Tạo model `Reservation` với các field: `id`, `userId`, `bookId`, `status`, `createdAt`, `expiresAt`.
   - Thêm các Index tối ưu: `@@index([bookId, status, createdAt])`.
   - Cập nhật `User` model: `isGuest` (Boolean), `hasActivity` (Boolean).
2. [ ] **Generate Migration**:
   - Chạy `npx prisma migrate dev --name add_reservation_system`.
3. [ ] **Seed Data (Optional)**:
   - Tạo thử một vài bản ghi Reservation PENDING để test query vị trí.

## Files to Create/Modify
- `apps/api/prisma/schema.prisma` - Cập nhật Schema.

## Test Criteria
- [ ] Database khởi tạo thành công các bảng mới.
- [ ] Các Index được tạo đúng (Kiểm tra qua SQL Explorer hoặc Prisma Studio).

# Phase 03: API & Documentation
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Xây dựng các Endpoint giao tiếp cho Client và Admin, đồng thời cập nhật tài liệu API.

## Implementation Steps
1. [ ] **Client API**:
   - `POST /reservations`: Đặt sách.
   - `GET /reservations/my`: Lấy danh sách cá nhân (kèm Position động).
2. [ ] **Admin API**:
   - `GET /admin/reservations`: Xem toàn bộ hàng đợi.
   - `POST /admin/reservations/:id/cancel`: Hủy (gọi `promoteNext` sau đó).
   - `POST /admin/reservations/:id/complete`: Chuyển thành mượn sách thực tế.
3. [ ] **Documentation**:
   - Cập nhật `docs/api/openapi.yaml`.

## Files to Create/Modify
- `apps/api/src/controllers/reservation/reservation.controller.ts` [NEW]
- `docs/api/openapi.yaml` [MODIFY]

## Test Criteria
- [ ] API trả về đúng vị trí #X cho user.
- [ ] Idempotency hoạt động (không tạo 2 record cho 1 user/book).

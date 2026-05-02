# Phase 03: Backend API
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Xử lý logic backend: lưu lý do huỷ, gửi thông báo cho độc giả.

## Requirements
### Functional
- [ ] Cho phép `cancelReservation` API nhận `reason` và `note`.
- [ ] Gửi Notification `RESERVATION_CANCELLED` cho độc giả.
- [ ] Đảm bảo cấu hình Notification cho phép gửi loại thông báo này.

## Implementation Steps
1. [ ] Step 1 - Thêm `RESERVATION_CANCELLED` vào `PERSONAL_NOTIFICATION_TYPES` trong `apps/api/src/services/notification/notification.service.ts`.
2. [ ] Step 2 - Thêm hàm `notifyReservationCancelled` vào `notification.service.ts`.
3. [ ] Step 3 - Cập nhật `cancelReservation` trong `apps/api/src/services/reservation/reservation.service.ts` để lưu `cancelReason`, `cancelNote` vào DB và gọi hàm `notifyReservationCancelled`. Thêm log vào `auditService`.
4. [ ] Step 4 - Cập nhật `apps/api/src/controllers/reservation/reservation.controller.ts` để truyền `reason` và `note` từ `req.body` vào service.

## Files to Create/Modify
- `apps/api/src/services/notification/notification.service.ts` - Hàm gửi thông báo.
- `apps/api/src/services/reservation/reservation.service.ts` - Logic huỷ.
- `apps/api/src/controllers/reservation/reservation.controller.ts` - Nhận body.

## Test Criteria
- [ ] API trả về thành công khi có đủ tham số.
- [ ] Bảng `Notification` có thêm một record báo huỷ cho Reader.

---
Next Phase: `phase-04-frontend.md`

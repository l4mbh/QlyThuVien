# Phase 04: Frontend (Admin & Reader)
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Giao diện Admin chọn lý do, Giao diện Reader nhận thông báo.

## Requirements
### Functional
- [ ] Xây dựng Modal Form thay thế window.confirm trong quá trình Cancel.
- [ ] Form bắt buộc chọn lý do. Nếu là "Lý do khác", bắt buộc nhập Note.
- [ ] Cập nhật Bell và NotificationList để hiển thị icon/màu sắc của `RESERVATION_CANCELLED`.

## Implementation Steps
1. [ ] Step 1 - Sửa `apps/web/src/features/reservations/reservation.service.ts` để truyền object `data`.
2. [ ] Step 2 - Tạo `CancelReservationModal` (component mới hoặc inline) bên trong `apps/web/src/features/reservations/components/reservation-detail-drawer/reservation-detail-drawer.tsx`.
3. [ ] Step 3 - Sửa `NotificationBell` (`apps/web/src/components/ui/notification-bell/notification-bell.tsx`) thêm logic render icon cho CANCELLED.
4. [ ] Step 4 - Sửa `NotificationList` (`apps/reader/src/features/notifications/components/NotificationList.tsx`) thêm icon (VD: `Ban` hoặc `XCircle`) và hiển thị message chứa lý do.

## Files to Create/Modify
- `apps/web/src/features/reservations/reservation.service.ts`
- `apps/web/src/features/reservations/components/reservation-detail-drawer/reservation-detail-drawer.tsx`
- `apps/web/src/components/ui/notification-bell/notification-bell.tsx`
- `apps/reader/src/features/notifications/components/NotificationList.tsx`

## Test Criteria
- [ ] Giao diện có modal chặn khi huỷ.
- [ ] Reader thấy thông báo huỷ màu đỏ, kèm lý do rõ ràng.

---
Next Phase: `phase-05-testing.md`

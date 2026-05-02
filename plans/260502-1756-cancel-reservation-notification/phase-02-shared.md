# Phase 02: Shared Packages
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Cập nhật các constants và types dùng chung giữa Frontend và Backend.

## Requirements
### Functional
- [ ] Thêm loại thông báo mới cho việc huỷ đặt sách.
- [ ] Cập nhật mẫu tin nhắn thông báo (title & body).
- [ ] Cập nhật API signature cho tính năng cancel.

## Implementation Steps
1. [ ] Step 1 - Thêm `RESERVATION_CANCELLED` vào enum `NotificationType` trong `packages/shared/src/constants/notification.ts`.
2. [ ] Step 2 - Thêm `RESERVATION_CANCELLED_TITLE` và hàm `RESERVATION_CANCELLED_BODY(bookTitle, reason, note)` vào `NotificationMessage` trong `packages/shared/src/constants/messages.ts`.
3. [ ] Step 3 - Cập nhật hàm `cancel` trong `createReservationApi` của `packages/shared/src/api/index.ts` để nhận thêm `{ reason, note }`.

## Files to Create/Modify
- `packages/shared/src/constants/notification.ts` - Enum type.
- `packages/shared/src/constants/messages.ts` - Message templates.
- `packages/shared/src/api/index.ts` - API Client.

## Test Criteria
- [ ] Các enum và hàm có thể được import bình thường ở các apps khác.

---
Next Phase: `phase-03-backend.md`

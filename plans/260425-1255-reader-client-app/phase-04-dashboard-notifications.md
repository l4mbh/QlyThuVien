# Phase 04: User Dashboard & Notifications
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Quản lý cá nhân và thông báo với các Alert và Status màu sắc chuẩn xác.

## Implementation Steps
1. [ ] Build `MyBorrowedList`:
   - Item hiển thị dạng List bo góc.
   - Overdue highlight: Sử dụng `--destructive` color từ Admin theme (Red).
2. [ ] Build `NotificationCenter`:
   - Notification Bell: Màu Primary Blue khi có thông báo mới.
   - List notification: Hover state đồng bộ với các bảng (Table) trong Admin.
3. [ ] Profile Tab: Tối giản, tập trung vào thông tin ID độc giả.

## Files to Create/Modify
- `apps/reader/src/features/dashboard/components/MyBorrowedList.tsx` - [New]
- `apps/reader/src/features/notifications/components/NotificationBell.tsx` - [New]

## Test Criteria
- [ ] Cảnh báo quá hạn (Overdue) sử dụng đúng mã màu đỏ của hệ thống.
- [ ] Hiệu ứng hover trên các item thông báo mượt mà và nhẹ nhàng.

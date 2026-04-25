# Phase 04: Reader App UX (Client)
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Nâng cấp trải nghiệm đặt sách và theo dõi hàng đợi trên App Reader.

## Implementation Steps
1. [ ] **Book Detail Modal Enhancement**:
   - Hiển thị Badge vị trí: "Bạn đang đứng thứ #X".
   - Logic nút bấm: `Reserve` (nếu chưa đặt) / `Cancel` (nếu đã đặt).
2. [ ] **My Books Page (Tabs)**:
   - Thêm Tab Switcher: `Đang mượn` | `Đang đặt`.
   - Thiết kế `ReservationCard` với Step Indicator (Pending -> Ready -> Collected).
3. [ ] **Notification Integration**:
   - Hiển thị Toast/Alert khi hàng đợi có cập nhật.

## Files to Create/Modify
- `apps/reader/src/features/books/components/BookDetailModal.tsx`
- `apps/reader/src/features/my-books/pages/MyBooksPage.tsx`

## Test Criteria
- [ ] User thấy được vị trí của mình thay đổi realtime (sau khi refresh hoặc qua socket nếu có).
- [ ] Giao diện Tab hoạt động mượt mà.

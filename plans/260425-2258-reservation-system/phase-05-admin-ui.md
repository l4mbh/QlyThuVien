# Phase 05: Admin App UI (Staff)
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Xây dựng Dashboard quản lý hàng đợi và phân loại Reader cho Staff.

## Implementation Steps
1. [ ] **Reservation Dashboard**:
   - Danh sách hàng đợi tập trung.
   - Nút `Confirm Ready` (nếu muốn làm thủ công) và `Confirm Borrow` (khi khách đến lấy).
2. [ ] **Reader List Enhancements**:
   - Thêm Tab: `Active Readers` (hasActivity: true) | `New Guests`.
3. [ ] **Batch Actions**:
   - Cho phép chọn nhiều người để gửi thông báo hoặc xử lý Ready.

## Files to Create/Modify
- `apps/web/src/features/reservation/pages/ReservationDashboard.tsx` [NEW]
- `apps/web/src/features/reader/pages/ReaderList.tsx` [MODIFY]

## Test Criteria
- [ ] Staff có thể chuyển đổi Reader sang trạng thái mượn sách chỉ bằng 1 click từ Reservation.
- [ ] Danh sách Reader được phân loại đúng.

# Phase 04: Reader Overdue Profile
Status: ✅ Complete

## Objective
Hiển thị thống kê quá hạn và tổng tiền phạt trong hồ sơ độc giả.

## Implementation Steps
1. [x] [BACKEND] Cập nhật `UserService.getUserById` để trả về `totalFine` và `overdueCount`.
2. [x] [FRONTEND] Cập nhật `ReaderDetailDrawer` để hiển thị Stats Card: Active Loans, Overdue Items, Total Fine Paid.
3. [x] [FRONTEND] Hiển thị Badge Overdue và số ngày trễ cho từng đầu sách trong hồ sơ.

## Test Criteria
- Mở Profile của Reader đang nợ sách, phải thấy tổng số tiền phạt hiện lên.

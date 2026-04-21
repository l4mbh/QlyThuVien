# Phase 02: Backend Logic
Status: ✅ Complete

## Objective
Triển khai logic tính toán tiền phạt tại thời điểm trả sách và lưu vào Transaction.

## Implementation Steps
1. [x] [BACKEND] Cập nhật `backend/src/services/borrow/borrow.service.ts`:
   - Viết helper `calculateFine(dueDate: Date, returnedAt: Date): number`.
   - Trong `returnBook`, tính `fineAmount` trước khi update.
   - Thêm `fineAmount` vào câu lệnh `tx.borrowItem.update`.
2. [x] [BACKEND] Đảm bảo API response trả về cả `fineAmount` của item vừa được cập nhật.

## Test Criteria
- Gọi API trả sách quá hạn và kiểm tra cột `fine_amount` trong Database.
- Gọi API trả sách đúng hạn và đảm bảo `fine_amount` là 0 hoặc null.

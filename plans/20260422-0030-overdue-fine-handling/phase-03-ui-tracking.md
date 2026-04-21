# Phase 03: UI Tracking & Highlights
Status: ✅ Complete

## Objective
Cập nhật giao diện danh sách mượn và chi tiết phiếu mượn để cảnh báo quá hạn.

## Implementation Steps
1. [x] [FRONTEND] Tạo `frontend/src/features/borrow/utils/fine-utils.ts` chứa logic tính phí chung.
2. [x] [FRONTEND] Cập nhật `frontend/src/features/borrow/components/borrow-columns.tsx`:
   - Highlight đỏ cho dòng quá hạn.
   - Hiển thị Badge "Overdue" kèm số ngày.
3. [x] [FRONTEND] Cập nhật `frontend/src/features/borrow/components/borrow-detail-drawer/borrow-detail-drawer.tsx`:
   - Trong Modal xác nhận trả sách, hiển thị tiền phạt nếu có.
   - Hiển thị `fineAmount` đã chốt cho các sách đã trả.

## Test Criteria
- Truy cập trang Borrow, các dòng quá hạn phải có màu sắc cảnh báo.
- Bấm "Return" sách quá hạn, UI phải hiện số tiền phạt đúng (ví dụ 15,000 cho 3 ngày).

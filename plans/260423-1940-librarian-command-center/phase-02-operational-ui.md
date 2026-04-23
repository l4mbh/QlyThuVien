# Phase 02: Operational Reports UI
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Xây dựng giao diện cho trục Vận hành, giúp thủ thư biết chính xác công việc cần xử lý hàng ngày.

## Requirements
### Functional
- [ ] Layout Tabs cho trang Reports (Operations | Collection).
- [ ] Component `DailyOperationsTable`: Hiển thị log mượn/trả hôm nay.
- [ ] Component `OverdueActionTable`: Danh sách người mượn quá hạn, hỗ trợ màu sắc cảnh báo.
- [ ] Tích hợp API từ Phase 01.

## Implementation Steps
1. [ ] Cập nhật `ReportsPage.tsx` để hỗ trợ Tabs.
2. [ ] Tạo thư mục `frontend/src/features/reports/components/operations/`.
3. [ ] Xây dựng `OverdueActionTable` sử dụng Generic DataTable.
4. [ ] Thêm logic hiển thị màu sắc dựa trên số ngày trễ hạn.

## Files to Create/Modify
- `frontend/src/features/reports/pages/reports-page.tsx`
- `frontend/src/features/reports/components/operations/overdue-action-table.tsx`
- `frontend/src/features/reports/components/operations/daily-desk-summary.tsx`

## Test Criteria
- [ ] Chuyển đổi giữa các Tabs mượt mà.
- [ ] Bảng quá hạn hiển thị đúng màu Đỏ cho sách trễ > 7 ngày.

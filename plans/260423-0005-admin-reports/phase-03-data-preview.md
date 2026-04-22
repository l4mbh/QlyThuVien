# Phase 03: Data Preview Components
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Xây dựng các bảng (Table) và thẻ thông tin (Summary Cards) để hiển thị kết quả báo cáo trên Web.

## Requirements
### Functional
- [ ] Thành phần hiển thị Monthly Report (Table + Rates Metrics).
- [ ] Thành phần hiển thị Inventory Report (với Category Chart/Table).
- [ ] Thành phần hiển thị Reader Activity (Highlight đỏ cho Blocked/Overdue).
- [ ] Layout print-friendly (ẩn sidebar/header khi in).

## Implementation Steps
1. [ ] Tạo các Sub-components trong `src/features/reports/components/`.
2. [ ] Áp dụng style thống nhất với Dashboard (8px grid, Clean flat design).
3. [ ] Xử lý trạng thái Loading và Empty (khi không có dữ liệu cho tháng đã chọn).

## Files to Create/Modify
- `frontend/src/features/reports/components/monthly-preview.tsx`
- `frontend/src/features/reports/components/inventory-preview.tsx`
- `frontend/src/features/reports/components/reader-preview.tsx`
- `frontend/src/features/reports/components/fine-preview.tsx`

## Test Criteria
- [ ] Dữ liệu hiển thị đúng định dạng (Tiền tệ VND, Ngày tháng ISO -> Local).
- [ ] UI responsive trên các kích thước màn hình.

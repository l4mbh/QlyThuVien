# Phase 02: Reports UI Shell & Filters
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Xây dựng trang `/reports` và các thành phần lọc (Filters) trên Frontend.

## Requirements
### Functional
- [ ] Tạo `ReportsPage` component.
- [ ] Xây dựng Sidebar menu item mới cho Reports (chỉ Admin).
- [ ] Tạo bộ lọc Month/Year picker (dùng Radix UI hoặc Select chuẩn).
- [ ] Nút "Generate Report" để bắt đầu fetch dữ liệu.

## Implementation Steps
1. [ ] Cấu hình Route mới `/reports` trong `AppRouter.tsx`.
2. [ ] Tạo thư mục `src/features/reports/`.
3. [ ] Xây dựng giao diện Layout cho trang Báo cáo.
4. [ ] Implement logic lưu trữ trạng thái Filter (Selected Month, Report Type).

## Files to Create/Modify
- `frontend/src/features/reports/reports-page/reports-page.tsx`
- `frontend/src/routes/AppRouter.tsx`
- `frontend/src/components/layout/Sidebar.tsx`

## Test Criteria
- [ ] Admin click vào menu "Reports" ra đúng trang.
- [ ] Thay đổi filter cập nhật đúng trạng thái trong code.

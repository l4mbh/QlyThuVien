# Phase 01: Backend Analytics API
Status: ⬜ Pending
Dependencies: None

## Objective
Bổ sung các API endpoints mới để cung cấp dữ liệu chuyên sâu cho 2 trục Vận hành và Quản lý Kho. Tận dụng Prisma Aggregations để tính toán số liệu nhanh chóng.

## Requirements
### Functional
- [ ] Endpoint `GET /reports/daily-operations`: Thống kê mượn/trả trong ngày.
- [ ] Endpoint `GET /reports/actionable-overdue`: Danh sách sách trễ hạn kèm thông tin người mượn.
- [ ] Endpoint `GET /reports/collection-health`: Tính toán Dead stock (sách > 6 tháng không mượn) và Best-sellers.
- [ ] Endpoint `GET /reports/financial-logs`: Lịch sử thu tiền phạt theo thời gian.

## Implementation Steps
1. [ ] Cập nhật `report.service.ts` với các hàm tính toán mới.
2. [ ] Định nghĩa DTOs cho các báo cáo mới trong `backend/src/types/report/`.
3. [ ] Đăng ký các routes mới trong `report.routes.ts`.
4. [ ] Viết Unit Test/Integration Test cho các hàm aggregation phức tạp.

## Files to Create/Modify
- `backend/src/services/report/report.service.ts`
- `backend/src/routes/report/report.routes.ts`
- `backend/src/types/report/report.entity.ts`

## Test Criteria
- [ ] API trả về đúng số lượng mượn/trả trong ngày.
- [ ] Danh sách quá hạn tính toán đúng số tiền phạt (fineAmount) dự kiến.
- [ ] Dead stock trả về đúng các sách có `updatedAt` của BorrowItem > 6 tháng trước hoặc chưa từng được mượn.

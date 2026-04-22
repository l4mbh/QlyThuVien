# Phase 01: Backend Report Intelligence
Status: ⬜ Pending
Dependencies: None

## Objective
Nâng cấp `ReportService` và `ReportController` để hỗ trợ truy vấn dữ liệu báo cáo theo mốc thời gian (Month/Year hoặc Date Range).

## Requirements
### Functional
- [ ] Implement `DateHelper` để fix Timezone `Asia/Ho_Chi_Minh` (00:00:00 - 23:59:59).
- [ ] `getMonthlyReport`: 
    - Borrows (by `createdAt`)
    - Returns (by `returnedAt`)
    - Overdue phát sinh (`dueDate` in month + logic rủi ro)
    - Fines (tổng hợp từ Returns trong tháng).
- [ ] Tính toán `returnRate` và `overdueRate` phía Backend.
- [ ] `getInventoryReport`: `total`, `available`, `borrowed` (total - available), `byCategory`.
- [ ] `getReaderReport`: Thêm `nearLimitReaders` và `blockedReaders`.

### Non-Functional
- [ ] Hiệu năng: Sử dụng `Promise.all` và Indexing cho các cột ngày tháng.
- [ ] Chính xác: Xử lý múi giờ (Timezone) đồng nhất.

## Implementation Steps
1. [ ] Cập nhật `report.entity.ts` với các Interface mới cho Báo cáo.
2. [ ] Viết logic truy vấn chi tiết trong `ReportService`.
3. [ ] Cập nhật `ReportController` để nhận Query Params từ URL.
4. [ ] Cập nhật `report.routes.ts` (nếu cần endpoints mới).

## Files to Create/Modify
- `backend/src/services/report/report.service.ts`
- `backend/src/controllers/report/report.controller.ts`
- `backend/src/types/report/report.entity.ts`

## Test Criteria
- [ ] Gọi API với tham số tháng cụ thể trả về đúng số liệu trong tháng đó.
- [ ] Dữ liệu không bị lặp hoặc sót giữa các mốc thời gian.

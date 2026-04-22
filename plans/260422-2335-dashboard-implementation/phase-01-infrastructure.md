# Phase 01: Infrastructure Setup
Status: ⬜ Pending
Dependencies: None

## Objective
Thiết lập cấu trúc thư mục và các lớp nền tảng (Base layers) cho module Dashboard ở cả Backend và Frontend.

## Requirements
### Functional
- Tạo Service layer riêng cho Reports ở Backend.
- Định nghĩa các Route `/reports` mới.
- Tạo thư mục Feature Dashboard ở Frontend.

## Implementation Steps
### Backend
1. [ ] Tạo `src/services/report/report.service.ts`.
2. [ ] Tạo `src/modules/report/report.controller.ts`.
3. [ ] Đăng ký route `/reports` trong `src/routes/index.ts`.
4. [ ] Định nghĩa `DashboardSummary` interfaces trong `src/types/report/`.

### Frontend
1. [ ] Tạo thư mục `src/features/dashboard/`.
2. [ ] Tạo `dashboard.service.ts` để gọi API reports.
3. [ ] Đăng ký route `/dashboard` trong App Router.

## Test Criteria
- [ ] Endpoint `/reports/summary` trả về status 200 (mặc dù data có thể là mock).
- [ ] Route `/dashboard` hiển thị trang trắng mà không lỗi.

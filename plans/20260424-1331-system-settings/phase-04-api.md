# Phase 04: API Endpoints
Status: ⬜ Pending

## Objective
Mở các cổng kết nối để Frontend có thể lấy và cập nhật Settings.

## Implementation Steps
1. [ ] [NEW] `apps/api/src/controllers/settings/settings.controller.ts`: Handle request/response.
2. [ ] [NEW] `apps/api/src/routes/settings/settings.routes.ts`: Định nghĩa route `/api/settings` (Cần bảo vệ bằng middleware Admin).
3. [ ] [MODIFY] `apps/api/src/routes/index.ts`: Mount settings routes.

## Test Criteria
- [ ] `GET /api/settings` trả về danh sách đầy đủ.
- [ ] `PATCH /api/settings/:key` cập nhật thành công (Test bằng Postman/Thunder Client).
- [ ] User không phải Admin không được phép gọi các API này.

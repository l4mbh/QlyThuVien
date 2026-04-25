# Phase 06: Automation & Testing
Status: ⬜ Pending
Dependencies: Phase 02, Phase 03

## Objective
Triển khai cơ chế tự động dọn dẹp hàng đợi và kiểm thử các kịch bản cạnh tranh (Race Condition).

## Implementation Steps
1. [ ] **Cron Job Implementation**:
   - Viết script quét các bản ghi `READY` đã quá `expiresAt`.
   - Chuyển thành `EXPIRED`.
   - Cộng lại `availableQuantity`.
   - Gọi `promoteNext`.
2. [ ] **Notification System**:
   - Tích hợp bắn thông báo khi status chuyển sang `READY` hoặc `EXPIRED`.
3. [ ] **Stress/Race Condition Test**:
   - Giả lập 10 người cùng đặt 1 quyển sách cuối cùng để check tính nhất quán của `availableQuantity`.

## Files to Create/Modify
- `apps/api/src/jobs/reservation-cleanup.ts` [NEW]
- `apps/api/src/services/notification/notification.service.ts` [MODIFY]

## Test Criteria
- [ ] Các bản ghi quá hạn được dọn dẹp tự động mỗi giờ.
- [ ] Không có trường hợp 2 người cùng được READY cho 1 quyển sách duy nhất.

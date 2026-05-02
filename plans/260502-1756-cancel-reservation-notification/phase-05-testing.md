# Phase 05: Testing & Integration
Status: ⬜ Pending
Dependencies: Phase 04

## Objective
Kiểm thử toàn bộ flow để đảm bảo tính năng chạy mượt mà.

## Requirements
### Functional
- [ ] Test trường hợp cancel với các preset reason.
- [ ] Test trường hợp cancel với "Other" reason (kiểm tra validation require note).
- [ ] Mở ứng dụng Reader để kiểm tra thông báo tới.

## Implementation Steps
1. [ ] Step 1 - Chạy các app `api`, `web`, `reader`.
2. [ ] Step 2 - Admin tạo reservation mới rồi tiến hành huỷ, điền lý do đầy đủ.
3. [ ] Step 3 - Kiểm tra log backend xem notification và audit log có ghi nhận.
4. [ ] Step 4 - Reader đăng nhập, xem thông báo có đẩy xuống qua SSE/Polling không.

## Test Criteria
- [ ] Dữ liệu db lưu đủ cả `cancelReason` và `cancelNote`.
- [ ] Reader trải nghiệm flow không bị lỗi.

---
End of Plan

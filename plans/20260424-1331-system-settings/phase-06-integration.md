# Phase 06: Integration & Testing
Status: ⬜ Pending

## Objective
Kết nối toàn bộ hệ thống và kiểm thử các kịch bản cuối cùng.

## Implementation Steps
1. [ ] [REPLACE] Thay thế các đoạn code đang hardcode (Ví dụ: `FINE_PER_DAY = 5000`) bằng cách gọi `settingService.get("FINE_PER_DAY")`.
2. [ ] [TEST] Chạy quy trình mượn sách -> quá hạn -> trả sách để check tiền phạt theo giá trị mới.
3. [ ] [TEST] Check Audit Logs để đảm bảo mọi thay đổi cấu hình đều được ghi lại.

## Test Criteria
- [ ] Toàn bộ app không còn giá trị cấu hình hardcode.
- [ ] Logic mượn trả hoạt động chính xác theo cấu hình mới.

# Phase 05: Integration & RBAC
Status: ⬜ Pending
Dependencies: Phase 02, Phase 04

## Objective
Kết nối Frontend với Backend và thực hiện phân quyền Role-based Access Control.

## Implementation Steps
1. [ ] Thực hiện API calls thực tế thay cho mock data.
2. [ ] Backend: Thêm logic kiểm tra Role trong Report Controller (Ẩn `totalFines` nếu không phải ADMIN).
3. [ ] Frontend: Ẩn/Hiện `FineCard` dựa trên role của User trong Auth Context.
4. [ ] Xử lý trạng thái Loading (Skeleton screens) cho Dashboard.

## Test Criteria
- [ ] Staff đăng nhập KHÔNG thấy thông tin tiền phạt.
- [ ] Admin đăng nhập thấy đầy đủ thông tin.
- [ ] Skeleton hiển thị mượt mà khi đang load data.

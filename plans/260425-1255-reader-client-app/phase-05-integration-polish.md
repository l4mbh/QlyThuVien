# Phase 05: API Integration & Polish
Status: ⬜ Pending
Dependencies: Phase 04

## Objective
Hoàn thiện logic, hiệu ứng Loading Skeleton và kết nối dữ liệu.

## Implementation Steps
1. [ ] Build `SkeletonLoading`: Sử dụng hiệu ứng pulse màu nhạt của Admin.
2. [ ] API Integration:
   - Thừa hưởng các DTO và Schema từ `@qltv/shared`.
   - Xử lý lỗi (Error handling) hiển thị qua Sonner (Toast) với style đồng bộ Admin.
3. [ ] Polish: Đảm bảo khoảng cách (Margin/Padding) nhất quán toàn bộ app.

## Files to Create/Modify
- `apps/reader/src/components/ui/Skeleton.tsx` - [New]
- `apps/reader/src/lib/utils.ts` - [New] Copy từ Admin để dùng `cn` helper.

## Test Criteria
- [ ] Toast thông báo hiển thị đúng góc và màu sắc của Admin.
- [ ] Trạng thái Loading không làm vỡ layout.

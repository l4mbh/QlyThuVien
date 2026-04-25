# Phase 01: Setup & Layout Foundation (Mobile-focused)
Status: ⬜ Pending
Dependencies: None

## Objective
Thiết lập cấu trúc dự án `apps/reader` với trọng tâm là thanh điều hướng phía dưới (Bottom Navigation) thay vì Header truyền thống.

## Implementation Steps
1. [ ] Khởi tạo project React + Vite trong `apps/reader`.
2. [ ] Cấu hình Tailwind CSS đồng bộ Admin (Primary Blue `#1E3A8A`).
3. [ ] Build `MainLayout` với **Floating Bottom Navigation**:
   - Thiết kế 5 Tabs bo tròn.
   - Nút **Home (Chính giữa)**: Thiết kế nổi bật (Raised hoặc màu sắc khác biệt) để làm trung tâm của mọi thao tác.
4. [ ] Header tóm gọn: Chỉ để tiêu đề trang hiện tại (ví dụ: "Explore", "My Books") để tối ưu không gian hiển thị nội dung.
5. [ ] Cấu hình routing cho 5 khu vực chính.

## Files to Create/Modify
- `apps/reader/src/components/layout/BottomNav.tsx` - [New] Trung tâm điều hướng.
- `apps/reader/src/components/layout/MainLayout.tsx` - [Modify] Tối ưu không gian cho mobile.

## Test Criteria
- [ ] Các icon trên thanh điều hướng dễ bấm bằng ngón cái.
- [ ] Nút chính giữa hiển thị nổi bật và thu hút thị giác.
- [ ] Header không chiếm quá nhiều diện tích (chỉ khoảng 50-60px).

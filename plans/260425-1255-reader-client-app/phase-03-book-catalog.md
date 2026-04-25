# Phase 03: Book Grid & Detail Modal
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Triển khai danh sách sách và Modal chi tiết theo ngôn ngữ thiết kế của Admin (Card-based, Clean Typography).

## Implementation Steps
1. [ ] Build `BookCard` component:
   - Sử dụng Card component từ shadcn/ui.
   - Title: Semibold, Text Primary.
   - Status Badge: Available (Success Blue/Green) / Out of stock (Destructive Red).
   - CTA Button: "View Details" (Outline hoặc Ghost style).
2. [ ] Build `BookGrid`:
   - Grid 2 cột mobile linh hoạt.
3. [ ] Build `BookDetailModal`:
   - Đồng bộ style Modal (Overlay, Padding, Radius) với các Modal của bản Admin.
   - Nút "Borrow" sử dụng Primary Blue (Solid).

## Files to Create/Modify
- `apps/reader/src/features/books/components/BookCard.tsx` - [New]
- `apps/reader/src/features/books/components/BookDetailModal.tsx` - [New]

## Test Criteria
- [ ] Card sách có độ bo góc 12px chuẩn.
- [ ] Badge trạng thái có màu sắc đồng bộ với hệ thống thông báo lỗi/thành công của Admin.

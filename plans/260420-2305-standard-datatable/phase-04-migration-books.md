# Phase 04: Migration - Books
Status: ⬜ Pending
Dependencies: Phase 01, Phase 02, Phase 03

## Objective
Chuyển đổi trang Quản lý Sách sang hệ thống DataTable, hỗ trợ các bộ lọc chuyên sâu và hiển thị dữ liệu phức tạp.

## Tasks
- [ ] **Task 1: Cập nhật Book API ở Frontend**
  - Chỉnh sửa `src/features/books/book.service.ts`.
  - Hỗ trợ đầy đủ params: `page`, `limit`, `search`, `categoryId`, `available`, `sort`.
- [ ] **Task 2: Định nghĩa Columns cho Books**
  - Tạo `src/features/books/components/book-columns.tsx`.
  - Hiển thị thông tin sách chuyên nghiệp: Ảnh bìa (nếu có), Tên sách, Tác giả, Thể loại (Badge), Số lượng (Indicator), Trạng thái.
- [ ] **Task 3: Refactor Book Management**
  - Chuyển đổi trang Sách sang dùng `DataTable`.
- [ ] **Task 4: Advanced Toolbar Filters**
  - Tích hợp thêm các bộ lọc vào `DataTableToolbar`: 
    - Dropdown chọn Thể loại.
    - Toggle chọn trạng thái (Còn sách/Hết sách).
- [ ] **Task 5: Bulk Actions & Export**
  - Xử lý xóa nhiều sách.
  - Tích hợp tính năng Export dữ liệu ra file Excel/CSV (nếu cần).

## Success Metrics
- Trang Quản lý Sách hoạt động với bộ lọc đa điều kiện.
- Phân trang server-side xử lý hàng nghìn đầu sách mà không lag.
- UI/UX đồng nhất hoàn toàn với trang Categories.

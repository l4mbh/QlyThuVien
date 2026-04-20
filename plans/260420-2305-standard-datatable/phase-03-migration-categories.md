# Phase 03: Migration - Categories
Status: 🟡 In Progress
Dependencies: Phase 01, Phase 02

## Objective
Thay thế trang Quản lý Danh mục hiện tại bằng hệ thống DataTable chuẩn hóa, hỗ trợ phân trang server-side và tìm kiếm.

## Tasks
- [x] **Task 1: Cập nhật Category API ở Frontend**
  - Chỉnh sửa `src/features/categories/category.service.ts`.
  - Hỗ trợ truyền params: `page`, `limit`, `search`.
- [x] **Task 2: Định nghĩa Columns cho Categories**
  - Tạo `src/features/categories/components/category-columns.tsx`.
  - Định nghĩa các cột: Checkbox (chọn dòng), ID, Tên, Mã, Ngày tạo, Actions (Sửa/Xóa).
- [x] **Task 3: Refactor CategoryTable**
  - Chuyển `src/features/categories/CategoryTable.tsx` sang dùng component `DataTable`.
  - Kết nối logic với hook `useDataTable`.
- [x] **Task 4: Tích hợp Bulk Actions**
  - Xử lý logic xóa nhiều danh mục cùng lúc.
  - Hiển thị thông báo xác nhận trước khi xóa.

## Success Metrics
- Trang Categories hiển thị đúng dữ liệu phân trang từ Backend.
- Tìm kiếm hoạt động mượt mà (có debounce).
- Có thể chọn nhiều dòng và thực hiện xóa hàng loạt.

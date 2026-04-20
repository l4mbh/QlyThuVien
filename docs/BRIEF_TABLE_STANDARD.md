# 💡 BRIEF: Standardized Generic DataTable & API Pagination

**Ngày tạo:** 2026-04-20
**Mục tiêu:** Xây dựng hệ thống Table và Pagination chuẩn hóa cho toàn bộ dự án LibMgnt.

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
- Hiện tại mỗi trang (Books, Categories) đang phải code lại logic tìm kiếm, sắp xếp và UI Table.
- Chưa có hệ thống phân trang (Pagination), gây hiệu năng kém khi dữ liệu lớn.
- Thiếu sự đồng nhất về cấu trúc dữ liệu trả về từ Backend.

## 2. GIẢI PHÁP ĐỀ XUẤT
- **Backend**: Xây dựng helper hoặc base repository hỗ trợ phân trang tự động. Chuẩn hóa `ApiResponse` có kèm `meta`.
- **Frontend**: Xây dựng một Generic Component `DataTable<T>` sử dụng **TanStack Table**:
    - Tự động quản lý State: Loading, Sorting, Pagination, Selection.
    - Tìm kiếm Debounce (đợi người dùng dừng gõ 500ms mới gọi API).
    - Tích hợp sẵn Confirmation Dialog cho hành động Xóa.
    - Hỗ trợ Bulk Actions (Xóa nhiều mục đã chọn).

## 3. CẤU TRÚC DỮ LIỆU CHUẨN

### 🚀 API Response
```json
{
  "data": {
    "items": [],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  },
  "code": 0
}
```

### 🚀 API Request (Query Params)
`?page=1&limit=10&search=...&sort=...`

## 4. TÍNH NĂNG CHÍNH (MVP)
- [ ] **DataTable Component**: Nhận `columns` và `onFetch` làm đầu vào.
- [ ] **Pagination Control**: Thanh điều hướng trang ở phía dưới bảng.
- [ ] **Global Action Bar**: Hiển thị khi có ít nhất 1 dòng được chọn (Bulk Delete, Export...).
- [ ] **Configurable Toolbar**: Cho phép bật/tắt các nút Export, Import thông qua props (`showExport`, `showImport`).
- [ ] **Auto-refresh**: Tự động tải lại dữ liệu sau khi thêm/sửa/xóa thành công.

## 5. KẾ HOẠCH TRIỂN KHAI
1. Chạy `/plan` để thiết kế chi tiết các Generic Types.
2. Nâng cấp Backend Base Logic.
3. Cài đặt `@tanstack/react-table`.
4. Xây dựng Component `DataTable` mẫu.
5. Áp dụng cho trang Categories (làm demo) sau đó là Books.

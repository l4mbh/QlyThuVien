# Changelog

Tất cả các thay đổi quan trọng của dự án sẽ được ghi lại tại đây.

## [2026-04-20]
### Added
- **Module Category**: Quản lý danh mục sách, hỗ trợ tự động gán mã danh mục (Category Code).
- **Service ISBN**: Tích hợp Google Books API và OpenLibrary API để tự động lấy thông tin sách qua mã ISBN.
- **API Endpoint**: `GET /api/books/fetch-isbn/:isbn` - Trích xuất dữ liệu sách từ internet.
- **Database Schema**: Thêm bảng `Category` và liên kết với bảng `Book`.
- **Error Handling**: Thêm mã lỗi và tin nhắn thông báo cho Module Category.
- **Data Seeding**: Cập nhật seed script để tạo dữ liệu mẫu cho Categories.

### Changed
- Cập nhật cấu trúc thư mục backend để bao gồm modules `category` và `isbn`.
- Cải thiện `BookService` để hỗ trợ gán Category khi tạo sách mới.

## [2026-04-19]
### Added
- Hệ thống Authentication (Login, Register, JWT).
- Protected Routes trên Frontend.
- Role-based UI (Admin/Staff).

### Fixed
- Lỗi kết nối Database (P1000).
- Lỗi TypeScript Enum với config `erasableSyntaxOnly`.

# API Documentation (Full System)

Ngày cập nhật: 25/04/2026
Base URL: `http://localhost:3000/api/v1`

---

## 🆔 Authentication & Security

### 1. JWT Authentication (Staff/Admin)
Dùng cho Dashboard Admin. Gửi token trong header:
`Authorization: Bearer {token}`

### 2. Phone-first Identity (Reader)
Dùng cho App Reader. Gửi SĐT trong header:
`X-Reader-Phone: {phone_number}`

---

## 🛠 Admin Management (Staff/Admin Only)

### 📚 Books
- **GET /books**: Lấy danh sách sách (hỗ trợ phân trang, tìm kiếm, lọc theo thể loại).
- **POST /books**: Thêm sách mới (tự động cập nhật `availableQuantity`).
- **PATCH /books/:id**: Cập nhật thông tin sách.
- **DELETE /books**: Xóa sách (hỗ trợ Bulk Delete qua `ids` trong body).

### 🏷 Categories
- **GET /categories**: Lấy danh sách thể loại.
- **POST /categories**: Tạo thể loại mới (tự sinh mã code).
- **DELETE /categories**: Xóa thể loại (Bulk Delete).

### 👥 Readers
- **GET /users?role=READER**: Lấy danh sách người đọc.
- **GET /users/lookup?phone={phone}**: Tra cứu Reader nhanh bằng SĐT (dùng cho POS borrowing).
- **PATCH /users/:id**: Cập nhật thông tin, giới hạn mượn hoặc khóa tài khoản Reader.

### 🔄 Borrowing (Librarian POS)
- **POST /borrows**: Tạo giao dịch mượn mới (Cart-based).
- **POST /borrows/return**: Xử lý trả sách, tính toán tiền phạt tự động dựa trên cấu hình.
- **GET /borrows**: Xem toàn bộ lịch sử mượn trả hệ thống.

### 📈 Reports & Dashboard
- **GET /reports/dashboard**: Thống kê tổng quan (Bento Grid data).
- **GET /reports/inventory**: Báo cáo sức khỏe kho sách (Low stock, Dead stock).
- **GET /reports/finance**: Báo cáo doanh thu tiền phạt.

---

## 📱 Reader Features (Client App)

### 🔍 Discovery
- **GET /books**: Tìm kiếm sách công khai.
- **GET /categories**: Xem danh mục sách.

### 📖 Personal Shelf
- **GET /borrows/my**: Xem danh sách sách đang mượn và lịch sử cá nhân.
- **Headers:** `X-Reader-Phone: {phone}`

### 🔔 Notifications
- **GET /notifications**: Nhận thông báo thời gian thực về hạn trả sách, tin nhắn từ thư viện.
- **PATCH /notifications/:id/read**: Đánh giá đã đọc thông báo.

---

## ⚙️ System Configuration (Admin Only)

### 🔧 Settings
- **GET /settings**: Lấy toàn bộ cấu hình (Borrow limit, Fine per day, Maintenance mode...).
- **PATCH /settings/:key**: Cập nhật cấu hình hệ thống (có ghi Audit Log).
- **GET /system/status**: (Public) Kiểm tra trạng thái bảo trì.

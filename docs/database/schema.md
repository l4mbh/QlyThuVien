# Database Schema Documentation

Ngày cập nhật: 20/04/2026

## Tổng quan
Hệ thống sử dụng PostgreSQL để quản lý dữ liệu. Các bảng được thiết kế để hỗ trợ nghiệp vụ quản lý thư viện, mượn trả sách và quản lý người dùng.

## 📊 Sơ đồ quan hệ
- **User** (1) <-> (N) **BorrowRecord**
- **BorrowRecord** (1) <-> (N) **BorrowItem**
- **Book** (1) <-> (N) **BorrowItem**
- **Category** (1) <-> (N) **Book**

---

## 📂 Danh sách các bảng

### 1. `users`
Lưu trữ thông tin người dùng (Admin, Staff, Reader).
| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Khóa chính |
| name | String | Tên người dùng |
| email | String | Email (Unique) |
| password | String | Mật khẩu đã hash |
| role | Enum (ADMIN, STAFF) | Quyền truy cập |
| status | Enum (ACTIVE, BLOCKED) | Trạng thái tài khoản |
| borrowLimit | Int | Số lượng sách tối đa được mượn |
| currentBorrowCount | Int | Số lượng sách đang mượn hiện tại |

### 2. `categories`
Phân loại sách.
| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Khóa chính |
| name | String | Tên danh mục |
| code | String | Mã danh mục (phục vụ Call Number) |

### 3. `books`
Thông tin chi tiết về sách.
| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Khóa chính |
| title | String | Tên sách |
| author | String | Tác giả |
| isbn | String | Mã ISBN (Unique) |
| totalQuantity | Int | Tổng số lượng nhập về |
| availableQuantity | Int | Số lượng còn lại trong kho |
| categoryId | String | Liên kết tới Category |
| callNumber | String | Số hiệu sách trên kệ |
| coverUrl | String | URL ảnh bìa sách |
| isArchived | Boolean | Đánh dấu sách đã lưu trữ/hủy |

### 4. `borrow_records`
Phiếu mượn sách.
| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Khóa chính |
| userId | String | Độc giả mượn sách |
| borrowDate | DateTime | Ngày mượn |
| dueDate | DateTime | Hạn trả |
| status | Enum | Trạng thái phiếu (BORROWING, OVERDUE, COMPLETED) |

### 5. `borrow_items`
Chi tiết từng cuốn sách trong phiếu mượn.
| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Khóa chính |
| borrowRecordId | String | Liên kết tới BorrowRecord |
| bookId | String | Cuốn sách được mượn |
| status | Enum | Trạng thái (BORROWING, RETURNED, OVERDUE) |
| borrowedAt | DateTime | Thời điểm mượn |
| returnedAt | DateTime | Thời điểm trả thực tế |

# API Documentation

Ngày cập nhật: 20/04/2026
Base URL: `http://localhost:3000/api`

---

## 🔐 Authentication (`/auth`)

### POST `/auth/register`
Đăng ký tài khoản mới.
**Request:** `{ name, email, password }`
**Response:** `{ data: { user, token }, code: 0 }`

### POST `/auth/login`
Đăng nhập.
**Request:** `{ email, password }`
**Response:** `{ data: { user, token }, code: 0 }`

### GET `/auth/me`
Lấy thông tin profile hiện tại (yêu cầu JWT).
**Response:** `{ data: user, code: 0 }`

---

## 📚 Books (`/books`)

### GET `/books`
Lấy danh sách sách.

### POST `/books`
Thêm sách mới.

### GET `/books/fetch-isbn/:isbn`
Lấy thông tin sách từ nguồn bên ngoài (Google Books/OpenLibrary).
**Response:** `{ data: { title, author, category, publishedYear, coverUrl }, code: 0 }`

---

## 📂 Categories (`/categories`)

### GET `/categories`
Lấy danh sách danh mục sách.

---

## 👤 Users (`/users`)

### GET `/users`
Lấy danh sách người dùng (Chỉ Admin).

---

## 🤝 Borrowing (`/borrow`)

### POST `/borrow`
Tạo phiếu mượn sách.

### POST `/borrow/return`
Trả sách.

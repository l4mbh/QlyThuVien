# API Documentation

Updated: 2026-04-20
Base URL: `http://localhost:3000/api`

---

## 🔐 Authentication (`/auth`)

### POST `/auth/register`
Register new account.
**Request:** `{ name, email, password }`
**Response:** `{ data: { user, token }, code: 0 }`

### POST `/auth/login`
Login to system.
**Request:** `{ email, password }`
**Response:** `{ data: { user, token }, code: 0 }`

### GET `/auth/me`
Get current user profile (JWT required).
**Response:** `{ data: user, code: 0 }`

---

## 📚 Books (`/books`)

### GET `/books`
List books with filters (search, categoryId, available, sort).
**Params:** `page`, `limit`, `search`, `categoryId`, `available`, `sort`
**Response:** `{ data: BookEntity[], meta: { total, totalPages, page, limit }, code: 0 }`

### POST `/books`
Add new book.

### GET `/books/fetch-isbn/:isbn`
Smart fetch book info from external APIs.
**Response:** `{ data: { title, author, category, publishedYear, coverUrl }, code: 0 }`

---

## 📂 Categories (`/categories`)

### GET `/categories`
List categories with server-side pagination/search.
**Params:** `page`, `limit`, `search`
**Response:** `{ data: CategoryEntity[], meta: { total, totalPages, page, limit }, code: 0 }`

### DELETE `/categories/bulk`
Bulk delete categories.
**Request:** `{ ids: string[] }`
**Validation:** Refuses if any category contains books.
**Response:** `{ message, code: 0 }`

---

## 👤 Users (`/users`)

### GET `/users`
List users (Admin only).

---

## 🤝 Borrowing (`/borrow`)

### POST `/borrow`
Create borrow record.

### POST `/borrow/return`
Return books.

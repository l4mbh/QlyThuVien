# API Documentation

Updated: 2026-04-22
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

### GET `/books/fetch-isbn/:isbn`
Smart fetch book info from external APIs.
**Response:** `{ data: { title, author, category, publishedYear, coverUrl }, code: 0 }`

---

## 📂 Categories (`/categories`)

### GET `/categories`
List categories with server-side pagination/search.
**Params:** `page`, `limit`, `search`
**Response:** `{ data: CategoryEntity[], meta: { total, totalPages, page, limit }, code: 0 }`

---

## 👤 Users (`/users`)

### GET `/users/:id`
Get detailed reader profile with financial stats.
**Response:** 
```json
{
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "totalFine": 25000,
    "overdueCount": 2,
    "borrowRecords": [...]
  },
  "code": 0
}
```

---

## 🤝 Borrowing (`/borrow`)

### POST `/borrow`
Create borrow record for one or multiple books.
**Request:** `{ readerId, bookIds: string[], dueDate }`
**Response:** `{ data: BorrowRecord, code: 0 }`

### POST `/borrow/return`
Process book returns and calculate fines.
**Request:** `{ borrowItemIds: string[] }`
**Logic:** 
- Calculates fine: `overdueDays * 5,000 VND`
- Updates `fineAmount` in `BorrowItem`
- Restores book stock and decrements reader's `currentBorrowCount`
**Response:** `{ message: "Books returned successfully", code: 0 }`

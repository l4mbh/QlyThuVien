# 🎨 DESIGN: Reservation & Smart Queue System (Refined)

Bản thiết kế kỹ thuật cấp độ **Product-level (98% Ready)** - Chuyển đổi sang mô hình **State + Event Driven**.

---

## 🏗️ 1. ARCHITECTURE & STATE MACHINE
Hệ thống vận hành dựa trên các sự kiện (Events) để thay đổi trạng thái (States) và điều phối hàng đợi.

### State Transitions:
- `PENDING` → `READY` (Kích hoạt bởi `promoteNext`)
- `READY` → `COMPLETED` (Staff xác nhận mượn)
- `READY` → `EXPIRED` (Hết 24h)
- `ANY` → `CANCELLED` (User/Staff hủy)

---

## 📊 2. DATABASE DESIGN (Refined)

### `Reservation` Model
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String` | Khóa chính |
| `userId` | `String` | FK tới User |
| `bookId` | `String` | FK tới Book |
| `status` | `Enum` | PENDING, READY, COMPLETED, CANCELLED, EXPIRED |
| `createdAt` | `DateTime` | Dùng để tính toán Position động |
| `expiresAt` | `DateTime?` | Deadline cho trạng thái READY |

---

## 🧠 3. CORE LOGIC (Production-ready)

### 🥇 Dynamic Position Calculation
Vị trí trong hàng đợi không được lưu cứng mà tính toán thời gian thực:
```sql
SELECT COUNT(*) + 1 
FROM Reservation 
WHERE bookId = ? AND status = 'PENDING' AND createdAt < currentUser.createdAt
```

### 🥈 Centralized Promotion (`promoteNextReservation`)
Hàm duy nhất chịu trách nhiệm đẩy hàng đợi lên. 
- **Trigger Points:** 
  1. `BorrowReturn`: Khi sách được trả về.
  2. `ReservationExpired`: Khi người ở vị trí READY bị quá hạn.
  3. `ReservationCancelled`: Khi có người trong hàng đợi hủy.
- **Logic:**
  - Tìm người đầu tiên (`createdAt` cũ nhất) có trạng thái `PENDING`.
  - Chuyển sang `READY`.
  - Set `expiresAt = now + 24h`.
  - **Soft Allocation:** `Book.availableQuantity -= 1`.

## 📱 4. UI/UX SPECIFICATIONS (Detailed)

### Client (Reader App)
- **Home/Search:** Thẻ sách hiện Badge "X people in queue" nếu hết sách.
- **Book Detail Modal:**
  - `Available` -> Nút `Reserve` (READY ngay).
  - `Out of Stock` -> Nút `Join Queue` (PENDING).
  - `Reserved` -> Hiển thị Status: `Waiting (#X)` hoặc `Ready (Expires in HH:mm)`.
- **My Books Page:** 
  - Bổ sung **Tabs Switcher**: `Loans` | `Reservations`.
  - Thẻ `Reservation` hiển thị tiến trình hàng đợi (Progress Bar hoặc Step Indicator).

### Notifications (Real-time & Inbox)
- **Type: RESERVATION_READY**:
  - Title: "Your book is ready! 📚"
  - Message: "Please pick up [Book Title] within the next 24 hours."
  - Action: Link trực tiếp tới trang chi tiết sách.
- **Type: QUEUE_UPDATE**:
  - Title: "You're moving up! ⬆️"
  - Message: "You are now #2 in line for [Book Title]."

### Admin (Staff Dashboard)
- **Reservation Center:**
  - Table view hiển thị tất cả PENDING/READY.
  - Quick Filter: "Books returned today" -> Staff dễ dàng click `Mark Ready` cho những người đang đợi.

---

## 🔌 4. API CONTRACTS (Refined)

- `POST /reservations`: Idempotent creation.
- `GET /client/reservations/my`: Trả về danh sách kèm vị trí động.
- `POST /admin/reservations/:id/ready`: Manual override/trigger.
- `POST /admin/reservations/:id/complete`: Tạo BorrowRecord & finalize.

---

## ⚙️ 5. AUTOMATION

- **Cron Job (Hourly):** 
  - Tìm các bản ghi `status: READY` và `now > expiresAt`.
  - Chuyển sang `EXPIRED`.
  - `Book.availableQuantity += 1`.
  - Gọi `promoteNextReservation(bookId)`.

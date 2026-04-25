# 💡 BRIEF: Reservation & Smart Queue System

**Ngày tạo:** 25/04/2026
**Dự án:** QLTV (Library Management System)
**Trạng thái:** Sẵn sàng triển khai

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
Hiện tại, người dùng chỉ có thể mượn sách trực tiếp tại thư viện. Nếu sách hết, họ không có cách nào để giữ chỗ hoặc xếp hàng. Điều này gây mất thời gian cho người đọc và khó quản lý cho thủ thư. Ngoài ra, việc định danh bằng SĐT cần một cơ chế phân loại người dùng để tránh "rác data".

## 2. GIẢI PHÁP ĐỀ XUẤT
Xây dựng hệ thống **Đặt sách trực tuyến (Reservation)** kết hợp với **Hàng đợi thông minh (Queue Management)**. 
- Cho phép người dùng giữ sách khi còn hàng.
- Tự động xếp hàng khi sách hết (FIFO).
- Phân loại Reader (Active vs Guest) để tối ưu hóa quản lý.

## 3. TÍNH NĂNG CHÍNH

### 🚀 Reservation Flow (Client)
- **Đặt chỗ:** Nhấn nút Reserve để giữ sách.
- **Theo dõi vị trí:** Hiển thị "Bạn đứng thứ #X trong hàng đợi".
- **Trạng thái sẵn sàng:** Thông báo khi sách đã có sẵn tại quầy và bắt đầu tính giờ (24h).

### 👨‍💼 Queue Management (Admin)
- **Reservation Dashboard:** Thủ thư xem được hàng đợi cho từng đầu sách.
- **Xử lý tại quầy:** Xác nhận mượn từ yêu cầu đặt chỗ hoặc hủy nếu quá hạn.

### 🧠 Smart Identity
- **Phân loại Reader:** Tự động đánh dấu `isGuest` và `hasActivity` dựa trên hành động thực tế.
- **Auto-promote:** Khi sách được trả, hệ thống tự động đẩy người đứng đầu hàng đợi sang trạng thái `READY`.

## 4. CHI TIẾT THIẾT KẾ (DESIGN)

### 🧩 Database Schema
- **Reservation Table:** Lưu `userId`, `bookId`, `status`, `position`, `expiresAt`.
- **User Table Extensions:** Thêm `hasActivity`, `isGuest`.

### 📱 Giao diện Client (UX)
- **Nút bấm đa trạng thái:** 
  - `Available` -> `Borrow/Reserve`.
  - `Out of Stock` -> `Join Queue`.
  - `Reserved` -> `Waiting #X`.
  - `Ready` -> `Pick up now (Ends in 24h)`.
- **Tab quản lý:** Chia mục My Books thành `Borrowing` và `Reserved`.

### ⚙️ Automation Logic
- **Cron Job:** Kiểm tra mỗi giờ để hủy các yêu cầu `READY` quá 24h mà không đến lấy.
- **Limit:** Tái sử dụng `borrowLimit` để giới hạn số lượng đặt chỗ.

---

## 5. BƯỚC TIẾP THEO
→ Triển khai `implementation_plan.md` để bắt đầu code Phase 05.

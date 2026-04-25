# Phase 04: Reader App Integration

## 🎯 Mục tiêu
Hoàn tất trải nghiệm người dùng cuối trên Reader App, cho phép truy cập thông tin mượn sách cá nhân mà không cần tài khoản phức tạp.

## 📂 Danh sách file thay đổi
- `apps/reader/src/features/auth/pages/LoginPage.tsx`: Thay đổi sang Phone login.
- `apps/reader/src/services/auth.service.ts`: Cập nhật logic nhận diện identity.
- `apps/reader/src/features/dashboard/pages/MyBooksPage.tsx`: Load data dựa trên phone.

## 🛠️ Nội dung thực hiện

### 1. Simple Auth Flow
- Reader nhập SĐT -> Lưu vào LocalStorage (Token-lite).
- Hệ thống gọi API lấy danh sách sách dựa trên SĐT định danh này.

### 2. Dashboard Update
- Hiển thị thông tin: "Xin chào [Tên]", "Sách đang mượn", "Ngày đến hạn".
- Cảnh báo Overdue nếu có.

## ✅ Build & Verification (BẮT BUỘC)
1. **End-to-End Test:**
    - Mở Reader App -> Nhập SĐT đã dùng mượn tại quầy -> Kiểm tra xem sách có hiển thị đúng không.
    - Thử nhập SĐT lạ -> Phải thấy Dashboard trống.

---
**CHỐT PHASE:** Hoàn tất hệ thống Phone-first Identity cho cả Admin và Reader.

# Phase 02: Hardened Backend Logic

## 🎯 Mục tiêu
Triển khai engine xử lý người dùng bằng SĐT một cách an toàn (Transaction safe) và cập nhật API mượn sách.

## 📂 Danh sách file thay đổi
- `apps/api/src/services/user/user.service.ts`: [NEW] findOrCreateReader logic.
- `apps/api/src/services/borrow/borrow.service.ts`: Update createBorrow logic.
- `apps/api/src/types/borrow/borrow.entity.ts`: Cập nhật DTO chấp nhận phone.

## 🛠️ Nội dung thực hiện

### 1. UserService Hardening
- Implement `findOrCreateReader(phone: string, name?: string)`:
    - Sử dụng `prisma.user.upsert` để tránh race condition khi 2 request cùng tạo 1 user.
    - Tự động gán `role: READER` và `isGuest: true`.

### 2. BorrowService Update
- Hàm `createBorrow(data)`:
    - Nếu `data` có `phone` -> Gọi `findOrCreateReader`.
    - Lấy `userId` từ kết quả trả về để tiếp tục logic mượn sách hiện tại.

## ✅ Build & Verification (BẮT BUỘC)
1. **Concurrency Test:** Viết script gọi API mượn sách 5 lần cùng lúc cho 1 SĐT chưa tồn tại. Phải đảm bảo chỉ có 1 User được tạo và không có lỗi Crash DB.
2. **Logic Test:** Gọi API `/borrow` với SĐT -> Kiểm tra record trong DB xem có map đúng User ID không.

---
**CHỐT PHASE:** Backend đã xử lý trơn tru mọi yêu cầu mượn sách bằng SĐT.

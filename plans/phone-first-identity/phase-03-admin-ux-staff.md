# Phase 03: Admin UX & Staff Flow

## 🎯 Mục tiêu
Tối ưu hóa quy trình làm việc của Thủ thư tại quầy bằng cách tích hợp kiểm tra trạng thái User ngay khi nhập SĐT.

## 📂 Danh sách file thay đổi
- `apps/api/src/controllers/user/user.controller.ts`: Endpoint `GET /check?phone=...`.
- `apps/web/src/features/borrow/components/BorrowModal.tsx`: Cập nhật form.
- `apps/web/src/hooks/useUserStatus.ts`: [NEW] Hook gọi API check status.

## 🛠️ Nội dung thực hiện

### 1. User Status API
- Trả về: `{ exists, name, currentBorrowCount, overdue: boolean, borrowLimit }`.

### 2. Admin UI Hardening
- Khi Staff nhập SĐT:
    - Hiển thị thông tin Reader ngay lập tức.
    - Cảnh báo màu đỏ nếu User đang nợ sách hoặc hết lượt mượn.
    - **Block Action:** Vô hiệu hóa nút "Xác nhận mượn" nếu User vi phạm luật thư viện.
- Nếu User chưa tồn tại: Hiện input nhập Tên nhanh (Quick Create).

## ✅ Build & Verification (BẮT BUỘC)
1. **Manual Test:** 
    - Nhập SĐT của user đang nợ sách -> Kiểm tra xem nút mượn có bị khóa không.
    - Nhập SĐT mới -> Nhập tên -> Mượn sách thành công.

---
**CHỐT PHASE:** Thủ thư có thể quản lý mượn sách chỉ với SĐT, quy trình cực nhanh và an toàn.

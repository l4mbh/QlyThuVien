# Phase 01: Database & Foundation

## 🎯 Mục tiêu
Thiết lập hạ tầng dữ liệu và công cụ chuẩn hóa SĐT. Đảm bảo Database hỗ trợ định danh bằng SĐT nhưng vẫn tương thích với dữ liệu Email/Pass cũ.

## 📂 Danh sách file thay đổi
- `apps/api/prisma/schema.prisma`: Cập nhật User model.
- `packages/shared/src/utils/phone.ts`: [NEW] Logic chuẩn hóa SĐT.
- `packages/shared/src/index.ts`: Export utility mới.

## 🛠️ Nội dung thực hiện

### 1. Database Schema
- Thêm `phoneRaw` (String?).
- Thêm `phoneNormalized` (String? @unique).
- Chuyển `email`, `password`, `name` sang optional (`?`).
- Thêm `isGuest` (Boolean, default: true).

### 2. Phone Utility
- Viết hàm `normalizePhone(phone: string): string`:
    - Loại bỏ khoảng trắng, ký tự đặc biệt.
    - Chuyển đầu số: `0...` -> `+84...`.
    - Trả về format chuẩn để lưu `phoneNormalized`.

## ✅ Build & Verification (BẮT BUỘC)
1. **Migration:** Chạy `pnpm prisma migrate dev --name add_phone_identity`.
2. **Unit Test:**
    - Tạo file test cho `normalizePhone`.
    - Case: `0912345678` -> `+84912345678`.
    - Case: `+84 912 345 678` -> `+84912345678`.
    - Case: `912345678` -> `+84912345678`.
3. **Build:** Chạy `pnpm build` trong `packages/shared`.

---
**CHỐT PHASE:** Khi Database đã có column mới và utility chạy đúng 100%.

# 🚀 Walkthrough: Unified React Query Integration

Hà (Antigravity) đã hoàn thành việc nâng cấp hạ tầng quản lý dữ liệu cho toàn bộ dự án. Dưới đây là tóm tắt những thay đổi quan trọng.

## 1. Shared Logic Layer (Hạ tầng dùng chung)
Chúng ta đã đưa toàn bộ "trí thông minh" về dữ liệu vào `packages/shared`.
- **Query Keys:** Định nghĩa tập trung tại `src/constants/queryKeys.ts`.
- **API Factories:** Định nghĩa các endpoint tại `src/api/index.ts`. Cả Admin và Reader đều dùng chung định nghĩa này nhưng có thể dùng Axios instance riêng với các interceptor khác nhau.

## 2. Hook Layer (Lớp xử lý trung gian)
Áp dụng Best Practice: UI không gọi Service trực tiếp.
- **Reader Hooks:** `useBooks`, `useBookDetail`, `useMyBorrowed`, `useNotifications`.
- **Admin Hooks:** `useAdminBooks`, `useCreateBook`, `useUpdateBook`, `useDeleteBook`.

## 3. Reader Migration (Trang Reader)
- Toàn bộ `useEffect` fetch data đã bị loại bỏ.
- Tích hợp **Skeleton Loading** tự động.
- Chuyển tab tức thì nhờ Cache.

## 4. Admin Migration (Trang Quản lý)
- Trang quản lý sách (`BooksPage`) đã được refactor hoàn toàn.
- Cơ chế **Auto-invalidate** giúp UI tự động làm mới sau khi Thêm/Sửa/Xóa mà không cần reload trang.

## 5. Tools & Debugging
- Đã cài đặt **React Query DevTools** cho cả 2 app. 
- Anh có thể nhấn vào icon hoa cúc ở góc màn hình để soi cache.

---
*Hoàn thành bởi Hà (Antigravity) - 2026-04-25*

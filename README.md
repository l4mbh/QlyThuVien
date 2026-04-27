# LibMgnt - Enterprise-Grade Library Management System

LibMgnt là một hệ thống quản lý thư viện Full-stack hiện đại, được xây dựng theo kiến trúc **Monorepo** với hiệu suất cao. Hệ thống được thiết kế để giải quyết các bài toán phức tạp về mượn trả, quản lý kho sách và tương tác với độc giả theo thời gian thực.

> [!NOTE]
> **Trạng thái Dự án**: Hệ thống hiện đang trong quá trình phát triển tích cực. Phiên bản hiện tại đã hoàn tất giai đoạn **MVP (Minimum Viable Product)** cùng một số tính năng mở rộng nâng cao. Hệ thống vẫn còn một số sai sót nhỏ và đang được mình bổ sung, hoàn thiện dần theo thời gian.

---

## 🏗️ Kiến trúc Hệ thống (Architecture)

Hệ thống được tổ chức theo mô hình Monorepo sử dụng **pnpm Workspaces**, đảm bảo sự đồng nhất tuyệt đối về dữ liệu và logic giữa các nền tảng.

- **Apps**:
  - `apps/api`: Backend Core xử lý logic nghiệp vụ và dữ liệu.
  - `apps/web`: 🛡️ Admin Dashboard dành cho thủ thư và người quản lý.
  - `apps/reader`: 📱 Mobile-First App dành cho độc giả tra cứu và mượn sách.
- **Packages**:
  - `packages/shared`: "Bộ não" dùng chung chứa Typescript Interfaces, Zod Schemas và Quy tắc nghiệp vụ (Business Rules).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Backend (@qltv/api)
- **Runtime**: Node.js & Express.
- **ORM**: **Prisma 7.8.0** (Hỗ trợ Adapter-pg tối ưu cho Cloud/Serverless).
- **Database**: PostgreSQL (Hosted trên **Supabase**).
- **Authentication**: JWT với cơ chế phân quyền RBAC.
- **Documentation**: Swagger UI (OpenAPI 3.0).

### Frontend (Admin & Reader)
- **Framework**: **React 19** & Vite.
- **State Management**: **TanStack Query v5**.
- **UI/UX**: Tailwind CSS, **Radix UI**, **shadcn/ui**.
- **Animation**: **Framer Motion** & **Vaul** (Cho App Reader).

---

## 📐 Tiêu chuẩn Kỹ thuật (Technical Standards)

### 1. HTTP 200 "Always Success" Strategy
Để đơn giản hóa việc xử lý lỗi ở Frontend và duy trì giao thức giao tiếp đồng nhất, Backend luôn trả về mã trạng thái **HTTP 200**. Thành công hay thất bại được xử lý trong body của response:
- **Thành công**: `{ "data": [...], "code": 0 }`
- **Thất bại**: `{ "error": { "msg": "Thông báo lỗi chi tiết" }, "code": 1001 }`

### 2. Type-First Development
Hệ thống ép buộc 100% Type-Safety. Tất cả interfaces, types và enums đều nằm trong thư mục gốc `/types` của package shared. Mọi thay đổi về cấu trúc API sẽ được cảnh báo ngay lập tức trong quá trình phát triển.

### 3. Centralized Error Management
Mọi mã lỗi (`errorCode`) và thông báo lỗi (`errorMsg`) được định nghĩa tập trung trong `src/constants/errors/`. Tuyệt đối không hardcode chuỗi thông báo lỗi trong Controller hoặc Service.

---

## ✨ Tính năng nổi bật

### 🛡️ App Admin (Management Powerhouse)
- **Dashboard Tổng quan**: Theo dõi biểu đồ mượn trả, thống kê sách quá hạn và doanh thu.
- **Quản lý Kho sách**: Thêm sách nhanh, quản lý danh mục, kiểm soát tồn kho real-time.
- **Quản lý Độc giả**: Hồ sơ chi tiết, lịch sử mượn, tính năng khóa/mở thẻ độc giả.
- **Hệ thống Mượn/Trả**: Xử lý mượn đa năng, tự động tính ngày hẹn và tiền phạt.
- **Cấu hình Hệ thống**: Thay đổi hạn mức, đơn giá phạt trực tiếp trên UI.

### 📱 App Reader (User Experience)
- **Tra cứu Sách**: Tìm kiếm thông minh theo tên, tác giả hoặc danh mục.
- **Giá sách cá nhân**: Theo dõi sách đang mượn, lịch sử trả và thông báo.
- **Đặt trước sách (Reservation)**: Tự động xếp hàng và thông báo khi sách có sẵn.
- **Thông báo Real-time**: Nhắc nhở quá hạn và cập nhật từ thư viện.

---

## 🚀 Triển khai (Deployment)

- **API**: Triển khai trên **Render**.
- **Frontend**: Triển khai trên **Vercel**.
- **Database**: **Supabase**.

---

## 📦 Hướng dẫn cài đặt

1. **Cài đặt**: `pnpm install`
2. **Cấu hình**: Thiết lập `.env` cho `api`, `web`, `reader`.
3. **Database**: 
   ```bash
   pnpm db:push
   pnpm --filter @qltv/api run seed
   ```
4. **Chạy Dev**: `pnpm dev`

---

## 🔐 Tài khoản dùng thử (Test Accounts)
Mật khẩu mặc định cho tất cả tài khoản: **123456**

| Vai trò | Email | Trạng thái |
| :--- | :--- | :--- |
| **Admin** | `admin@admin.com` | Hoạt động |
| **Staff** | `staff1@lib.com` | Hoạt động |
| **Reader** | `reader1@gmail.com` | Hoạt động |
| **Blocked Reader** | `blocked@gmail.com` | Đang bị khóa |

---
**Designed with precision for enterprise scalability and architectural excellence.**

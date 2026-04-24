# 💡 BRIEF: pnpm Monorepo Migration

**Ngày tạo:** 2026-04-24
**Trạng thái:** Chờ duyệt

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
- Cấu trúc "Proxy-based Alias" hiện tại quá cồng kềnh, dễ lỗi build và không chuyên nghiệp.
- Vite gặp khó khăn khi transpiler code nằm ngoài thư mục `src`.
- Khó quản lý dependencies đồng nhất giữa Frontend và Backend.

## 2. GIẢI PHÁP ĐỀ XUẤT
- Chuyển đổi dự án sang mô hình **pnpm Monorepo**.
- Sử dụng **Workspaces** để quản lý các ứng dụng và thư viện nội bộ.
- Đóng gói logic dùng chung thành package `@qltv/shared` chính quy có build pipeline riêng.

## 3. CẤU TRÚC DỰ KIẾN
- `apps/web`: Frontend (React + Vite)
- `apps/api`: Backend (Express)
- `packages/shared`: Thư viện dùng chung (Constants, Rules, Types)
- `packages/config`: Cấu hình dùng chung (TSConfig, ESLint)

## 4. TÍNH NĂNG & CÔNG NGHỆ
- **Package Manager**: pnpm
- **Build Tool (Shared)**: tsup (Fast TS bundler)
- **TypeScript**: Project References (composite: true)
- **Import Strategy**: `@qltv/shared` (Workspace link)

## 5. ƯỚC TÍNH SƠ BỘ
- **Độ phức tạp**: Trung bình (Cần refactor nhiều import)
- **Rủi ro**: Lỗi build TypeScript nếu cấu hình Project References không chuẩn.

## 6. BƯỚC TIẾP THEO
→ Thực hiện migration theo 4 phase trong thư mục `plans/`.

# 💡 BRIEF: LibMgnt Dashboard & Reporting System

**Ngày tạo:** 2026-04-22
**Trạng thái:** Brainstorming Completed -> Ready for Design

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
Thủ thư và Admin hiện tại phải vào từng module (Sách, Độc giả, Mượn trả) để xem dữ liệu, thiếu cái nhìn tổng quan về hiệu suất hoạt động, tình trạng sách quá hạn và xu hướng mượn sách của thư viện.

## 2. GIẢI PHÁP ĐỀ XUẤT
Xây dựng một Dashboard SaaS chuyên nghiệp, tập trung dữ liệu (Aggregated Data) để hỗ trợ ra quyết định nhanh và xử lý các đầu việc ưu tiên (như đòi sách quá hạn).

## 3. ĐỐI TƯỢNG SỬ DỤNG
- **ADMIN:** Xem toàn bộ hệ thống, bao gồm cả báo cáo tài chính (phí phạt).
- **STAFF:** Theo dõi vận hành, quản lý mượn trả và xử lý quá hạn (không xem dữ liệu tài chính).

## 4. TÍNH NĂNG & GIAO DIỆN (UI/UX)

### 🎨 Thẩm mỹ & Branding
- **Style:** Modern Flat, Glassmorphism, Minimalist.
- **Primary Color:** Deep Blue (#1E3A8A).
- **Background:** Light Gray (#F9FAFB).
- **Typography:** Inter (8px grid system).

### 🚀 MVP Features:
- **Hero Stats:** Total Books, Available, Active Borrows, Overdue (Red), Total Fines (Admin Only).
- **Line Chart:** Borrow Trends (Weekly/Monthly filter).
- **Overdue Table:** List of urgent returns with "View Borrow" CTA.
- **Top Books & Active Readers:** Ranking list for insights.

## 5. KIẾN TRÚC KỸ THUẬT (Backend)
- **Separation of Concerns:** Tách riêng CRUD API và Report/Dashboard API.
- **Endpoints:**
  - `GET /reports/summary` (Stats with RBAC)
  - `GET /reports/borrow-trends`
  - `GET /reports/top-books`
  - `GET /reports/overdue`
- **Performance:** Aggregate queries, Promise.all, (Optional) Redis Caching.

## 6. ƯỚC TÍNH SƠ BỘ
- **Độ phức tạp:** Trung bình (Cần viết các câu query aggregate phức tạp và vẽ chart ở frontend).
- **Rủi ro:** Sai lệch số lượng inventory nếu không lock transaction (Đã xử lý ở module Borrow).

---

## 7. BƯỚC TIẾP THEO
→ Chạy `/design` để thiết kế Database Schema và API Spec.
→ Chạy `/visualize` để tạo mockup giao diện chuẩn SaaS.

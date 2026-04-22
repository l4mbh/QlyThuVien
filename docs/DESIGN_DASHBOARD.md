# 🎨 DESIGN: LibMgnt Dashboard System

**Ngày tạo:** 2026-04-22
**Dựa trên:** `docs/BRIEF_DASHBOARD.md` & `plans/260422-2335-dashboard-implementation/`

---

## 1. KIẾN TRÚC DỮ LIỆU (BACKEND)

### 1.1. API Endpoints
Tất cả các route dashboard sẽ nằm dưới tiền tố `/api/reports`.

| Method | Endpoint | Description | Phân quyền |
|--------|----------|-------------|------------|
| GET | `/summary` | Thống kê tổng quan (Books, Borrows, Overdue, Fines) | Admin: Full, Staff: No Fines |
| GET | `/borrow-trends` | Dữ liệu biểu đồ xu hướng (7-30 ngày) | All Staff |
| GET | `/top-books` | Top 5 sách mượn nhiều nhất | All Staff |
| GET | `/overdue` | Danh sách sách quá hạn chi tiết | All Staff |

### 1.2. Logic Truy Vấn (Prisma)
Sử dụng `prisma.$transaction` hoặc `Promise.all` để tối ưu hiệu năng:
- **Total Books:** `prisma.book.count()`
- **Available Books:** `prisma.book.aggregate({ _sum: { availableQuantity: true } })`
- **Active Borrows:** `prisma.borrowItem.count({ where: { status: 'BORROWED' } })`
- **Overdue:** `prisma.borrowItem.count({ where: { status: 'BORROWED', dueDate: { lt: new Date() } } })`
- **Total Fines:** `prisma.borrowItem.aggregate({ _sum: { fineAmount: true } })`

---

## 2. THIẾT KẾ GIAO DIỆN (FRONTEND)

### 2.1. Cấu trúc Component
Sử dụng Atomic Design để chia nhỏ giao diện:
- **Feature Layer:** `src/features/dashboard/`
- **Components:**
  - `StatsCard`: UI Card đơn lẻ (Icon, Label, Value).
  - `BorrowTrendChart`: Recharts implementation.
  - `OverdueTable`: List view với trạng thái cảnh báo.
  - `DashboardShell`: Container quản lý Layout và Grid hệ thống 8px.

### 2.2. Quy tắc Visual (UI)
- **Primary:** `#1E3A8A` (Deep Blue).
- **Background:** `#F9FAFB` (Light Gray).
- **Radius:** `12px` cho tất cả các Cards.
- **Effect:** `backdrop-blur-md` kết hợp `bg-white/80` cho hiệu ứng Glassmorphism.

---

## 3. PHÂN QUYỀN (RBAC)

**Logic ẩn dữ liệu nhạy cảm:**
1. **Backend:** Kiểm tra `req.user.role`. Nếu không phải `ADMIN`, gán `fineAmount = null` trước khi trả về.
2. **Frontend:** 
   ```tsx
   {user.role === 'ADMIN' && <StatsCard label="Total Fines" value={data.totalFines} />}
   ```

---

## 4. CHECKLIST NGHIỆM THU (ACCEPTANCE CRITERIA)

### ✅ Chức năng:
- [ ] API phản hồi dữ liệu thực tế từ Database.
- [ ] Biểu đồ hiển thị đúng xu hướng theo thời gian thực.
- [ ] Phân quyền hoạt động đúng (Staff không thấy tiền phạt).

### ✅ Hiệu năng & UI:
- [ ] Thời gian tải trang dưới 1.5s.
- [ ] Layout không bị vỡ trên các màn hình từ 1024px trở lên.
- [ ] Hiệu ứng hover mượt mà trên các thẻ thống kê.

---

*Thiết kế bởi Antigravity Solution Architect - Minh*

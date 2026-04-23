# 🎨 DESIGN: Dashboard Overhaul (Command Center)

**Ngày tạo:** 2026-04-23
**Kiến trúc sư:** Minh (Solution Architect)
**Dựa trên:** `docs/BRIEF_DASHBOARD_V2.md`

---

## 1. THIẾT KẾ DỮ LIỆU (BACKEND)

### 1.1. API Endpoints Contract
| Endpoint | Method | Response Structure | Logic |
|----------|--------|-------------------|-------|
| `/api/reports/summary` | GET | `{ totalBooks, activeBorrows, overdueCount, totalFines }` | Admin sees totalFines, Staff sees null |
| `/api/reports/overdue` | GET | `Array<{ readerName, bookTitle, dueDate, daysOverdue }>` | Limit 5-10, sort by daysOverdue desc |
| `/api/reports/low-stock` | GET | `Array<{ title, available, threshold }>` | filter: available < 3 |
| `/api/reports/borrow-trend`| GET | `Array<{ date, count }>` | Last 7 days aggregation |

---

## 2. THIẾT KẾ GIAO DIỆN (FRONTEND)

### 2.1. Component Tree
- `DashboardPage` (Container)
  - `SummaryGrid` (Layout 4 columns)
    - `StatsCard` (Visual: Green/Red/Blue/Amber)
  - `ActionGrid` (Layout 2 columns)
    - `OverduePanel` (Actionable table)
    - `LowStockPanel` (Alert list)
  - `InsightsGrid` (Layout 2/3 and 1/3)
    - `BorrowTrendChart` (Recharts AreaChart)
    - `TopBooksList` (Ranked list)

---

## 3. LUỒNG HOẠT ĐỘNG (FLOW)
1. **Fetch**: `Promise.all` gọi đồng thời tất cả API dashboard.
2. **Roles**: Component `StatsCard` của Fines chỉ render nếu `user.role === 'ADMIN'`.
3. **Empty states**: Kiểm tra length của `overdue` và `lowStock`. Nếu 0, hiển thị "All caught up!" banner.

---

## 4. CHECKLIST NGHIỆM THU (QA)
- [ ] Role-based access control (RBAC) thực thi tại cả Backend và Frontend.
- [ ] Loading states (Skeletons) hiển thị đúng layout bento grid.
- [ ] Responsive: Stack cards trên mobile, scrollable tables.
- [ ] Dữ liệu Overdue khớp với báo cáo chi tiết.

---
*Thiết kế bởi Minh - Antigravity Architect*

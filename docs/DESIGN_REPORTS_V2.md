# 🎨 DESIGN: Librarian Command Center (Reports V2)

Ngày tạo: 2026-04-23
Dựa trên: [BRIEF_REPORTS_LIBRARIAN.md](file:///c:/Users/lambh/OneDrive/M%C3%A1y%20t%C3%ADnh/PROJ/QlyThuVien/docs/BRIEF_REPORTS_LIBRARIAN.md)

---

## 1. Cách Truy Xuất Dữ Liệu (Database Logic)

### 1.1. Trục Vận hành (Operational)
- **Daily Operations:** 
    - Logic: `borrow_items` filter by `createdAt` OR `returnDate` matching `today`.
- **Actionable Overdue:** 
    - Logic: `borrow_items` where `dueDate < Today` AND `returnDate == null`.
    - Join: `Book` (title), `BorrowRecord -> User` (readerName, phone).
    - Formula: `estimatedFine = (Today - dueDate) * 5000`.
- **Financial Ledger:** 
    - Logic: `borrow_items` where `fineAmount > 0` and `returnDate` matching `today`.

### 1.2. Trục Quản lý Kho (Collection)
- **Inventory Snapshot:** 
    - Logic: `books` group by `status` (Available, Borrowed, Lost, Damaged).
- **Stock Rotation (Health):**
    - **Dead Stock:** `books` NOT IN (select `bookId` from `borrow_items` where `createdAt` > 6 months ago).
    - **Best Sellers:** `books` order by count of `borrow_items` DESC.

---

## 2. Danh Sách Màn Hình (Frontend Tabs)

| # | Tab Name | Purpose | Key Components |
|---|----------|---------|----------------|
| 1 | Operational Center | Task hàng ngày | DailySummary, OverdueActionTable, FinancialLedger |
| 2 | Collection Audit | Quản lý tài sản | InventoryChart, DeadStockList, BestSellersTable |

---

## 3. Luồng Hoạt Động (User Journey)

### Hành trình: Thủ thư xử lý sách quá hạn
1. Mở trang **Reports** -> Mặc định vào tab **Operational Center**.
2. Nhìn vào bảng **Overdue Action List** (đã được sắp xếp theo số ngày trễ giảm dần).
3. Thấy các dòng màu Đỏ (trễ > 7 ngày).
4. Bấm nút **Print** để in danh sách này ra giấy.
5. Cầm danh sách đi đối soát hoặc gọi điện theo số điện thoại hiển thị trên bảng.

---

## 4. Checklist Kiểm Tra (Acceptance Criteria)

### Tính năng: Actionable Overdue List
- [ ] Trả về đầy đủ Reader Name và Phone.
- [ ] Tiền phạt dự kiến tính đúng theo ngày hiện tại.
- [ ] Hỗ trợ Filter theo Category để thủ thư lọc theo khu vực sách.

### Tính năng: Print Management
- [ ] Khi in (Ctrl+P), ẩn Header, Sidebar và các nút Action.
- [ ] Bảng dữ liệu tự động dàn trang A4 hợp lý.

---

*Tạo bởi AWF 2.1 - Design Phase*

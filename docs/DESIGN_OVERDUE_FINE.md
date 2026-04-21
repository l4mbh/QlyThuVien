# 🎨 DESIGN: Overdue & Fine Handling System
Created: 2026-04-22
Dựa trên: plans/20260422-0030-overdue-fine-handling/plan.md

---

## 1. Cách Lưu Thông Tin (Database)

### Bảng `BorrowItem` (Cập nhật)
| Column | Type | Description |
|---|---|---|
| `fineAmount` | `Int?` | Số tiền phạt đã thu. Chỉ lưu khi status = RETURNED. |
| `returnedAt` | `DateTime?` | Ngày thực tế trả sách. |

---

## 2. Danh Sách Màn Hình & Thành Phần

### A. Borrow Table (Update)
- **Badge Status:** Tính động. Nếu `now > dueDate` && `status != RETURNED` -> Hiện badge đỏ "Overdue".
- **Sorting:** Mặc định đưa các item `isOverdue` lên đầu.
- **Color Coding:** Dòng quá hạn có background hồng nhạt (`bg-destructive/10`).

### B. Borrow Detail Drawer (Update)
- **Fine Preview:** Nếu item đang chọn là quá hạn, hiển thị text: `Overdue X days - Fine: Y VND`.
- **Confirm Modal:** Chặn hành động trả bằng một AlertDialog hiển thị rõ số tiền phạt.

### C. Reader Profile (Update)
- **Stats Card:** 
  - `Total Fines`: Tổng `fineAmount` của tất cả `BorrowItem` thuộc reader này.
  - `Active Overdue`: Đếm số `BorrowItem` đang quá hạn.

---

## 3. Luồng Hoạt Động (User Journey)

### Luồng Trả Sách Quá Hạn
1. Staff mở phiếu mượn của Reader.
2. Hệ thống tự tính: `overdueDays = differenceInDays(now, dueDate)`.
3. Staff chọn "Return".
4. Modal hiện: "Sách quá hạn X ngày. Thu phí Y VNĐ?".
5. Staff nhấn "Confirm".
6. Backend: 
   - `fineAmount = overdueDays * 5000`.
   - Lưu `fineAmount` vào DB.
   - Cập nhật kho và trạng thái.

---

## 4. Checklist Kiểm Tra

- [ ] Tính phí đúng 5,000/ngày.
- [ ] Trả đúng hạn fineAmount = 0.
- [ ] Badge Overdue hiện đúng ngay sau 00:00 ngày quá hạn.
- [ ] Tổng tiền phạt ở Reader Profile cập nhật ngay sau khi trả.

---
*Thiết kế bởi Minh Architect - Antigravity*

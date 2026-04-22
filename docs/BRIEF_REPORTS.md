# 📊 BRIEF: Library Reporting System (Report Docs)

**Ngày cập nhật:** 2026-04-23
**Module:** Admin Reports (SaaS Enterprise Standard)

---

## 1. MỤC TIÊU
Cung cấp các báo cáo Snapshot chính xác tuyệt đối, hỗ trợ phân tích Insight (Rates) và xuất bản in chuyên nghiệp.

## 2. QUY CHUẨN LOGIC (BẮT BUỘC)
- **Timezone:** `Asia/Ho_Chi_Minh`.
- **Borrow trong tháng:** `borrow_records.createdAt` ∈ [Start, End].
- **Return trong tháng:** `borrow_items.returnedAt` ∈ [Start, End].
- **Overdue phát sinh:** `borrow_record.dueDate` ∈ [Start, End] AND (returnedAt NULL OR returnedAt > dueDate).
- **Fine phát sinh:** `borrow_items.returnedAt` ∈ [Start, End] AND fineAmount > 0.

## 3. CÁC LOẠI BÁO CÁO & METRICS

### 🚀 Monthly Library Report
- **Summary Metrics:**
  - Total Borrows, Total Returns.
  - Return Rate (Returns / Borrows).
  - Overdue Cases & Overdue Rate.
  - Total Fines Collected.
- **Top Lists:** Top 5 books mượn nhiều nhất.
- **Audit:** Phải có `generatedAt` (timestamp).

### 📚 Inventory Report
- **Structure:** `totalBooks`, `available`, `borrowed` (total - available), `byCategory`.

### 👥 Reader Activity Report
- **Highlights:** `topReaders`, `overdueReaders`, `nearLimitReaders` (🔥), `blockedUsers`.

### 💰 Fine Report
- **Financials:** `totalFines`, `paid` (thu từ returns), `unpaid` (phạt treo từ overdue chưa trả).

## 4. TÍNH NĂNG KỸ THUẬT & UI/UX
- **Preview UI:** Layout print-friendly, highlight đỏ cho rủi ro (Overdue/Blocked).
- **PDF Export:** Template có Logo, Header, Footer chuyên nghiệp.
- **CSV Export:** Dữ liệu thô để xử lý Excel.

## 5. QUY TRÌNH THỰC HIỆN (Cập nhật)
1. **Phase 1:** Backend Logic (Timezone, Date Helpers, Aggregate Queries).
2. **Phase 2:** UI Shell & Advanced Filters.
3. **Phase 3:** Preview Components (Highlight rủi ro, Print-friendly layout).
4. **Phase 4:** Export Engine (PDF Template, CSV).
5. **Phase 5:** Testing & Audit logs.

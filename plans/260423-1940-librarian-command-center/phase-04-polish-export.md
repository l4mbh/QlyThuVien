# Phase 04: Financial & Export Polish
Status: ⬜ Pending
Dependencies: Phase 02, Phase 03

## Objective
Hoàn thiện khả năng in ấn và đối soát tài chính, đảm bảo thủ thư có thể lưu trữ báo cáo giấy.

## Requirements
### Functional
- [ ] UI Sổ quỹ tiền phạt (Financial Ledger) chi tiết.
- [ ] Tối ưu CSS `@media print` cho các bảng báo cáo để in A4 không bị vỡ layout.
- [ ] Thêm Header/Footer Branding vào file PDF xuất bản.

## Implementation Steps
1. [ ] Xây dựng `FinancialLedgerTable` hiển thị lịch sử thu phí phạt.
2. [ ] Tạo file CSS chuyên dụng cho in ấn `print.css` hoặc sử dụng Tailwind `print:` classes.
3. [ ] Cập nhật `export-utils.ts` để hỗ trợ logo và tên thư viện trong jsPDF.

## Files to Create/Modify
- `frontend/src/features/reports/components/operations/financial-ledger.tsx`
- `frontend/src/features/reports/utils/export-utils.ts`
- `frontend/src/index.css` (Thêm print styles)

## Test Criteria
- [ ] In báo cáo từ trình duyệt (Ctrl+P) hiển thị layout sạch sẽ, không có Sidebar/Navbar.
- [ ] File PDF xuất ra có Logo và thông tin thư viện chuyên nghiệp.

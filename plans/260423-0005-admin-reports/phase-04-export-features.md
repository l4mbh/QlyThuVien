# Phase 04: Export Engine (CSV/PDF)
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Tích hợp tính năng xuất file báo cáo ra định dạng CSV và PDF.

## Requirements
### Functional
- [ ] Tính năng "Export to CSV": Chuyển đổi dữ liệu JSON sang định dạng bảng Excel.
- [ ] Tính năng "Export to PDF": Tạo bản in chuyên nghiệp có Header (Logo thư viện), Footer và `generatedAt`.
- [ ] Hỗ trợ tiếng Việt có dấu (Font hỗ trợ Unicode).

## Implementation Steps
1. [ ] Cài đặt `json2csv` và `jspdf` + `jspdf-autotable`.
2. [ ] Viết các utility functions để xử lý chuyển đổi dữ liệu.
3. [ ] Tạo nút bấm Export trên giao diện Preview.
4. [ ] Thiết kế Header cho PDF (Tên thư viện, Ngày tạo, Loại báo cáo).

## Files to Create/Modify
- `frontend/src/features/reports/utils/export-utils.ts`
- `frontend/src/features/reports/reports-page/reports-page.tsx`

## Test Criteria
- [ ] File CSV mở được bằng Excel không lỗi font tiếng Việt.
- [ ] File PDF trình bày đẹp, không bị tràn lề hoặc mất dữ liệu.

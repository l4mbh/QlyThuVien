# Phase 02: Core Generic DataTable
Status: ✅ Complete
Dependencies: Phase 01

## Objective
Xây dựng Component DataTable dùng chung sử dụng TanStack Table.

## Requirements
### Functional
- [ ] Render bảng dựa trên cấu hình columns.
- [ ] Hỗ trợ Phân trang (Pagination) tích hợp API.
- [ ] Hỗ trợ Chọn dòng (Selection) và Bulk Actions.
- [ ] Configurable Toolbar (Show/Hide Export/Import).

## Implementation Steps
1. [ ] Cài đặt `@tanstack/react-table` (Đã làm).
2. [ ] Xây dựng `frontend/src/components/ui/data-table/data-table.tsx`.
3. [ ] Xây dựng `frontend/src/components/ui/data-table/pagination.tsx`.
4. [ ] Xây dựng hook `useDataTable` để quản lý fetch dữ liệu.

## Files to Create/Modify
- `frontend/src/components/ui/data-table/` [NEW FOLDER]
- `frontend/src/types/response.type.ts`

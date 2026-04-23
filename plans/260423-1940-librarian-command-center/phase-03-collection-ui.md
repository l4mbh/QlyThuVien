# Phase 03: Collection Management UI
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Xây dựng giao diện cho trục Quản lý Kho, giúp thủ thư nắm bắt sức khỏe của tài sản sách.

## Requirements
### Functional
- [ ] Component `InventoryAuditCard`: Hiển thị tỉ lệ Sẵn sàng/Mượn/Mất/Hỏng.
- [ ] Component `StockRotationTable`: Danh sách Best-sellers và Dead stock.
- [ ] Biểu đồ cơ cấu kho theo Category (Sử dụng Recharts hiện có nhưng tinh chỉnh).

## Implementation Steps
1. [ ] Tạo thư mục `frontend/src/features/reports/components/collection/`.
2. [ ] Xây dựng các card thống kê tài sản chuyên sâu.
3. [ ] Code component hiển thị danh sách sách "nằm kho" (Dead Stock).
4. [ ] Tích hợp API collection health.

## Files to Create/Modify
- `frontend/src/features/reports/components/collection/inventory-audit.tsx`
- `frontend/src/features/reports/components/collection/stock-rotation.tsx`

## Test Criteria
- [ ] Số liệu tổng kho phải khớp với thực tế database.
- [ ] Dead stock hiển thị đúng các cuốn sách lâu không có lượt mượn.

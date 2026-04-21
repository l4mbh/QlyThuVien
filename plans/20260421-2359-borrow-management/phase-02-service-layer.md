# Phase 02: Service Layer
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Kết nối API Backend cho các thao tác mượn/trả sách.

## Implementation Steps
1. [ ] Cập nhật `src/features/borrow/borrow.service.ts`:
    - `getBorrowRecords(params)`: Fetch list with filters.
    - `getBorrowById(id)`: Fetch detail.
    - `createBorrow(data)`: POST request.
    - `returnBook(borrowItemId)`: POST request.
2. [ ] Thêm xử lý Error Handling tập trung cho các lỗi nghiệp vụ (mượn quá hạn, sách hết...).

## Files to Create/Modify
- `src/features/borrow/borrow.service.ts`

# Phase 01: Types & Schemas
Status: ⬜ Pending
Dependencies: None

## Objective
Thiết lập hệ thống Type-Safe cho toàn bộ module Borrowing.

## Implementation Steps
1. [ ] Di chuyển `src/types/borrow.entity.ts` -> `src/types/borrow/borrow.entity.ts` để đúng cấu trúc module.
2. [ ] Bổ sung các Interface còn thiếu cho API Response trong `borrow.entity.ts`.
3. [ ] Tạo `src/schemas/borrow/borrow.schema.ts` cho Form mượn sách:
    - `readerId`: Required
    - `bookIds`: Non-empty array
    - `dueDate`: Future date
4. [ ] Tạo `src/schemas/borrow/return.schema.ts` cho thao tác trả sách.

## Files to Create/Modify
- `src/types/borrow/borrow.entity.ts`
- `src/schemas/borrow/borrow.schema.ts`

## Test Criteria
- Không có lỗi compile TypeScript.
- Zod schema validate đúng các trường hợp dữ liệu trống hoặc sai định dạng.

# Phase 01: Database & Types
Status: ✅ Complete

## Objective
Cập nhật Schema Database và các interface TypeScript để hỗ trợ lưu trữ số tiền phạt.

## Implementation Steps
1. [x] [BACKEND] Cập nhật `backend/prisma/schema.prisma`: Thêm `fineAmount Int?` vào model `BorrowItem`.
2. [x] [BACKEND] Chạy lệnh `npx prisma generate` trong folder backend.
3. [x] [BACKEND TYPES] Cập nhật `backend/src/types/borrow/borrow.entity.ts`: Thêm `fineAmount?: number` vào `BorrowItemEntity`.
4. [x] [FRONTEND TYPES] Cập nhật `frontend/src/types/borrow/borrow.entity.ts`: Thêm `fineAmount?: number` vào interface `BorrowItem`.

## Test Criteria
- `npx prisma generate` không có lỗi.
- Typescript không báo lỗi ở các chỗ sử dụng `BorrowItem`.

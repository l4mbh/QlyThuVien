# Phase 01: Backend Standardization
Status: ✅ Complete
Dependencies: None

## Objective
Chuẩn hóa cấu trúc Response và logic phân trang ở phía Server.

## Requirements
### Functional
- [ ] ApiResponse hỗ trợ trường `meta` cho pagination.
- [ ] Helper `paginate` tự động tính toán `skip`, `take`, `total`, `totalPages`.
- [ ] API `GET /categories` và `GET /books` trả về dữ liệu chuẩn.

## Implementation Steps
1. [ ] Cập nhật `backend/src/types/shared/response.type.ts`.
2. [ ] Xây dựng `backend/src/utils/pagination.helper.ts`.
3. [ ] Refactor `BookRepository` và `CategoryRepository` để dùng helper.
4. [ ] Cập nhật Controller để xử lý các query params `page`, `limit`.

## Files to Create/Modify
- `backend/src/types/shared/response.type.ts`
- `backend/src/utils/pagination.helper.ts` [NEW]
- `backend/src/repositories/book/book.repository.ts`
- `backend/src/repositories/category/category.repository.ts`

## Test Criteria
- [ ] API trả về `meta` đúng với số lượng bản ghi thực tế.
- [ ] Chuyển `page=2` trả về đúng dải dữ liệu tiếp theo.

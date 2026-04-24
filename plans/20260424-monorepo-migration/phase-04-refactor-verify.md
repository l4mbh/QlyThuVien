# Phase 04: Refactor Imports & Verification
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Dọn dẹp code cũ, refactor sang hệ thống import mới và kiểm tra toàn diện.

## Tasks
- [ ] Xóa sạch thư mục proxy `apps/web/src/shared` và các file tương tự ở Backend nếu có.
- [ ] Quét toàn bộ project, thay thế import `shared/...` -> `@qltv/shared`.
- [ ] Chạy `pnpm build` từ root để kiểm tra tính toàn vẹn của build pipeline.
- [ ] Chạy `pnpm dev` để kiểm tra runtime (Frontend + Backend).
- [ ] Kiểm tra "Real-time sync": Sửa file ở shared/src và xem Apps có cập nhật không.

## Test Criteria
- [ ] Toàn bộ project build thành công.
- [ ] Không còn vết tích của cơ chế proxy cũ.
- [ ] Runtime hoạt động ổn định, không lỗi import.

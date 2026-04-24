# Phase 02: Shared Package & Build Setup
Status: ✅ Complete
Dependencies: Phase 01

## Objective
Biến thư mục shared thành một package hoàn chỉnh, có khả năng tự build ra `dist`.

## Tasks
- [ ] Tổ chức lại thư mục: `packages/shared/src/` chứa toàn bộ code TS.
- [ ] Tạo `packages/shared/src/index.ts` để export toàn bộ nội dung (constants, types, rules).
- [ ] Tạo `packages/shared/package.json` với cấu hình `exports`, `main`, `types`.
- [ ] Thêm `tsup` vào devDependencies của package shared.
- [ ] Thêm build/dev scripts vào package shared.
- [ ] Cấu hình `packages/shared/tsconfig.json` với `composite: true`.

## Files to Create/Modify
- `packages/shared/package.json` - [NEW]
- `packages/shared/tsconfig.json` - [NEW/MODIFY]
- `packages/shared/src/index.ts` - [NEW]

## Test Criteria
- [ ] Chạy `pnpm --filter @qltv/shared build` thành công, tạo ra thư mục `dist/`.
- [ ] Kiểm tra nội dung `dist/` có đủ ESM, CJS và d.ts không.

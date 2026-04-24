# Phase 03: App Configuration (API/Web)
Status: ✅ Complete
Dependencies: Phase 02

## Objective
Kết nối Backend và Frontend vào Workspace và config TypeScript Project References.

## Tasks
- [ ] Cập nhật `apps/api/package.json`: đổi name thành `@qltv/api`, thêm `"@qltv/shared": "workspace:*"`.
- [ ] Cập nhật `apps/web/package.json`: đổi name thành `@qltv/web`, thêm `"@qltv/shared": "workspace:*"`.
- [ ] Cấu hình `apps/api/tsconfig.json` trỏ reference sang `../../packages/shared`.
- [ ] Cấu hình `apps/web/tsconfig.json` trỏ reference sang `../../packages/shared`.
- [ ] Cập nhật `apps/web/vite.config.ts` để tối ưu việc nhận diện package từ `dist`.
- [ ] Thêm các scripts tiện ích vào root `package.json` (dev, build all).

## Files to Create/Modify
- `apps/api/package.json` - [MODIFY]
- `apps/web/package.json` - [MODIFY]
- `apps/api/tsconfig.json` - [MODIFY]
- `apps/web/tsconfig.json` - [MODIFY]
- `package.json` (Root) - [MODIFY]

## Test Criteria
- [ ] `pnpm install` ở root nhận diện được symlink của `@qltv/shared`.
- [ ] VS Code không báo đỏ khi mở các file trong Apps.

# Phase 01: Restructure & Workspace Init
Status: ✅ Complete
Dependencies: None

## Objective
Thiết lập nền móng Monorepo và di chuyển các file hiện tại vào đúng vị trí mới.

## Tasks
- [ ] Xóa sạch `node_modules` và lock files cũ ở root, frontend, backend.
- [ ] Tạo folder `apps/` và `packages/`.
- [ ] Di chuyển `frontend/` -> `apps/web/`.
- [ ] Di chuyển `backend/` -> `apps/api/`.
- [ ] Di chuyển `shared/` -> `packages/shared/`.
- [ ] Tạo file `pnpm-workspace.yaml` ở root.
- [ ] Cập nhật `package.json` ở root (name: "qlythuvien-monorepo", private: true, workspaces).

## Files to Create/Modify
- `pnpm-workspace.yaml` - [NEW]
- `package.json` (Root) - [MODIFY]

## Test Criteria
- [ ] Folder structure đúng theo thiết kế.
- [ ] `pnpm install` ở root chạy thành công (mặc dù chưa có link package).

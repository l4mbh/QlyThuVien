# 📄 SPEC: Monorepo Migration Strategy

**Version:** 2.0 (Production-Ready)
**Date:** 2026-04-24

---

## 1. Workspace Configuration
### `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## 2. Shared Package System (@qltv/shared)
### Build Pipeline
- **Tool**: `tsup`
- **Output**: ESM (`.mjs`) và CJS (`.js`) kèm định nghĩa type (`.d.ts`).
- **Mode**: Hỗ trợ `watch` mode cho development.

### Exports Strategy
```json
"exports": {
  ".": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

## 3. TypeScript Project References
### Root `tsconfig.json`
Sử dụng làm "Solution" config, điều hướng đến các package con.
### Package `tsconfig.json`
- Bật `composite: true` cho `@qltv/shared`.
- Thêm `references` trỏ đến `@qltv/shared` từ `apps/web` và `apps/api`.

## 4. Development Workflow
- **Root Dev**: Chạy song song `pnpm -r --parallel dev`.
- **Logic Sync**: `tsup` sẽ watch code shared và build vào `dist`. Vite/Node sẽ nhận diện thay đổi từ `dist`.

## 5. Migration Checklist
- [ ] Xóa `node_modules` & lock files.
- [ ] Di chuyển code vào `apps/` và `packages/`.
- [ ] Cấu trúc lại `shared/src/index.ts`.
- [ ] Cài đặt `tsup` và setup build scripts.
- [ ] Refactor imports sang `@qltv/shared`.
- [ ] Xóa các file proxy cũ.
- [ ] Verify build toàn bộ workspace.

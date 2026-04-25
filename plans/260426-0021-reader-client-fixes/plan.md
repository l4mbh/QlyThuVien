# Plan: Reader Client Fixes

**Dựa trên:** [BRIEF_READER_FIXES.md](../../docs/BRIEF_READER_FIXES.md) & [DESIGN_READER_FIXES.md](../../docs/DESIGN_READER_FIXES.md)

---

## 📅 Phases

### Phase 01: Backend Foundation (Auth & Guest Flow)
- [ ] Cập nhật `schema.prisma` (isGuest, hasActivity, phoneNormalized).
- [ ] Implement `AuthService.readerLogin`.
- [ ] Bổ sung route `POST /auth/reader-login`.
- [ ] Viết API `/categories` public (nếu chưa có).

### Phase 02: Reader App Core Fixes
- [ ] Cập nhật `LoginPage.tsx` dùng API login mới.
- [ ] Viết `useCategories` hook, gỡ hardcode `CategoryBar.tsx`.
- [ ] Cập nhật `BookDetailModal.tsx` logic nút bấm & check auth.

### Phase 03: Verification
- [ ] Test flow Login -> Register Guest tự động.
- [ ] Test mượn sách với Token mới.
- [ ] Verify UI categories khớp với Database.

---
*Antigravity Implementation Plan*

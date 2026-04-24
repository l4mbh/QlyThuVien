# Plan: Shared Rule Engine Implementation
Created: 2026-04-23
Status: 🟡 In Progress

## Overview
Chuẩn hóa hệ thống bằng cách tách bạch Decision Logic (Rules) khỏi Transport Layer (Errors). Sử dụng mô hình Shared Logic để đồng bộ hóa kiểm tra giữa Frontend và Backend, sử dụng String Error Codes thay cho Numeric Codes.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js (Express)
- Language: TypeScript (Shared types/logic)

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | [Shared Foundation](#phase-01-shared-foundation) | ⬜ Pending | 0% |
| 02 | [Standardize Errors](#phase-02-standardize-errors) | ⬜ Pending | 0% |
| 03 | [Borrow Rule Set](#phase-03-borrow-rule-set) | ⬜ Pending | 0% |
| 04 | [Backend Integration](#phase-04-backend-integration) | ⬜ Pending | 0% |
| 05 | [Frontend Integration](#phase-05-frontend-integration) | ⬜ Pending | 0% |
| 06 | [Verification & Expansion](#phase-06-verification-expansion) | ⬜ Pending | 0% |

---

## Phase 01: Shared Foundation
Mục tiêu: Thiết lập cấu trúc thư mục shared và các định nghĩa cơ bản.

### Tasks:
- [ ] Tạo thư mục `shared/` ở dự án gốc.
- [ ] Define `RuleResult` và `Rule<T>` types trong `shared/types/rules.ts`.
- [ ] Implement `runRules` pipeline trong `shared/engine/rule-runner.ts`.
- [ ] Cấu hình TypeScript Aliases cho `backend` và `frontend`.

## Phase 02: Standardize Errors
Mục tiêu: Chuyển đổi mã lỗi từ số sang chữ.

### Tasks:
- [ ] Tạo `shared/constants/error-codes.ts` với danh sách mã lỗi dạng String.
- [ ] Refactor `AppError` ở Backend để chấp nhận string code.
- [ ] Cập nhật Global Error Middleware ở Backend.
- [ ] Tạo `errorMap` ở Frontend để dịch string code sang message.

## Phase 03: Borrow Rule Set
Mục tiêu: Triển khai các quy tắc nghiệp vụ thực tế cho việc mượn sách.

### Tasks:
- [ ] Implement `isUserActive` rule.
- [ ] Implement `withinBorrowLimit` rule.
- [ ] Implement `isStockAvailable` rule.
- [ ] Implement `noOverdue` rule (ngăn mượn nếu đang có sách trễ hạn).

## Phase 04: Backend Integration
Mục tiêu: Áp dụng rule engine vào logic Backend.

### Tasks:
- [ ] Refactor `BorrowService.createBorrow` sử dụng `runRules`.
- [ ] Loại bỏ code check logic rời rạc trong service.
- [ ] Test API mượn sách với các mã lỗi mới.

## Phase 05: Frontend Integration
Mục tiêu: Cải thiện UX bằng cách check rule ngay tại UI.

### Tasks:
- [ ] Import shared rules vào `BorrowFormModal`.
- [ ] Implement logic disable nút "Confirm" dựa trên kết quả rule.
- [ ] Hiển thị thông báo lỗi chi tiết khi rule bị vi phạm.

## Phase 06: Verification & Expansion
Mục tiêu: Đảm bảo độ ổn định và mở rộng sang các module khác.

### Tasks:
- [ ] Kiểm tra toàn bộ hệ thống (End-to-end).
- [ ] Lập kế hoạch refactor cho Book Management và User Management.

---
Next Phase: [Phase 01: Shared Foundation](./phase-01-setup.md)

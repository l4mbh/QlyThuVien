# 🎨 DESIGN: Shared Rule Engine & Standardized Errors

**Date:** 2026-04-23
**Status:** Approved
**Reference:** [BRIEF.md](../docs/BRIEF.md) (Concept: Shared Logic & String Errors)

---

## 1. Overview
Hệ thống quản lý logic nghiệp vụ tập trung (Shared Rule Engine) giúp đồng bộ hóa các quy tắc kiểm tra giữa Backend (BE) và Frontend (FE). Thay vì viết các câu lệnh `if-else` rời rạc, chúng ta sử dụng một pipeline các hàm kiểm tra nhỏ (atomic rules) trả về mã lỗi dạng chuỗi (String Error Codes).

---

## 2. Shared Structure (Cách tổ chức)

Thư mục `shared/` nằm ở thư mục gốc của dự án để cả `backend` và `frontend` đều có thể tham chiếu.

```text
shared/
├── rules/               # Chứa các atomic rules theo module
│   ├── borrow.rules.ts
│   └── user.rules.ts
├── constants/
│   └── error-codes.ts   # Mapping string codes (e.g. USER_BLOCKED)
├── types/
│   └── rules.ts         # Định nghĩa Rule type & RuleResult
└── engine/
    └── rule-runner.ts   # Hàm runRules pipeline
```

---

## 3. Technical Specifications

### 3.1. Rule Type Definition
```typescript
export type RuleResult = { ok: true } | { ok: false; code: string; details?: any };

export type Rule<T> = (input: T) => RuleResult;
```

### 3.2. Rule Runner
Hàm `runRules` thực hiện duyệt mảng các rules. Gặp rule đầu tiên trả về `ok: false` thì dừng và trả về kết quả đó.

```typescript
export const runRules = <T>(input: T, rules: Rule<T>[]): RuleResult => {
  for (const rule of rules) {
    const result = rule(input);
    if (!result.ok) return result;
  }
  return { ok: true };
};
```

---

## 4. Integration Flow (Luồng tích hợp)

### 🚀 Frontend (Pre-emptive Validation)
1. User tương tác (chọn sách, chọn ngày).
2. FE gọi `runRules` với dữ liệu hiện có.
3. Nếu vi phạm: 
   - Disable nút "Confirm".
   - Hiển thị tooltip hoặc message giải thích (map từ `ErrorCode` sang tiếng Việt/Anh).

### 🛡️ Backend (Final Protection)
1. Nhận request từ Client.
2. Lấy dữ liệu cần thiết từ DB.
3. Gọi `runRules` với dữ liệu thực tế.
4. Nếu vi phạm: `throw new AppError(result.code)`.
5. Success: Thực hiện transaction ghi DB.

---

## 5. Checklist Kiểm Tra (Acceptance Criteria)

### Module: Borrowing Rules
- [ ] **Rule: isUserActive** - Trả về `USER_BLOCKED` nếu user không ở trạng thái ACTIVE.
- [ ] **Rule: withinLimit** - Trả về `BORROW_LIMIT_EXCEEDED` nếu tổng số sách mượn vượt quá giới hạn của user.
- [ ] **Rule: isStockAvailable** - Trả về `OUT_OF_STOCK` nếu sách không còn bản nào khả dụng.

### System Infrastructure
- [ ] Thư mục `shared/` đã được thiết lập.
- [ ] `backend` có thể import từ `shared/`.
- [ ] `frontend` có thể import từ `shared/`.
- [ ] Toàn bộ mã lỗi numeric cũ đã được map sang string code mới.

---

*Thiết kế bởi Minh - Antigravity Solution Designer*

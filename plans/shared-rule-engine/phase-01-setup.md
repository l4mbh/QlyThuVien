# Phase 01: Shared Foundation
Status: ⬜ Pending
Dependencies: None

## Objective
Thiết lập nền móng kỹ thuật cho việc chia sẻ logic (rules) giữa Backend và Frontend.

## Requirements
### Functional
- [ ] Định nghĩa chuẩn cho kết quả của một Rule.
- [ ] Triển khai hàm chạy pipeline (Rule Runner).
- [ ] Đảm bảo cả BE và FE đều có thể import được từ thư mục `shared/`.

### Non-Functional
- [ ] Type-safety tuyệt đối cho các rules.
- [ ] Hiệu suất: Pipeline phải chạy cực nhanh (không có I/O).

## Implementation Steps
1. [ ] **Tạo cấu trúc thư mục:**
   - `shared/types/`
   - `shared/engine/`
   - `shared/constants/`
2. [ ] **Định nghĩa Rule Types (`shared/types/rules.ts`):**
   ```typescript
   export type RuleResult = { ok: true } | { ok: false; code: string; details?: any };
   export type Rule<T> = (input: T) => RuleResult;
   ```
3. [ ] **Triển khai Rule Runner (`shared/engine/rule-runner.ts`):**
   ```typescript
   export const runRules = <T>(input: T, rules: Rule<T>[]): RuleResult => {
     for (const rule of rules) {
       const result = rule(input);
       if (!result.ok) return result;
     }
     return { ok: true };
   };
   ```
4. [ ] **Cấu hình TypeScript Aliases:**
   - Backend `tsconfig.json`: Thêm `"@shared/*": ["../shared/*"]`.
   - Frontend `tsconfig.json`: Thêm `"@shared/*": ["../../shared/*"]` (hoặc tương đương).

## Test Criteria
- [ ] Tạo một rule giả (mock rule) và chạy thử bằng `runRules` trong console.
- [ ] Kiểm tra import thành công từ Backend.
- [ ] Kiểm tra import thành công từ Frontend.

---
Next Phase: [Phase 02: Standardize Errors](./phase-02-errors.md)

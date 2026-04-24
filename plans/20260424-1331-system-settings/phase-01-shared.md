# Phase 01: Shared Core & Constants
Status: ⬜ Pending

## Objective
Định nghĩa các "luật chơi" chung cho cả Backend và Frontend để đảm bảo tính nhất quán (Type-safety).

## Implementation Steps
1. [ ] [NEW] `packages/shared/src/constants/settings.ts`: Chứa `SettingKey` Enum và `DEFAULT_SETTINGS` object.
2. [ ] [NEW] `packages/shared/src/schemas/settings/setting.schema.ts`: Zod schema để validate từng loại setting (Number, String, Boolean).
3. [ ] [MODIFY] `packages/shared/src/index.ts`: Export các constant và schema mới.

## Test Criteria
- [ ] TypeScript không báo lỗi khi import các hằng số này ở app/api và app/web.
- [ ] Zod schema validate đúng: `BORROW_LIMIT` phải là number, không được là string.

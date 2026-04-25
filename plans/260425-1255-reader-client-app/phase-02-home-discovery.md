# Phase 02: Home & Discovery UI
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Xây dựng trang chủ khám phá sách với phong cách Clean & Professional của hệ thống LibMgnt.

## Implementation Steps
1. [ ] Build `HeroSection`:
   - Headline: "Find your next book" (Font Inter, Semibold, Primary color).
   - Prominent rounded search bar (Focus state sử dụng Primary Blue).
2. [ ] Build `CategoryBar`:
   - Horizontal Scroll chips.
   - Active state: Background Primary Blue, Text White.
   - Inactive state: Background Muted/Gray.
3. [ ] Đảm bảo spacing tuân thủ hệ thống 8px grid của Admin.

## Files to Create/Modify
- `apps/reader/src/features/home/components/HeroSection.tsx` - [New]
- `apps/reader/src/features/home/components/CategoryBar.tsx` - [New]

## Test Criteria
- [ ] Thanh Search có trải nghiệm focus mượt mà, màu sắc đồng nhất.
- [ ] Trạng thái Active của Category rõ ràng, dễ nhận biết.

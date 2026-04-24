# Phase 03: Full Integration
Status: ⬜ Pending

## Objective
Replace old manual headers with the new `PageHeader` across the application.

## Requirements
- Clean up `MainLayout` (move breadcrumb inside PageHeader).
- Update individual pages to use `<PageHeader />`.
- Verify responsive design.

## Implementation Steps
1. [ ] Remove `MainBreadcrumb` from `MainLayout.tsx` (it will be inside PageHeader).
2. [ ] Update `Dashboard.tsx`, `Books.tsx`, etc. to include `<PageHeader />`.
3. [ ] Pass action buttons to `PageHeader` where needed.

## Files to Create/Modify
- `apps/web/src/components/layout/MainLayout.tsx` [MODIFY]
- `apps/web/src/pages/*.tsx` [MODIFY]

# Phase 02: Logic & Route Config
Status: ⬜ Pending

## Objective
Implement the dynamic generation logic using React Router v7 hooks and update route definitions.

## Requirements
- Use `useMatches` to get current route hierarchy.
- Define a standard `handle` structure for breadcrumb labels.
- Handle dynamic segments (e.g., IDs) gracefully.

## Implementation Steps
1. [ ] Update `apps/web/src/routes/AppRouter.tsx` to add `handle: { crumb: 'Label' }` to main routes.
2. [ ] Implement logic in `MainBreadcrumb.tsx` to iterate over matches.
3. [ ] Add logic to filter out routes without crumbs.
4. [ ] Ensure breadcrumb items link correctly to their respective paths.

## Files to Create/Modify
- `apps/web/src/routes/AppRouter.tsx` [MODIFY]
- `apps/web/src/components/ui/main-breadcrumb/main-breadcrumb.tsx` [MODIFY]

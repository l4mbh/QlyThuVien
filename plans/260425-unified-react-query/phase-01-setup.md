# Phase 01: Infrastructure Setup
Status: ✅ Complete
Dependencies: None

## Objective
Establish the foundational infrastructure for React Query in both `apps/reader` and `apps/web` by installing dependencies and configuring the `QueryClientProvider`.

## Tasks
- [ ] Install `@tanstack/react-query` and `@tanstack/react-query-devtools` in `reader` workspace
- [ ] Install `@tanstack/react-query` and `@tanstack/react-query-devtools` in `web` workspace
- [ ] Setup `QueryClient` and `QueryClientProvider` in `apps/reader/src/main.tsx`
- [ ] Setup `QueryClient` and `QueryClientProvider` in `apps/web/src/main.tsx`
- [ ] Create basic configuration (retry logic, default staleTime)

## Files to Create/Modify
- `apps/reader/package.json`
- `apps/web/package.json`
- `apps/reader/src/providers/QueryProvider.tsx` [NEW]
- `apps/web/src/providers/QueryProvider.tsx` [NEW]
- `apps/reader/src/main.tsx` [MODIFY]
- `apps/web/src/main.tsx` [MODIFY]

## Test Criteria
- [ ] Both apps build successfully
- [ ] React Query DevTools appear in development mode
- [ ] No regression in existing mock-data UI

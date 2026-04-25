# Phase 04: Admin Migration
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Migrate the `web` (Admin) application's data management logic to React Query, focusing on table views, data mutation, and cache invalidation.

## Tasks
- [ ] Refactor `BookManagement` table to use `useQuery` with pagination support
- [ ] Refactor `ReaderManagement` table to use `useQuery`
- [ ] Implement `useMutation` for Create/Update/Delete operations
- [ ] Setup automatic cache invalidation (e.g., refetch book list after creating a new book)
- [ ] Replace manual refresh buttons with React Query's automatic sync

## Test Criteria
- [ ] Admin tables reflect changes immediately after mutations
- [ ] Sorting and filtering in tables work seamlessly with React Query state
- [ ] DevTools show correct cache invalidation patterns

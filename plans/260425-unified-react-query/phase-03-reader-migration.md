# Phase 03: Reader Migration
Status: ✅ Complete
Dependencies: Phase 02

## Objective
Migrate the `reader` application's data fetching logic to React Query using the shared services and keys.

## Tasks
- [ ] Refactor `HomePage.tsx` to use `useQuery` for book list
- [ ] Refactor `BookDetailModal.tsx` to use `useQuery` for specific book details
- [ ] Refactor `MyBooksPage` to use `useQuery` for borrowed books
- [ ] Refactor `NotificationsPage` to use `useQuery` for notifications
- [ ] Implement Pull-to-refresh (Refresh on mount) logic
- [ ] Replace local state loading with React Query's `isLoading` and `isFetching`

## Test Criteria
- [ ] Navigation between tabs is instantaneous (using cached data)
- [ ] "My Books" updates correctly after data refetch
- [ ] Loading skeletons appear correctly on first load

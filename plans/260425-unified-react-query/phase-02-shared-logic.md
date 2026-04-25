# Phase 02: Shared Logic Layer
Status: ✅ Complete
Dependencies: Phase 01

## Objective
Centralize API calling logic and query keys within the monorepo to avoid duplication and ensure consistency between Admin and Reader apps.

## Tasks
- [ ] Create `packages/shared/src/api-client` directory
- [ ] Define `QUERY_KEYS` constants (e.g., BOOKS, USERS, BORROWS)
- [ ] Implement shared fetcher functions using the base Axios configuration
- [ ] Export shared types/interfaces for API responses
- [ ] Link `packages/shared` updates to both `reader` and `web` apps

## Files to Create/Modify
- `packages/shared/src/constants/queryKeys.ts` [NEW]
- `packages/shared/src/services/book.service.ts` [NEW]
- `packages/shared/src/services/user.service.ts` [NEW]
- `packages/shared/index.ts` [MODIFY]

## Implementation Notes
We will use a pattern where each service function returns a Promise from Axios, which can then be used directly by `useQuery` in the apps.

Example:
```typescript
// packages/shared/src/services/book.service.ts
export const getBooks = async () => {
  const { data } = await api.get('/books');
  return data;
};
```

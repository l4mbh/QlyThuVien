# Phase 01: Database & Types

## Objective
Update the database schema to support inventory logging and define shared types between frontend and backend.

## Implementation Steps
1. [x] **Prisma Schema**:
   - Add `InventoryLogReason` Enum (`RESTOCK`, `DAMAGED`, `LOST`, `MANUAL_ADJUST`).
   - Add `InventoryLog` Model with `bookId`, `change`, `reason`, `note`, `userId`.
   - Add relation to `Book`.
2. [x] **Migration**: Run `npx prisma migrate dev`.
3. [x] **Backend Types**:
   - Update `book.entity.ts` with `InventoryLogEntity` and `AdjustInventoryDTO`.
4. [x] **Frontend Types**: Update API client types to match backend DTOs.

## Test Criteria
- [x] Prisma studio shows the new `InventoryLog` table.
- [x] Types are consistent and clean.

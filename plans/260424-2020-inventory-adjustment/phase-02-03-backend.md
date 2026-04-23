# Phase 02 & 03: Backend Implementation

## Objective
Implement the transactional logic for inventory adjustment and expose secure API endpoints.

## Requirements
- **Transaction**: Book update and Log creation must be atomic.
- **Rules**: Implement logic for RESTOCK, DAMAGED, and MANUAL_ADJUST.
- **Security**: Ensure `userId` is captured from the request (Auth context).

## Implementation Steps
1. [x] **BookService**: Implement `adjustInventory` with `prisma.$transaction`.
2. [x] **BookService**: Implement `getInventoryLogs` with pagination.
3. [x] **BookController**: Add handlers for the new actions.
4. [x] **BookRoutes**: Register `POST /:id/inventory-adjustments` and `GET /:id/inventory-logs`.

## Test Criteria
- [x] API successfully updates both total and available for RESTOCK.
- [x] API rejects adjustment if it results in negative stock.
- [x] Log is created with correct `userId` and `note`.

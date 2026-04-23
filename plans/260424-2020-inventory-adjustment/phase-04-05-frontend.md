# Phase 04 & 05: Frontend UI & Integration

## Objective
Build the adjustment interface and history viewer, then integrate them into the book management workflow.

## Requirements
- **Modal**: Interactive preview showing "Before vs After".
- **History**: Clear table with staff names and colored badges for quantity changes.

## Implementation Steps
1. [x] **BookService (FE)**: Add `adjustInventory` and `getInventoryLogs` API calls.
2. [x] **InventoryAdjustmentModal**: Create the form with preview logic.
3. [x] **InventoryHistoryTab**: Create the log table component.
4. [x] **Integration**: 
   - Add "Adjust Stock" button to Book management.
   - Add the History tab to the Book detail view.

## Test Criteria
- [x] Preview correctly calculates changes based on reason.
- [x] Table shows real-time data after adjustment.
- [x] Staff name is visible in the log list.

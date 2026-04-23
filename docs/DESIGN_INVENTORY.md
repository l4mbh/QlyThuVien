# 🎨 DESIGN: Inventory Adjustment & Audit System

**Date**: 2026-04-24
**Status**: Approved (v2.1)

---

## 1. Database Schema (How we store data)

### Enum: InventoryLogReason
- `RESTOCK`: Adding new physical copies. (Impacts Both)
- `DAMAGED`: Removing physical copies due to damage. (Impacts Both)
- `LOST`: Removing physical copies because they are missing. (Impacts Both)
- `MANUAL_ADJUST`: Correcting data discrepancies. (Impacts Available Only)

### Model: InventoryLog
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| bookId | UUID | Foreign Key to Book |
| change | Int | Quantity change (+/-) |
| reason | Enum | The type of adjustment |
| note | String? | Staff comments |
| userId | UUID | Foreign Key to User (CreatedBy) |
| createdAt | DateTime | Timestamp of adjustment |

---

## 2. API Contract (How app talks to server)

### POST `/api/books/:id/inventory-adjustments`
**Request Body:**
```json
{
  "change": number,
  "reason": "RESTOCK" | "DAMAGED" | "LOST" | "MANUAL_ADJUST",
  "note": string
}
```
**Logic Flow:**
1. Fetch Book.
2. Validate: `book.availableQuantity + change >= 0`.
3. Validate: `book.totalQuantity + change >= (book.totalQuantity - book.availableQuantity)`.
4. Transaction:
   - Update Book quantities based on reason rules.
   - Create InventoryLog with `req.user.id`.

### GET `/api/books/:id/inventory-logs`
**Response:** `InventoryLog[]` (including user name).

---

## 3. UI Components (The Building Blocks)

### InventoryAdjustmentModal
- **Header**: "Adjust Inventory - [Book Title]"
- **Stats Card**: Shows Borrowed (Total-Avail), Available, Total.
- **Form**:
  - Change Input (Number)
  - Reason Select
  - Note Textarea
- **Preview**: Comparison of Current vs New (with color indicators).

### InventoryHistoryTab
- **Table**: `Date`, `Change`, `Reason`, `Staff`, `Note`.
- **Styling**: `change > 0` (text-green-600), `change < 0` (text-red-600).

---

## 4. Test Cases (Acceptance Criteria)

### TC-01: Restock Logic
- **Given**: Total: 10, Available: 5.
- **When**: Adjust `RESTOCK` +2.
- **Then**: Total: 12, Available: 7. Log created.

### TC-02: Damaged Logic
- **Given**: Total: 10, Available: 5.
- **When**: Adjust `DAMAGED` -2.
- **Then**: Total: 8, Available: 3. Log created.

### TC-03: Negative Available Guard
- **Given**: Available: 2.
- **When**: Adjust -5.
- **Then**: Reject with error "Insufficient stock on shelf".

### TC-04: Audit Completeness
- **Check**: Log must contain the `userId` of the logged-in staff member.

---
*Created by AWF 2.1 - Design Phase*

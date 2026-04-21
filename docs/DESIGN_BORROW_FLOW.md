# 🎨 DESIGN: Borrow Management Module

**Date:** 2026-04-22
**Status:** Design Completed
**Reference:** [BRIEF_BORROW_FLOW.md](../docs/BRIEF_BORROW_FLOW.md)

---

## 1. Database Schema (Prisma Perspective)

We use the existing `BorrowRecord` and `BorrowItem` models.

### Relationships:
- `User` (1) <---> (N) `BorrowRecord`
- `BorrowRecord` (1) <---> (N) `BorrowItem`
- `Book` (1) <---> (N) `BorrowItem`

### State Mapping:
- `BorrowRecord.status`: `BORROWING`, `OVERDUE`, `COMPLETED`
- `BorrowItem.status`: `BORROWING`, `RETURNED`, `OVERDUE`

---

## 2. Component Architecture

### Page Components:
- `BorrowPage`: Main container.
- `BorrowTable`: DataTable integration.
- `BorrowColumns`: Column definitions with Status Badges.

### Interaction Components:
- `BorrowModal`: The POS-style interface.
    - `ReaderSearch`: Autocomplete for users.
    - `BookSearch`: Autocomplete for available books.
    - `BorrowCart`: Table of selected items for the current transaction.
- `BorrowDetailDrawer`: Right-side panel for record details and returning books.

---

## 3. Interaction Flows

### Flow 1: High-Speed Borrowing
1. Click "New Borrow".
2. Search reader by Name/Email.
3. Validate: If `status === BLOCKED` or `currentBorrowCount >= borrowLimit`, show error.
4. Search book by Title/CallNumber.
5. Add to cart. Validate: `availableQuantity > 0`.
6. Set `dueDate` (Default +14 days).
7. Confirm.

### Flow 2: Returning Books
1. Open `BorrowDetailDrawer` from table row.
2. View list of items.
3. Click "Return" on a `BORROWING` item.
4. UI updates status to `RETURNED`.
5. If all items in record are returned, record status becomes `COMPLETED`.

---

## 4. Test Cases & Acceptance Criteria

| ID | Case | Expected Result |
|----|------|-----------------|
| TC-01 | Select Blocked Reader | Show "User is blocked" and prevent selection. |
| TC-02 | Exceed Borrow Limit | Prevent adding more books if total would exceed limit. |
| TC-03 | Out of Stock Book | Book does not appear in search or shows as "Unavailable". |
| TC-04 | Partial Return | Single book returned, stock increases, reader count decreases, record stays `BORROWING`. |
| TC-05 | Full Return | All books returned, record becomes `COMPLETED`. |
| TC-06 | Overdue Highlight | Records with `dueDate < today` and status `BORROWING` show red badge/row. |

---

*Designed by Antigravity Strategy Team*

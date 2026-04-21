# 💡 BRIEF: Borrow Flow (Single Modal POS)

**Date:** 2026-04-21
**Status:** Brainstorming Completed

---

## 1. Problem Statement
The current system allows managing books and readers but lacks the core functionality of tracking who borrowed what. We need a high-efficiency interface for staff to record borrow transactions.

## 2. Solution: Single Modal POS
Instead of a multi-step wizard, use a single modal interface divided into logical sections to minimize clicks and context switching.

## 3. User Flow (Staff)
1.  **Open Modal:** Click "New Borrow" on Dashboard or Borrowing page.
2.  **Select Reader:** Search and select a reader. System validates status and limits immediately.
3.  **Add Books:** Search and select books. Validates availability. Selected books appear in a "Cart" list.
4.  **Review & Confirm:** Set due date (defaults to +14 days), check summary, and click Confirm.

## 4. Key Features

### 🚀 MVP (Required)
- [ ] **Unified Borrow Modal:** Single window layout.
- [ ] **Smart Reader Search:** Search by name/email with status indicators.
- [ ] **Book Cart System:** Add/remove multiple books before confirming.
- [ ] **Real-time Validation:** 
    - Blocked readers cannot borrow.
    - Cannot exceed reader's `borrowLimit`.
    - Cannot borrow out-of-stock books.
- [ ] **Database Transaction:** Atomic operation for creating records and updating stock/counts.
- [ ] **Call Number Visibility:** Display call numbers in the cart to ensure the physical book matches.

### 🎁 Phase 2 (Optional)
- [ ] **Late Fee Calculation:** Automated fine logic based on overdue days.
- [ ] **Renew Logic:** Extend due date for existing records.
- [ ] **Print Receipt:** Generate a simple PDF/Thermal print layout.

## 5. Technical Considerations
- **Frontend:** `react-hook-form` with `zod` for the modal state. `useDataTable` pattern for any listing.
- **Backend:** `borrow.controller`, `borrow.service`, `borrow.repository`.
- **Database:** Prisma transaction to update `Book.availableQuantity` and `User.currentBorrowCount`.

## 6. Next Steps
1. Run `/plan` to define specific API endpoints and Task List.
2. Update Prisma schema if necessary (verified: already exists).
3. Implement Backend logic first, then Frontend UI.

# Phase 02: Core Service Logic
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Triển khai `ReservationService` với logic tính toán vị trí động và hàm điều phối trung tâm `promoteNext`.

## Implementation Steps
1. [ ] **`calculatePosition(userId, bookId)`**:
   - Logic: Đếm số bản ghi `PENDING` của `bookId` đó có `createdAt < currentUser.createdAt`.
2. [ ] **`promoteNext(bookId)` (Central Function)**:
   - Bước 1: Tìm người `PENDING` đầu tiên.
   - Bước 2: Chuyển sang `READY`.
   - Bước 3: Set `expiresAt = now + 24h`.
   - Bước 4: Trừ tồn kho sách (`availableQuantity -= 1`) - **Soft Allocation**.
3. [ ] **`createReservation(userId, bookId)`**:
   - Kiểm tra Idempotency (không cho đặt trùng).
   - Kiểm tra `borrowLimit`.
   - Tự động gọi `promoteNext` nếu sách còn dư.
4. [ ] **Integration with `BorrowService`**:
   - Hook vào hàm `returnBook`: Gọi `promoteNext` ngay sau khi nhận sách trả.

## Files to Create/Modify
- `apps/api/src/services/reservation/reservation.service.ts` [NEW]
- `apps/api/src/services/borrow/borrow.service.ts` [MODIFY]

## Test Criteria
- [ ] Hàm `promoteNext` xử lý đúng khi có nhiều người đang đợi.
- [ ] `availableQuantity` giảm đúng khi có người chuyển sang trạng thái READY.

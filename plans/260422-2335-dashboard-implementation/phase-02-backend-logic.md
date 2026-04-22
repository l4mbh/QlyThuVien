# Phase 02: Backend Report Logic
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Triển khai logic truy vấn dữ liệu aggregate từ database bằng Prisma.

## Implementation Steps
1. [ ] Triển khai `getSummaryStats`: Sử dụng `Promise.all` để đếm Total Books, Available, Active Borrows, Overdue.
2. [ ] Triển khai logic tính `totalFines` (Dựa trên field `fineAmount` trong `BorrowItem`).
3. [ ] Triển khai `getBorrowTrends`: Nhóm dữ liệu theo ngày trong 7-30 ngày gần nhất.
4. [ ] Triển khai `getTopBooks`: Tìm top sách có số lượt mượn cao nhất.
5. [ ] Triển khai `getOverdueItems`: Lấy danh sách chi tiết sách quá hạn.

## Test Criteria
- [ ] Kết quả aggregate khớp với dữ liệu thực tế trong DB.
- [ ] Thời gian phản hồi API < 200ms.

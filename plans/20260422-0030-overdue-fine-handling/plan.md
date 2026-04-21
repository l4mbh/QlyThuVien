# Plan: Overdue & Fine Handling System
Created: 2026-04-22T00:32:00Z
Status: 🟡 In Progress

## Overview
Nâng cấp hệ thống mượn sách để hỗ trợ tự động phát hiện sách quá hạn và tính toán tiền phạt dựa trên số ngày trễ (rate: 5,000 VND/ngày). Hệ thống sử dụng triết lý "Compute on Read" để đảm bảo tính thời thực và chỉ chốt tiền phạt vào Database khi sách được trả thành công.

## Tech Stack
- Backend: Node.js (Prisma)
- Frontend: React (shadcn/ui, lucide-react, date-fns)
- Logic: Dynamic calculation (no cron jobs)

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Phase 01: Database & Types | ✅ Complete | 100% |
| 02 | Phase 02: Backend: Return & Fine Logic | ✅ Complete | 100% |
| 03 | Phase 03: UI: Borrow Tracking & Highlights | ✅ Complete | 100% |
| 04 | Phase 04: UI: Reader Overdue Profile | ✅ Complete | 100% |
| 05 | Phase 05: Integration & Final Testing | ✅ Complete | 100% |

---

## Quick Commands
- Check progress: `/next`
- Save context: `/save-brain`
- Code Phase 1: `/code phase-01`

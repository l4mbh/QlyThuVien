# Plan: Thêm tính năng Thông báo khi Huỷ Đặt Sách (Cancel Reservation Notification)
Created: 26/05/2026 - 17:56
Status: 🟡 In Progress

## Overview
Khi Admin hoặc Staff huỷ một reservation của độc giả, hệ thống yêu cầu Admin phải chọn hoặc nhập lý do huỷ. Lý do này sẽ được ghi nhận vào cơ sở dữ liệu và một thông báo sẽ được gửi tự động đến độc giả, hiển thị rõ ràng lý do huỷ.

## Tech Stack
- Shared: Constants, Enums, API Interfaces
- Database: Prisma (`Reservation` schema updates)
- Backend: Express, Prisma Client, Notification Service
- Frontend (Admin): React (Next.js/Vite), Tailwind, Components (Cancel Modal)
- Frontend (Reader): React, NotificationList Component

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Database Schema | ⬜ Pending | 0% |
| 02 | Shared Packages | ⬜ Pending | 0% |
| 03 | Backend API | ⬜ Pending | 0% |
| 04 | Frontend (Admin & Reader) | ⬜ Pending | 0% |
| 05 | Testing & Integration | ⬜ Pending | 0% |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`

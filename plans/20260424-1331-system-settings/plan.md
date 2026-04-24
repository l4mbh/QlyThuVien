# Plan: Bulletproof System Settings
Created: 2026-04-24
Status: 🟡 In Progress

## Overview
Xây dựng hệ thống cấu hình runtime (System Settings) cho phép Admin thay đổi các quy tắc nghiệp vụ (Borrow limits, Fine rates, Notification routing) ngay tại giao diện mà không cần deploy lại code.

## Tech Stack
- **Database:** Prisma (PostgreSQL) - JSONB fields.
- **Backend:** Node.js Express, Zod Validation, In-memory Cache.
- **Frontend:** React + Vite, shadcn/ui, Zod.
- **Shared:** TypeScript Enums, Zod Schemas.

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Shared Core & Constants | ⬜ Pending | 0% |
| 02 | Database Migration | ⬜ Pending | 0% |
| 03 | Backend Service & Cache | ⬜ Pending | 0% |
| 04 | API Endpoints | ⬜ Pending | 0% |
| 05 | Frontend UI & Components | ⬜ Pending | 0% |
| 06 | Integration & Testing | ⬜ Pending | 0% |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`

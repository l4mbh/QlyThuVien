# Phase 01: Backend API Refactor & New Endpoints
Status: ⬜ Pending

## Objective
Implement specialized endpoints for the dashboard to provide actionable data.

## Requirements
- Create `getLowStockBooks` logic.
- Update `getSummary` to include month-over-month growth (optional but recommended).
- Ensure role-based data filtering (Fines only for ADMIN).

## Tasks:
- [ ] Update `ReportService` with new analytical methods.
- [ ] Create `GET /reports/low-stock` endpoint.
- [ ] Refactor `GET /reports/summary` to return standardized `DashboardSummary` DTO.
- [ ] Update `GET /reports/overdue` to return top N prioritized items.
- [ ] Test API responses with Postman/Thunder Client.

## Files to Create/Modify
- `backend/src/services/report/report.service.ts`
- `backend/src/controllers/report/report.controller.ts`
- `backend/src/routes/report/index.ts`

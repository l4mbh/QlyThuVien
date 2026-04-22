# Changelog

All notable changes to this project will be documented in this file.
 
## [2026-04-23] - Admin Reporting & Auth Stability
### Added
- **Admin Reporting System**: Integrated on-demand snapshots for Monthly performance, Inventory status, and Reader activity.
- **Export Capabilities**: Multi-format exports (CSV via PapaParse, PDF via jsPDF) for all reporting modules.
- **Enhanced Auth Logging**: Detailed debug logs in AuthHook for faster session troubleshooting.

### Fixed
- **Auth Session Persistence**: Resolved "văng ra login" bug by synchronizing user state initialization from localStorage on mount.
- **JSON Parse Errors**: Fixed `SyntaxError: "undefined" is not valid JSON` in AuthProvider initialization.
- **Backend Service Stability**: Resolved Prisma runtime errors in ReportService due to invalid nested field comparisons.
- **CSV Browser Crash**: Replaced `json2csv` with `papaparse` to eliminate Node.js stream dependency crashes in browsers.
- **Data Mapping Sync**: Corrected `authService.getMe()` frontend mapping to match backend response structure.
- **Recharts Layout**: Fixed sizing warnings by adding explicit container heights to Dashboard charts.

## [2026-04-22] - Overdue & Fine Management
### Added
- **Overdue Detection System**: Dynamic "Compute-on-read" pattern for 100% accurate overdue tracking without cron jobs.
- **Fine Calculation Engine**: Automated penalty calculation (5,000 VND/day) integrated into the return transaction.
- **Reader Reliability Profile**: Lifetime total fine paid and current overdue count added to reader details.
- **Visual Warning System**: Overdue pulse badges, highlighted table rows, and payment warning modals.
- **UX Row-Click**: Enhanced navigation by enabling row-click to open detail drawers in Readers and Borrow tables.

### Changed
- **Database Schema**: Added `fineAmount` to `BorrowItem` for historical financial tracking.
- **Backend Services**: Updated `UserService` and `BorrowService` with atomic transaction logic for fines and stats.

### Fixed
- **Type Compatibility**: Fixed Prisma/TypeScript `null` vs `undefined` mismatches for optional financial fields.
- **Import Integrity**: Resolved missing `date-fns` formatting utilities in detail drawers.

## [2026-04-21] - Phase 4 & Borrow System
### Added
- **Borrow Management Module**: Complete POS-style borrowing system.
- **Single Modal Workflow**: Integrated reader/book selection and cart in one modal.
- **Real-Time Validation**: Automated checks for reader limits, stock availability, and blocked status.
- **Borrow Detail Drawer**: Quick view of transaction history with item-level return functionality.
- **API Endpoints**: `POST /borrow`, `POST /borrow/return`, `GET /borrow`.

### Changed
- **Type Refactoring**: Centralized borrow entities and DTOs in `@/types/borrow`.
- **Service Sync**: Updated `reader-detail-drawer.tsx` to utilize the new unified borrow API.
- **UX Polish**: Added glassmorphism and smooth animations to the borrowing interface.

### Fixed
- **TypeScript Build Errors**: Resolved all type mismatches and optional property issues for production build.

## [2026-04-20] - Phase 3 & Standardization
### Added
- **Standardized DataTable**: Implemented generic `DataTable` component with server-side pagination, sorting, and search.
- **useDataTable Hook**: Centralized state management for table operations.
- **Bulk Operations**: Added bulk delete functionality for Categories with backend validation (prevents deleting categories containing books).
- **Backend Enhancements**: Added `findByIdsWithCount` and `deleteMany` to `CategoryRepository`.
- **API Endpoints**: `DELETE /api/categories/bulk` for bulk operations.
- **Global Localization**: Switched entire UI and toast notifications to English.

### Changed
- **Category Migration**: Refactored `CategoriesPage` and `CategoryTable` to use the new standardized components.
- **Auth UI**: Translated Login, Register, and Sidebar to English.
- **Component Standard**: Standardized all UI components to use consistent naming and encapsulation patterns.

### Fixed
- **Vite SyntaxError**: Fixed `@tanstack/react-table` import issues by using `import type`.
- **API Response Sync**: Ensured frontend correctly handles the standardized `HTTP 200 Always Success` backend responses.

## [Earlier Updates]
- **Category Module**: Initial category management and Category Code auto-generation.
- **ISBN Service**: Integrated Google Books and OpenLibrary APIs for smart data fetching.
- **Authentication**: JWT-based auth system with Protected Routes and RBAC.
- **Database Schema**: Implemented Prisma models for Users, Categories, Books, and Borrowing.

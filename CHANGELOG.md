# Changelog

All notable changes to this project will be documented in this file.

## [2026-04-29] - Reservation Over-promotion Fix & Self-healing System
### Added
- **Self-healing Mechanism**: Integrated `rebalanceREADYReservations` into the backend ecosystem.
    - **Periodic Cleanup**: The `reservation-cleanup.job.ts` now runs a global rebalance check every 15 minutes.
    - **On-Mutation Rebalance**: Automatic rebalance triggered during `updateBook` and `adjustInventory` to ensure data consistency after stock changes.
- **System Memory**: Initialized `.brain` structure (`brain.json`, `session.json`) to persist project knowledge and progress.

### Fixed
- **Reservation Over-promotion**: Resolved a logic bug where more users could be marked as `READY` than books available on the shelf.
- **Backend Type Safety**: Fixed a Prisma type mismatch in `BookService.updateBook` by properly destructuring DTOs.
- **FIFO Integrity**: Ensured that the oldest reservations are preserved during rebalance operations while the newest ones are reverted to `PENDING`.

## [2026-04-27] - Reservation State Machine & Reader UX Hardening
### Added
- **Reservation State Machine**: Implemented a strict `PENDING` ↔ `READY` state machine.
    - **Rebalance Logic**: Automatically reverts `READY` reservations back to `PENDING` (clearing `expiresAt`) if stock is depleted by walk-ins or other loans.
    - **Promotion Logic**: Automatically promotes the oldest `PENDING` reservation to `READY` (granting a fresh 24h `expiresAt`) when a book is returned.
- **Notification Polish**:
    - **Pulsing Red Dot**: Added "New Notification" signals to `BottomNav` (Mobile) and `MainSidebar` (Desktop).
    - **Auto-Mark-Read**: Integrated logic to automatically mark all notifications as read when entering the Notifications page.
- **Reader UI Hardening**:
    - **"No book available" Label**: In `ReservationList`, if a reservation is `READY` but stock is temporarily 0, it explicitly shows "No book available for now".
    - **Skeleton Loaders**: Standardized skeleton loaders for Home, Search, and Notifications.
    - **Empty States**: Added descriptive empty states for Notifications.

### Changed
- **API Realignment**: Updated notification API from `PATCH /read-all` to `POST /mark-all-read` to match shared API standards.
- **Inventory Logic**: Refactored `borrowItems` to consider `PENDING` reservations in "Effective Availability" to prevent over-borrowing.

### Fixed
- **Infinite Loop**: Resolved a critical React `useEffect` infinite loop in the Notifications page that caused `ERR_INSUFFICIENT_RESOURCES`.
- **Backend Build Error**: Fixed missing `_count` property in `BorrowService` by including reservation counts in Prisma queries.
- **Reference Errors**: Restored missing component imports (`LoginPage`, `MyBooksPage`, `Skeleton`) in `App.tsx` and `useAuth` in `MainLayout.tsx`.
- **Staff Dashboard Glitch**: Prevented "Urgent Pickup" alerts for books with 0 available quantity.

## [2026-04-26] - Phase 06 System Recovery & Singleton Standardization
### Added
- **Master Architecture Standard**: Created `.brain/ARCHITECTURE.md` to document the core monorepo structure and patterns.
- **Reservation Loopback**: Linked the Reader App's "Borrow" button to the Backend Reservation API, ensuring reader requests are visible to Admin.

### Changed
- **Service Singleton Pattern**: Refactored ALL backend services (Book, User, Borrow, Reservation, Notification) to be exported as singletons to prevent `this` context binding errors in Express.
- **Backend Stability**: Removed all `this.` references from controllers and switched to direct service singleton calls.
- **Brain Sync**: Updated `.brain/brain.json` and `.brain/session.json` to capture the new architectural standards.

### Fixed
- **Internal Server Error**: Resolved `Cannot read properties of undefined (reading 'getAllBooks')` and similar crashes across all controllers.
- **Pagination Logic**: Fixed book list fetching by restoring `parseInt` for query parameters.
- **Reader Dummy Buttons**: Fixed "Borrow" button in `BookDetailModal` that previously had no functional API call.

## [2026-04-25] - Phone-First Identity Migration
### Added
- **Identity-lite System**: Transitioned from mandatory Email/Password to a UX-first Phone-first identity model.
- **Normalized Phone Logic**: Implemented centralized phone normalization (VN standard) to prevent duplicate identities.
- **Staff Phone Lookup**: Replaced reader dropdown in Admin App with a high-speed Phone Lookup interface.
- **Guest Auto-Creation**: Enabled seamless "Find-or-Create" logic during borrowing; new users are created silently as guests.
- **Reader Mobile App UX**: 
    - Dedicated `LoginPage` using only phone number.
    - `AuthGuard` protecting personal borrowing data.
    - `My Bookshelf` dashboard with real-time loan status tracking (Due Soon/Overdue).
- **Identity Header Protocol**: Standardized `X-Reader-Phone` header for authenticated API calls from the Reader app.
- **API Documentation**: Generated comprehensive Markdown and OpenAPI/Swagger specifications for the new identity flow.

### Changed
- **Prisma Schema**: Added `phoneRaw`, `phoneNormalized`, and `isGuest` fields to the User model.
- **Auth Middleware**: Enhanced `authMiddleware` to resolve user identity from either JWT (Staff) or Phone Header (Reader).
- **Shared API Factory**: Updated `createSharedApiClient` to support dynamic custom headers.

### Fixed
- **Client Inventory Logic**: Resolved "Out of Stock" bug in Reader App caused by `availableCount`/`availableQuantity` field mismatch.
- **ReferenceError Fix**: Resolved `readerSearch` variable mismatch in the BorrowModal component.

## [2026-04-23] - Dashboard Overhaul & Inventory Hardening
### Added
- **Bento Grid Command Center**: Redesigned the Dashboard with a modern Bento Grid layout, prioritizing actionable signals and operational intelligence.
- **Inventory Alerts**: New "Low Stock" panel with real-time monitoring of available quantities (< 3 books).
- **Revenue Insights**: RBAC-protected financial snapshot for Admin, featuring a premium dark-mode interface.
- **Enhanced Stats Cards**: Support for monthly trends (e.g., "+5 this month") and context-aware styling.
- **Overdue Table Polish**: Integrated "Remind" action (Bell icon) and explicit due dates for critical loans.
- **Top Books Covers**: Re-designed popular books list with book cover previews and loan-count signals.
- **Inventory Directional UI**: Implemented `+` and `-` button controls in Inventory Management with smart directional logic (Restock/Lost/Damaged).

### Fixed
- **Dashboard API Efficiency**: Refactored data fetching to use `Promise.all` for parallel analytical data retrieval.
- **Revenue Visibility**: Resolved text contrast issues on dark-themed cards using a new `isDark` prop system.
- **Type Safety**: Fixed `TopBook` and `StatsCard` type mismatches that caused production build failures.
- **Inventory Preview**: Improved stock change transparency in the inventory modal with delta visualization (e.g., `10 -> 8 (-2)`).

 
## [2026-04-24] - Librarian Command Center V2
### Added
- **Notification System (Phase 2)**: Full implementation of a real-time, event-driven notification engine.
- **Metadata-Driven Architecture**: Refactored notifications to use structured JSON metadata instead of hardcoded strings, allowing for dynamic frontend rendering and future deep-linking.
- **Prisma Schema Update**: Enhanced `Notification` model with a `metadata` (JSONB) field and made `message` optional for flexible event payloads.
- **NotificationBell Component**: Premium dropdown UI featuring dynamic message rendering, type-aware icons, unread counting, and optimized 5s polling.
- **Automated Overdue Alerts**: Daily Node-cron job (08:00 AM) that scans for overdue books and sends targeted notifications to readers.
- **Workflow-Driven Dashboard**: Replaced static reports with a "Command Center" featuring tabs for Daily Operations, Overdue Actions, and Finance.
- **Branded PDF Export Engine**: Professional, official-branded PDF generation for Daily Logs, Collection Health, and Monthly reports with headers/footers.
- **Actionable Overdue Management**: Real-time overdue list with automated fine estimation and integrated reader contact (Phone).
- **Collection Health Audit**: Automated detection of "Dead Stock" (no activity > 6m) and "Best Sellers" for inventory rotation.
- **Financial Ledger**: Daily reconciliation view for collected fines.
- **Print Optimization**: Global `@media print` CSS for high-quality browser-based reporting.

### Fixed
- **Vite Module Resolution**: Implemented a **Proxy-based Alias Strategy** using internal `src/shared` files to resolve cross-directory transpilation issues, ensuring standardized logic (Error Codes, Borrow Rules) is shared safely between Frontend and Backend.
- **TypeScript Verbatim Compliance**: Fixed production build errors by converting entity imports to `import type`.
- **JSX Entity Escaping**: Resolved build-breaking unescaped characters in UI components.
- **Report Service Logic**: Corrected collection health aggregation to use `totalQuantity`/`availableQuantity` mapping instead of non-existent status fields.
- **Badge Pathing**: Standardized import paths for UI components following the folder encapsulation rule.

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

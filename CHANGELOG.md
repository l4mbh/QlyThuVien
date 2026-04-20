# Changelog

All notable changes to this project will be documented in this file.

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

# Changelog

All notable changes to this project will be documented in this file.

## [2026-04-19]

### Added
- **Authentication Module (FE)**:
    - Integrated Login and Register pages with beautiful glassmorphism UI.
    - Implemented `useAuth` hook and `AuthProvider` for JWT management.
    - Added `ProtectedRoute` component for route guarding.
    - Created `authService` for API interactions.
- **Role-based Access Control**:
    - Implemented conditional rendering in Sidebar based on user roles (`ADMIN`/`STAFF`).
    - Added role protection to routes.
- **UI Improvements**:
    - Added `Library-main.png` as background for auth pages.
    - Polished Header to show active user's name.

### Fixed
- **Database Connection**: Resolved Prisma `P1000` error by correcting database name in `.env` and restarting server.
- **TypeScript Compatibility**: Fixed `erasableSyntaxOnly` error by replacing `enum` with `const object` + `type` in `user.entity.ts`.
- **Axios Configuration**: Updated base URL and added interceptors for JWT injection and 401/500 error handling.

### Tech Stack Updated
- Backend: Node.js, Express, Prisma, PostgreSQL.
- Frontend: React, Vite, Tailwind CSS v3, shadcn/ui.

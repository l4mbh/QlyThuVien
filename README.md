# LibMgnt - Enterprise-Grade Library Management System

LibMgnt is a high-performance, full-stack monorepo application designed to manage modern library operations with precision. Built using a robust technical stack including Node.js, Express, React 19, and Prisma, the system demonstrates advanced software engineering principles such as centralized rule orchestration, atomic transaction handling, and a unified type system.

## Core Architecture

The system is built on a foundation of scalability and maintainability, utilizing the following architectural patterns:

### 1. Monorepo Infrastructure
Managed via pnpm Workspaces, the project maintains a clear separation between the API, Web frontend, and Shared packages. This ensures zero-dependency hoisting and seamless internal linking, allowing the shared brain of the system to be utilized by both the frontend and backend without duplication.

### 2. Backend MVC Pattern
The backend (apps/api) strictly follows the Model-View-Controller architecture:
- Models: Defined via Prisma for type-safe database interactions.
- Controllers: Handle incoming HTTP requests, input normalization, and response orchestration.
- Services: Encapsulate the core business logic and external integrations, ensuring controllers remain lean.
- Middleware: Implemented inline within route definitions for maximum traceability of the request flow.

### 3. Type-First Development
The system enforces 100% Type-Safety across the entire stack. All interfaces, types, and enums reside in the root types directory within the shared package. This "Single Source of Truth" approach eliminates "any" types and ensures that API contract changes are immediately caught during development.

### 4. HTTP 200 Always Success Strategy
To simplify frontend error handling and maintain a consistent communication protocol, the backend always returns an HTTP 200 status code. Success or failure is handled within the response body:
- Success: { "data": [...], "code": 0 }
- Error: { "error": { "msg": "Detailed error message" }, "code": 1001 }

## Key Features and Functionalities

### 1. Authentication and RBAC
A secure, JWT-based authentication system with persistent session management.
- Role-Based Access Control (RBAC): Differentiates between Admin, Staff, and Reader roles.
- Protected Routes: Guards both backend endpoints and frontend navigation based on user permissions.

### 2. Book and Category Management
Comprehensive cataloging system for library assets.
- Metadata Integration: Supports ISBN-based automated book metadata fetching.
- Asset Tracking: Manages book stock, cover images, and availability status in real-time.
- Standardized Categories: Hierarchical organization of books for efficient searching.

### 3. Reader Management
A dedicated module for managing library members.
- Profile Management: Detailed reader records with activity history.
- Status Control: Ability to block/active readers based on compliance with library rules.
- Drawer-Based UI: High-density data viewing using modern drawer components.

### 4. Borrowing and Returning System
The core engine of the library, managing the lifecycle of book loans.
- Atomic Transactions: Uses Prisma transactions to ensure that borrowing a book (updating stock, creating records, checking limits) is an "all-or-nothing" operation.
- Real-Time Availability: Automatically updates book status and stock levels upon borrow/return.

### 5. Fine and Overdue Management
Automated compliance and financial tracking.
- Compute-on-Read Logic: Fines are dynamically calculated based on overdue days and system-wide fine rates.
- Financial Records: Tracks paid and unpaid fines with atomic return-and-fine workflows.

### 6. Event-Driven Notification System
An asynchronous messaging architecture for system updates.
- Metadata-Based Rendering: Notifications are stored with structured data, allowing the frontend to render dynamic content and deep-links.
- Real-Time Updates: Informs users about overdue books, fine status, and system announcements.

### 7. Dynamic System Settings
Runtime configuration management for system behavior.
- Business Rule Toggles: Admins can adjust borrow limits, overdue fine rates, and notification preferences without code changes.
- Maintenance Mode: Global system barrier to protect data during updates.

## Technical Solutions

### Centralized Business Rule Engine
Complex logic such as max books per user or overdue threshold calculation is extracted into @qltv/shared. This prevents "Logic Drift" where the frontend and backend might otherwise calculate rules differently.

### Standardized Form Validation
Every form in the system utilizes Zod for schema validation. Schemas are shared between the frontend (for instant UX feedback) and the backend (for authoritative validation), ensuring data integrity.

### Centralized Axios Instance
The frontend utilizes a custom Axios instance with interceptors:
- Request Interceptor: Automatically injects authorization headers.
- Response Interceptor: Globally handles standardized error codes and session expirations.

### DMS Data-Table Pattern
High-performance management interfaces built using TanStack Table and shadcn/ui, supporting advanced filtering, pagination, and multi-select actions.

## Project Structure

```text
├── apps/
│   ├── api/                # Backend API (Node.js, Prisma, Express)
│   └── web/                # Frontend Web (React 19, Vite, shadcn/ui)
├── packages/
│   └── shared/             # Shared Types, Schemas, and Business Rules
├── pnpm-workspace.yaml     # Monorepo configuration
└── package.json            # Global dev orchestration
```

## Getting Started

### Prerequisites
- pnpm installed globally
- Node.js v18 or higher
- PostgreSQL instance

### Installation
1. Install dependencies: pnpm install
2. Setup environment: cp apps/api/.env.example apps/api/.env
3. Initialize database: pnpm db:push
4. Seed initial data: pnpm --filter @qltv/api run seed

<<<<<<< HEAD
### Development
Run the full system in development mode:
pnpm dev
=======
### 2. Database Setup
Configure your `DATABASE_URL` in `apps/api/.env`, then run:
```powershell
pnpm db:push                     # Sync Prisma schema with database
```
>>>>>>> 5931ce8ea02b055b05133f084132fa9427e9bf0b

## Test Accounts
All test accounts use the default password: 123456

| Role | Email | Status |
| :--- | :--- | :--- |
| Admin | admin@admin.com | Active |
| Staff | staff1@lib.com | Active |
| Reader | reader1@gmail.com | Active |
| Blocked Reader | blocked@gmail.com | Blocked |

---
**Designed with precision for enterprise scalability and architectural excellence.**


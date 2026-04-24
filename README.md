# LibMgnt - Enterprise-Grade Library Management System

A high-performance, full-stack Monorepo application built with **pnpm**, **React 19**, and **Node.js**. This project serves as a showcase for advanced software architecture, featuring a centralized rule engine, atomic transaction handling, and a unified type system.

## 🌟 Modern Monorepo Infrastructure

We transitioned from a legacy monolithic structure to a high-efficiency **pnpm Workspace**:
- **Zero-Dependency Hoisting**: Optimized `node_modules` using pnpm's content-addressable store.
- **Cross-Package Orchestration**: Managed via `pnpm-workspace.yaml`, allowing seamless internal linking between `@qltv/shared`, `@qltv/api`, and `@qltv/web`.
- **Hybrid Build Pipeline**: Utilizing `tsup` for lightning-fast library bundling (ESM/CJS) and `tsc` for robust type-checking.

## 🧠 Core Architectural Patterns (The "Daily" Engineering)

### 1. Centralized Business Rule Engine (`@qltv/shared`)
One of the most critical parts of the system. We extracted complex logic into a dedicated, pure TypeScript engine:
- **Decoupled Logic**: Rules like `maxBooksPerUser` or `overdueCheck` are isolated from database concerns.
- **Universal Validation**: The same logic is imported by the **Backend** (for authority) and the **Frontend** (for instant UX feedback), ensuring zero logic drift.
- **Functional Composition**: Rules are written as atomic functions, making them 100% unit-testable.

### 2. Service-Layer Pattern & Atomic Transactions
The Backend is built with a strict **Controller-Service-Model** separation:
- **Service-Oriented Logic**: Controllers only handle HTTP concerns; all business orchestration lives in `services/`.
- **Atomic Workflows**: Operations like "Borrowing a Book" involve multiple steps (creating records, updating stock, checking user status). These are wrapped in **Prisma Transactions** to ensure a "All-or-Nothing" data integrity.
- **Race Condition Safety**: Implemented row-level consistency checks within transaction blocks.

### 3. Type-First Development (Shared Contracts)
We eliminated "Any" and manual interface duplication:
- **Shared API Contracts**: All request/response structures are defined in `@qltv/shared`.
- **Automated Type Propagation**: Changes in the shared package immediately trigger type errors in both FE and BE if they break the contract, preventing runtime bugs.

### 4. Advanced Frontend Architecture (`apps/web`)
The frontend is not just a UI; it's a robust **Data Management System (DMS)**:
- **DMS Data-Table Pattern**: Standardized usage of `shadcn/ui` and `TanStack Table` for all management modules (Books, Readers, Borrowing). This includes built-in pagination, advanced filtering, and high-performance rendering.
- **Centralized Axios Instance**: A specialized API client featuring:
    - **Request Interceptors**: Automatic JWT injection for authenticated requests.
    - **Response Interceptors**: Global handling of 401/403 status codes and seamless session management.
- **Unified Error Mapping**: Instead of hardcoded strings, the UI utilizes a global mapping system that translates `ErrorCode` constants (from `@qltv/shared`) into user-friendly notifications (via `sonner`).
- **Feature-Based Folder Structure**: Organized by business domains (`features/auth`, `features/books`, etc.) to ensure high maintainability and prevent circular dependencies.

## 📁 Directory Overview

```text
├── apps/
│   ├── api/                # Backend API (Node.js, Prisma, Express)
│   └── web/                # Frontend Web (React 19, Vite, shadcn/ui)
├── packages/
│   └── shared/             # The "Brain" (Rules, Types, Constants, Helpers)
├── pnpm-workspace.yaml     # Workspace configuration
└── package.json            # Global scripts & dev orchestration
```

## 🛠️ Usage & Workflow

### Prerequisites
- [pnpm](https://pnpm.io/) installed.
- Node.js v18+.
- PostgreSQL Instance.

### 1. Installation & Environment
```powershell
pnpm install                     # Install all dependencies
cp apps/api/.env.example apps/api/.env   # Setup backend environment
```

### 2. Database Setup
Configure your `DATABASE_URL` in `apps/api/.env`, then run:
```powershell
pnpm db:push                     # Sync Prisma schema with database
pnpm --filter @qltv/api run seed # Populate initial data & test accounts
```

### 🧪 Test Accounts & Seeding
The system includes a seeding script that generates a standard set of accounts for development and testing. 

To populate the database with these accounts, run:
```powershell
pnpm --filter @qltv/api run seed
```

All test accounts use the default password: **`123456`**.

| Role | Email | Status | Purpose |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@admin.com` | ✅ Active | Full system access & reports |
| **Staff** | `staff1@lib.com` | ✅ Active | Staff management access |
| **Staff** | `staff2@lib.com` | ✅ Active | Staff management access |
| **Reader** | `reader1@gmail.com` | ✅ Active | Regular reader testing |
| **Reader** | `reader2@gmail.com` | ✅ Active | Regular reader testing |
| **Reader** | `blocked@gmail.com` | 🚫 **Blocked** | **Testing access restriction logic** |

### 3. Development
Start the entire system (Frontend + Backend + Shared Watch Mode):
```powershell
pnpm dev                         # Access Web at http://localhost:5173
```

## 📜 Utility Scripts
- `pnpm build`: Production build for all packages.
- `pnpm db:studio`: Open Prisma Studio to manage data visually.
- `pnpm clean`: Wipe all `node_modules` and `dist` for a fresh start.

---
**Crafted with precision to demonstrate scalable software engineering principles.**

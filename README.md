# LibMgnt - Library Management System

A modern, full-stack Library Management System dashboard built with React, Node.js, and PostgreSQL. Features a premium UI with Glassmorphism and a robust JWT-based authentication system.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Components**: shadcn/ui (Radix UI + Lucide Icons)
- **State Management**: React Context API
- **Networking**: Axios with JWT Interceptors
- **Routing**: React Router DOM v7

### Backend
- **Framework**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (JSON Web Tokens)
- **Validation**: Zod

## ✨ Features

- **Authentication**: Secure Login and Registration with JWT persistence.
- **Protected Routes**: Internal pages accessible only to authenticated users.
- **Role-based Access Control (RBAC)**: Different UI and permissions for `ADMIN` and `STAFF`.
- **Dashboard**: Real-time overview of library statistics (Books, Readers, Borrowing).
- **Flat UI**: High-end aesthetic with semi-transparent elements and backdrop blurs.
- **Responsive Design**: Fully functional on desktop and mobile.

## 📁 Project Structure

```text
LibMgnt/
├── backend/                # Node.js Express server
│   ├── prisma/             # DB Schema & Migrations
│   ├── src/
│   │   ├── modules/        # Domain-driven modules (Auth, Books, etc.)
│   │   ├── middlewares/    # Auth, Error, Logging middlewares
│   │   └── constants/      # Error codes, enums
│   └── .env.example
├── frontend/               # React Vite application
│   ├── src/
│   │   ├── features/       # Feature-based modules (Auth, Dashboard)
│   │   ├── components/     # Reusable UI & Layout components
│   │   ├── services/       # API clients (Axios instance)
│   │   ├── types/          # Centralized TS types/interfaces
│   │   └── routes/         # Routing configuration
│   └── .env.example
└── docs/                   # Documentation & Specs
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### 1. Setup Backend
```powershell
cd backend
npm install
# Update .env with your DATABASE_URL
npx prisma db push
npm run dev
```

### 2. Setup Frontend
```powershell
cd frontend
npm install
# Update .env with VITE_API_BASE_URL
npm run dev
```

## 🔐 Environment Variables

### Backend (`backend/.env`)
- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for token signing
- `JWT_EXPIRES_IN`: Token expiration (e.g., 1d)

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL`: Backend API URL (e.g., http://localhost:3000/api/v1)

## 📄 License
This project is for educational purposes.

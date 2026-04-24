import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Books } from "@/pages/Books";
import { Categories } from "@/pages/Categories";
import { Readers } from "@/pages/Readers";
import { Borrow } from "@/pages/Borrow";
import { Reports } from "@/pages/Reports";
import { LoginPage } from "@/features/auth/LoginPage/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage/RegisterPage";
import { ProtectedRoute } from "@/components/ui/protected-route/protected-route";
import { UserRole } from "@/types/auth/user.entity";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    handle: { crumb: "Home" },
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        handle: { 
          crumb: "Dashboard",
          description: "Overview of library activities, statistics, and quick actions."
        },
      },
      {
        path: "books",
        element: <Books />,
        handle: { 
          crumb: "Books",
          description: "Manage your library collection, search books, and track inventory."
        },
      },
      {
        path: "categories",
        element: <Categories />,
        handle: { 
          crumb: "Categories",
          description: "Organize books into genres, subjects, and custom classifications."
        },
      },
      {
        path: "readers",
        element: <Readers />,
        handle: { 
          crumb: "Readers",
          description: "Manage member profiles, registration, and membership status."
        },
      },
      {
        path: "borrow",
        element: <Borrow />,
        handle: { 
          crumb: "Borrow Records",
          description: "Track book loans, returns, and manage due dates."
        },
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <Reports />
          </ProtectedRoute>
        ),
        handle: { 
          crumb: "Reports & Analytics",
          description: "Deep dive into library data, borrowing trends, and financial reports."
        },
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

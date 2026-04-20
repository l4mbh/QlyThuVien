import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Books } from "@/pages/Books";
import { Categories } from "@/pages/Categories";
import { Readers } from "@/pages/Readers";
import { Borrow } from "@/pages/Borrow";
import { LoginPage } from "@/features/auth/LoginPage/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage/RegisterPage";
import { ProtectedRoute } from "@/components/ui/protected-route/protected-route";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="categories" element={<Categories />} />
          <Route path="readers" element={<Readers />} />
          <Route path="borrow" element={<Borrow />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

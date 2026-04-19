import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Books } from "@/pages/Books";
import { Readers } from "@/pages/Readers";
import { Borrow } from "@/pages/Borrow";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="readers" element={<Readers />} />
          <Route path="borrow" element={<Borrow />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

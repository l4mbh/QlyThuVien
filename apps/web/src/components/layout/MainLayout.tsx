import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden text-slate-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-auto p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            {/* MainBreadcrumb has been moved inside PageHeader which is used in individual pages */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

import React from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Library, Home, Bell, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsFetching } from '@tanstack/react-query';

// Desktop/Tablet Nav Items (More spacing)
const desktopNavItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Library, label: 'Catalog', path: '/catalog' },
  { icon: Bookmark, label: 'My Books', path: '/my-books' },
  { icon: Bell, label: 'Alerts', path: '/notifications' },
];

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isFetching = useIsFetching();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Global Sync Indicator (Polish) */}
      <div className={cn(
        "fixed top-0 left-0 right-0 h-0.5 bg-primary z-[60] transition-all duration-500 origin-left",
        isFetching > 0 ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
      )} />

      {/* Responsive Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 flex items-center px-4 lg:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black">L</div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">LibMgnt</span>
            </NavLink>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {desktopNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <NavLink to="/profile" className="flex items-center gap-3 group">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-slate-900 leading-none">John Doe</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Premium Member</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary font-black shadow-sm group-hover:border-primary transition-all">
                JD
              </div>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-16 pb-24 md:pb-8 px-4 max-w-7xl mx-auto w-full relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:pt-4"
          >
            <div className="max-w-lg mx-auto md:max-w-none">
               <Outlet />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile-only Bottom Navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

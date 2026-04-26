import React from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Library, Home, Bell, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsFetching } from '@tanstack/react-query';

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Loading bar */}
      <div className={cn(
        "fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-blue-400 z-[60] transition-all duration-500 origin-left",
        isFetching > 0 ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
      )} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 glass z-40 flex items-center px-4 lg:px-8">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-primary/20">L</div>
              <span className="text-lg font-bold text-foreground tracking-tight">LibMgnt</span>
            </NavLink>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-0.5">
              {desktopNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                      isActive 
                        ? "bg-primary text-white shadow-sm shadow-primary/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/60"
                    )
                  }
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {localStorage.getItem('reader_token') ? (
              <NavLink to="/profile" className="flex items-center gap-2.5 group">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-foreground leading-none">Reader</span>
                  <span className="text-[10px] font-medium text-muted-foreground">{localStorage.getItem('reader_phone')}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center text-primary text-sm font-semibold group-hover:bg-primary group-hover:text-white transition-all">
                  {localStorage.getItem('reader_phone')?.slice(-2) || 'RD'}
                </div>
              </NavLink>
            ) : (
              <NavLink 
                to="/login" 
                className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 active:scale-[0.97] transition-all"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-14 pb-20 md:pb-6 px-4 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="md:pt-3"
          >
            <div className="max-w-lg mx-auto md:max-w-none">
               <Outlet />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

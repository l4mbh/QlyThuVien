import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Library, Home, Bell, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';

// Optimized 5-tab navigation for Mobile
const navItems = [
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Library, label: 'Catalog', path: '/catalog' },
  { icon: Home, label: 'Home', path: '/', isCenter: true },
  { icon: Bookmark, label: 'My Books', path: '/my-books' },
  { icon: Bell, label: 'Alerts', path: '/notifications' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-100 pb-safe-area-inset-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around h-18 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isCenter) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "relative -top-5 flex items-center justify-center w-15 h-15 rounded-full shadow-2xl transition-all duration-300",
                    isActive 
                      ? "bg-primary text-white scale-110 rotate-[360deg]" 
                      : "bg-primary text-white/90 hover:scale-105 active:scale-90"
                  )
                }
              >
                <Icon size={28} strokeWidth={2.5} />
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center flex-1 py-3 transition-all duration-200 active:scale-95",
                  isActive ? "text-primary" : "text-slate-400 hover:text-slate-600"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "p-1 rounded-xl transition-colors",
                    isActive && "bg-primary/5"
                  )}>
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={cn(
                    "text-[10px] mt-1 font-black uppercase tracking-tighter",
                    isActive ? "opacity-100" : "opacity-60"
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

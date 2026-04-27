import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Library, Home, Bell, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';

import { useNotifications } from '../../hooks/useNotifications';

const navItems = [
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Library, label: 'Catalog', path: '/catalog' },
  { icon: Home, label: 'Home', path: '/', isCenter: true },
  { icon: Bookmark, label: 'Books', path: '/my-books' },
  { icon: Bell, label: 'Alerts', path: '/notifications', hasBadge: true },
];

export const BottomNav: React.FC = () => {
  const { unreadCount } = useNotifications();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isCenter) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "relative -top-4 flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg transition-all duration-200",
                    isActive 
                      ? "bg-primary text-white shadow-primary/30 scale-105" 
                      : "bg-primary text-white/90 shadow-primary/20 hover:scale-105 active:scale-95"
                  )
                }
              >
                <Icon size={24} strokeWidth={2} />
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center flex-1 py-2 transition-all duration-150 active:scale-95",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "p-1.5 rounded-xl transition-colors relative",
                    isActive && "bg-primary/8"
                  )}>
                    <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                    {item.hasBadge && unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] mt-0.5 font-medium tracking-tight",
                    isActive ? "opacity-100" : "opacity-50"
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

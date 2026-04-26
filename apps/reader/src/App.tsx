import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Toaster } from 'sonner';
import { HomePage } from './features/home/pages/HomePage';
import { SearchPage } from './features/books/pages/SearchPage';
import { CatalogPage } from './features/books/pages/CatalogPage';
import { MyBorrowedList } from './features/dashboard/components/MyBorrowedList';
import { NotificationList } from './features/notifications/components/NotificationList';
import { useMyBorrowed } from './hooks/useBorrow';
import { useNotifications, useMarkNotificationRead } from './hooks/useNotifications';
import { Skeleton } from './components/ui/Skeleton';
import { LoginPage } from './features/auth/pages/LoginPage';
import { MyBooksPage } from './features/dashboard/pages/MyBooksPage';



import { useQueryClient } from '@tanstack/react-query';

const NotificationsPage = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead();

  return (
    <div className="pt-4 space-y-5">
      <div className="space-y-1 px-0.5">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground">Stay updated with library alerts</p>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-18 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <NotificationList notifications={notifications || []} />
      )}
    </div>
  );
};

import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="pt-6 text-center space-y-6">
        <Skeleton className="w-24 h-24 rounded-3xl mx-auto" />
        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3 px-2">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 text-center space-y-6">
      <div className="relative inline-block">
        <div className="w-24 h-24 bg-primary/8 text-primary rounded-3xl mx-auto flex items-center justify-center text-3xl font-bold border border-primary/10">
          {user?.phone?.slice(-2) || 'RD'}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-[3px] border-background rounded-full" />
      </div>

      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">{user?.name || 'Reader'}</h2>
        <p className="text-sm text-muted-foreground">{user?.phone}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-2">
        <div className="glass-subtle p-4 rounded-2xl border border-border/40 flex flex-col items-center gap-1.5">
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Status</span>
          <span className="text-xs font-semibold text-emerald-600 px-2.5 py-0.5 bg-emerald-500/8 rounded-lg">Active</span>
        </div>
        <div className="glass-subtle p-4 rounded-2xl border border-border/40 flex flex-col items-center gap-1.5">
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Identity</span>
          <span className="text-xs font-semibold text-foreground">Phone-first</span>
        </div>
      </div>

      <div className="space-y-2.5 px-2 pb-6">
        <button className="w-full py-3.5 glass-subtle border border-border/50 text-foreground font-medium rounded-2xl hover:bg-white/80 active:scale-[0.98] transition-all text-sm">
          Account Settings
        </button>
        <button
          onClick={logout}
          className="w-full py-3.5 bg-destructive/8 text-destructive font-medium rounded-2xl active:scale-[0.98] transition-all text-sm border border-destructive/10"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('reader_token');
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" expand={false} richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="my-books" element={<AuthGuard><MyBooksPage /></AuthGuard>} />
          <Route path="notifications" element={<AuthGuard><NotificationsPage /></AuthGuard>} />
          <Route path="profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

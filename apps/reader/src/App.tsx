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

const MyBooksPage = () => {
  const { data: borrowed, isLoading } = useMyBorrowed();

  return (
    <div className="pt-4 space-y-8">
      <div className="space-y-1 px-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Bookshelf</h2>
        <p className="text-sm font-medium text-slate-500">Track your active loans and return deadlines</p>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full rounded-[24px]" />
          ))}
        </div>
      ) : (
        <MyBorrowedList items={borrowed || []} />
      )}
    </div>
  );
};

const NotificationsPage = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead();

  return (
    <div className="pt-4 space-y-8">
      <div className="space-y-1 px-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h2>
        <p className="text-sm font-medium text-slate-500">Stay updated with library news and alerts</p>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-20 w-full rounded-[20px]" />
          ))}
        </div>
      ) : (
        <NotificationList notifications={notifications || []} />
      )}
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const phone = localStorage.getItem('reader_phone');

  const handleLogout = () => {
    localStorage.removeItem('reader_phone');
    navigate('/login');
  };

  return (
    <div className="pt-8 text-center space-y-8">
      <div className="relative inline-block">
        <div className="w-28 h-28 bg-primary/10 text-primary rounded-full mx-auto flex items-center justify-center text-4xl font-black border-4 border-white shadow-2xl">
          {phone?.slice(-2) || 'RD'}
        </div>
        <div className="absolute bottom-2 right-2 w-7 h-7 bg-green-500 border-4 border-white rounded-full shadow-lg" />
      </div>
      
      <div className="space-y-1 px-4">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reader</h2>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{phone}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 px-4">
        <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
          <span className="text-sm font-black text-primary px-3 py-1 bg-primary/5 rounded-full">Active</span>
        </div>
        <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Identity</span>
          <span className="text-sm font-black text-slate-900">Phone-first</span>
        </div>
      </div>

      <div className="space-y-4 px-4 pb-8">
        <button className="w-full py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-[20px] shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all">
          Account Settings
        </button>
        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-red-50 text-red-600 font-black rounded-[20px] active:scale-[0.98] transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const phone = localStorage.getItem('reader_phone');
  const location = useLocation();

  if (!phone) {
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

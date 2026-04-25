import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Toaster } from 'sonner';
import { HomePage } from './features/home/pages/HomePage';
import { MyBorrowedList } from './features/dashboard/components/MyBorrowedList';
import { NotificationList } from './features/notifications/components/NotificationList';

// Mock data updated for better UX flow
const MOCK_BORROWED = [
  { id: '1', title: 'Clean Architecture', author: 'Robert C. Martin', dueDate: '2024-05-10', status: 'normal' as const, daysLeft: 12 },
  { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', dueDate: '2024-04-20', status: 'overdue' as const, daysLeft: -5 },
  { id: '3', title: 'Refactoring', author: 'Martin Fowler', dueDate: '2024-04-28', status: 'due_soon' as const, daysLeft: 2 },
];

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Overdue Alert', message: 'The book "The Pragmatic Programmer" is 5 days overdue. Please return it to avoid further fines.', type: 'error' as const, timestamp: '2h ago', isRead: false, dateGroup: 'Today' as const },
  { id: '2', title: 'New Arrival', message: 'We just added "Refactoring" by Martin Fowler to our collection. Check it out!', type: 'info' as const, timestamp: '5h ago', isRead: false, dateGroup: 'Today' as const },
  { id: '3', title: 'Return Success', message: 'You have successfully returned "The Clean Coder".', type: 'success' as const, timestamp: 'Yesterday', isRead: true, dateGroup: 'Yesterday' as const },
  { id: '4', title: 'Library Maintenance', message: 'The library will be closed this Sunday for inventory check.', type: 'warning' as const, timestamp: '3d ago', isRead: true, dateGroup: 'Earlier' as const },
];

const MyBooksPage = () => (
  <div className="pt-4 space-y-8">
    <div className="space-y-1 px-1">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Bookshelf</h2>
      <p className="text-sm font-medium text-slate-500">Track your active loans and return deadlines</p>
    </div>
    <MyBorrowedList items={MOCK_BORROWED} />
  </div>
);

const NotificationsPage = () => (
  <div className="pt-4 space-y-8">
    <div className="space-y-1 px-1">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h2>
      <p className="text-sm font-medium text-slate-500">Stay updated with library news and alerts</p>
    </div>
    <NotificationList notifications={MOCK_NOTIFICATIONS} />
  </div>
);

const ProfilePage = () => (
  <div className="pt-8 text-center space-y-8">
    <div className="relative inline-block">
      <div className="w-28 h-28 bg-primary/10 text-primary rounded-full mx-auto flex items-center justify-center text-4xl font-black border-4 border-white shadow-2xl">
        JD
      </div>
      <div className="absolute bottom-2 right-2 w-7 h-7 bg-green-500 border-4 border-white rounded-full shadow-lg" />
    </div>
    
    <div className="space-y-1 px-4">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">John Doe</h2>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Premium Member</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4 px-4">
      <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
        <span className="text-3xl font-black text-primary">12</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Read Books</span>
      </div>
      <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
        <span className="text-3xl font-black text-primary">3</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Loans</span>
      </div>
    </div>

    <div className="space-y-4 px-4 pb-8">
      <button className="w-full py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-[20px] shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all">
        Edit Account Info
      </button>
      <button className="w-full py-4 bg-red-50 text-red-600 font-black rounded-[20px] active:scale-[0.98] transition-all">
        Logout
      </button>
    </div>
  </div>
);

const SearchPage = () => <div className="pt-4 space-y-8">
  <div className="space-y-1 px-1">
    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Search</h2>
    <p className="text-sm font-medium text-slate-500">Quickly find titles, authors or ISBN</p>
  </div>
  <div className="relative group">
    <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
      <div className="w-6 h-6 border-2 border-current rounded-full flex items-center justify-center">
         <div className="w-2 h-2 bg-current rounded-full" />
      </div>
    </div>
    <div className="w-full h-16 bg-white border border-slate-200 rounded-2xl px-14 flex items-center text-slate-400 font-bold italic shadow-sm group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/10 transition-all">
      Tap to search library...
    </div>
  </div>
  <div className="space-y-4 px-1">
    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Searches</h3>
    <div className="flex flex-wrap gap-2">
      {['JavaScript', 'Design Patterns', 'React', 'Prisma'].map(tag => (
        <span key={tag} className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-black rounded-full hover:bg-slate-200 cursor-pointer transition-colors border border-slate-200/50">{tag}</span>
      ))}
    </div>
  </div>
</div>;

const CatalogPage = () => <div className="pt-4 space-y-8">
  <div className="space-y-1 px-1">
    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Catalog</h2>
    <p className="text-sm font-medium text-slate-500">Browse collection by categories</p>
  </div>
  <div className="grid grid-cols-2 gap-4">
    {[
      { name: 'Fiction', count: 124 },
      { name: 'Tech', count: 86 },
      { name: 'Science', count: 45 },
      { name: 'History', count: 32 },
      { name: 'Biography', count: 21 },
      { name: 'Art', count: 18 }
    ].map(cat => (
      <div key={cat.name} className="p-6 bg-white border border-slate-100 rounded-[28px] flex flex-col items-center justify-center text-center shadow-sm active:scale-95 transition-all hover:border-primary/20 hover:shadow-md">
        <span className="text-lg font-black text-slate-900">{cat.name}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{cat.count} Books</span>
      </div>
    ))}
  </div>
</div>;

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" expand={false} richColors />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="my-books" element={<MyBooksPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

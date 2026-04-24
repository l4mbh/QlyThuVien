import { AppRouter } from "@/routes/AppRouter";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/features/auth/auth.hook";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background font-sans antialiased text-foreground">
        <AppRouter />
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;


import { AppRouter } from "@/routes/AppRouter";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/features/auth/auth.hook";
import { useIsFetching } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

function App() {
  const isFetching = useIsFetching();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background font-sans antialiased text-foreground">
        {/* Global Sync Indicator (Polish) */}
        <div className={cn(
          "fixed top-0 left-0 right-0 h-0.5 bg-primary z-[9999] transition-all duration-500 origin-left",
          isFetching > 0 ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        )} />
        <AppRouter />
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;


import { AppRouter } from "@/routes/AppRouter";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <AppRouter />
      <Toaster />
    </div>
  );
}

export default App;

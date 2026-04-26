import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Phone, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import api from "../../../services/api";

export const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/reader-login", { phone });
      const { token, user } = res.data.data;
      localStorage.setItem("reader_token", token);
      toast.success(`Welcome, ${user.name || "Reader"}!`);
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.msg || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/8 rounded-2xl flex items-center justify-center text-primary">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Enter your phone to continue</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Phone className="h-4 w-4" />
            </div>
            <input
              type="tel"
              placeholder="09xx xxx xxx"
              className="block w-full pl-11 pr-4 py-3.5 glass-subtle border border-border/60 rounded-2xl text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || phone.length < 9}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 transition-all text-sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Get Started <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-muted-foreground/50 font-medium uppercase tracking-widest pt-4">
          &copy; 2026 LibMgnt
        </p>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Phone, ArrowRight, BookOpen, Loader2 } from "lucide-react";

export const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    // Simulate lookup or just save and redirect
    // Since it's identity-lite, we just save the phone
    // The backend will handle the data lookup based on this phone
    try {
      localStorage.setItem("reader_phone", phone);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center text-primary rotate-3 shadow-xl shadow-primary/5">
            <BookOpen className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">QLTV Reader</h1>
            <p className="text-slate-500 font-medium">Enter your phone number to access your library</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Phone className="h-5 w-5" />
            </div>
            <input
              type="tel"
              placeholder="09xx xxx xxx"
              className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[24px] text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || phone.length < 9}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-[24px] flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all shadow-xl shadow-slate-200"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Get Started <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-8">
          &copy; 2026 QLTV Library System
        </p>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth.hook";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Lock, Library, ArrowRight, Loader2 } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      toast.success("Welcome back to LibMgnt!");
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-950 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-[url('/Library-main.png')] bg-cover bg-center scale-105 blur-[2px] opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-primary/20" />
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-700">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 space-y-3">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 ring-1 ring-white/30">
            <Library className="h-9 w-9 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">LibMgnt</h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide">Enterprise Library Management</p>
          </div>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden ring-1 ring-white/10">
          <CardHeader className="space-y-1.5 pt-8 pb-6 px-8">
            <CardTitle className="text-2xl font-bold text-white text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center text-slate-400 font-medium">
              Enter your credentials to manage your library
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Password
                  </label>
                  <button type="button" className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-bold text-sm tracking-wide bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col border-t border-white/5 bg-black/20 py-6 px-8">
            <p className="text-sm text-slate-500 font-medium text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:text-white transition-colors font-bold ml-1">
                Create account
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer Links */}
        <p className="mt-8 text-center text-xs text-slate-600 font-medium">
          &copy; 2026 LibMgnt System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

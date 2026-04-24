import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth.hook";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
      toast.success("Login successful");
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/Library-main.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-slate-950/40" />
      </div>

      <Card className="relative z-10 w-full max-w-md shadow-xl border-none bg-white dark:bg-slate-900 rounded-none">
        <CardHeader className="space-y-1 pt-8">
          <CardTitle className="text-3xl font-bold text-center tracking-tight">Login</CardTitle>
          <CardDescription className="text-center text-slate-500">
            Library Management System - LibMgnt
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Email
              </label>
              <Input
                type="email"
                placeholder="admin@libmgnt.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-none border-slate-200 focus:border-primary transition-all h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-none border-slate-200 focus:border-primary transition-all h-11"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 rounded-none font-bold uppercase tracking-widest text-xs transition-transform active:scale-[0.98]" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8 bg-slate-50 dark:bg-slate-950/50">
          <div className="text-sm text-center text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:text-primary/80 font-bold transition-colors">
              Register now
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};


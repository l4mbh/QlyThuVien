import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth.hook";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      toast.success("Đăng ký tài khoản thành công");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại");
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
          <CardTitle className="text-3xl font-bold text-center tracking-tight">Đăng ký</CardTitle>
          <CardDescription className="text-center text-slate-500">
            Tạo tài khoản mới để bắt đầu quản lý
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Họ và tên
              </label>
              <Input
                type="text"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-none border-slate-200 focus:border-primary transition-all h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Email
              </label>
              <Input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-none border-slate-200 focus:border-primary transition-all h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Mật khẩu
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
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Xác nhận mật khẩu
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="rounded-none border-slate-200 focus:border-primary transition-all h-11"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 rounded-none font-bold uppercase tracking-widest text-xs transition-transform active:scale-[0.98]" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8 bg-slate-50 dark:bg-slate-950/50">
          <div className="text-sm text-center text-slate-500">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
              Đăng nhập ngay
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

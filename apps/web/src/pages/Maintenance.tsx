import { Wrench, Library, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MaintenancePage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-950 overflow-hidden">
      {/* Background matching Login page */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-amber-900/20" />
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-700">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 space-y-3">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/10 ring-1 ring-white/30">
            <Library className="h-9 w-9 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">LibMgnt</h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide">Enterprise Library Management</p>
          </div>
        </div>

        {/* Maintenance Card */}
        <div className="border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden ring-1 ring-white/10">
          <div className="pt-10 pb-8 px-8 flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="h-20 w-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Wrench className="h-10 w-10 text-amber-400 animate-pulse" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Under Maintenance</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                We are performing scheduled maintenance to improve your experience. The system will be back online shortly.
              </p>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Maintenance in progress</span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 bg-black/20 py-5 px-8 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => window.location.href = "/login"}
              className="text-slate-400 hover:text-white hover:bg-white/5 font-medium gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-600 font-medium">
          &copy; 2026 LibMgnt System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

import React, { useMemo } from "react";
import { useMatches } from "react-router-dom";
import { MainBreadcrumb } from "@/components/ui/main-breadcrumb/main-breadcrumb";
import { cn } from "@/lib/utils";

interface RouteHandle {
  crumb?: string;
  description?: string;
}

interface PageHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  showBreadcrumb?: boolean;
}

export function PageHeader({
  title: manualTitle,
  description: manualDescription,
  actions,
  className,
  showBreadcrumb = true,
}: PageHeaderProps) {
  const matches = useMatches();

  // Extract title and description from the current route's handle
  const routeData = useMemo(() => {
    const lastMatch = matches[matches.length - 1];
    const handle = lastMatch?.handle as RouteHandle | undefined;
    
    return {
      title: manualTitle || handle?.crumb || "Page",
      description: manualDescription || handle?.description,
    };
  }, [matches, manualTitle, manualDescription]);

  return (
    <div className={cn("flex flex-col gap-4 mb-8", className)}>
      {showBreadcrumb && <MainBreadcrumb />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 animate-in fade-in slide-in-from-left-2 duration-500">
            {routeData.title}
          </h1>
          {routeData.description && (
            <p className="text-[15px] text-slate-500 max-w-2xl animate-in fade-in slide-in-from-left-4 duration-700">
              {routeData.description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-500">
            {actions}
          </div>
        )}
      </div>
      
      {/* Subtle separator with glass effect */}
      <div className="h-px w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent mt-2" />
    </div>
  );
}

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useMatches } from "react-router-dom";
import { Home } from "lucide-react";
import React, { useMemo } from "react";

interface RouteHandle {
  crumb?: string | ((data: any) => React.ReactNode);
}

export function MainBreadcrumb() {
  const matches = useMatches();

  const crumbs = useMemo(() => {
    return matches
      .filter((match) => (match.handle as RouteHandle)?.crumb)
      .map((match) => {
        const handle = match.handle as RouteHandle;
        const label = typeof handle.crumb === "function" ? handle.crumb(match.data) : handle.crumb;
        const path = match.pathname === "/" ? "/dashboard" : match.pathname;
        
        return { label, path };
      });
  }, [matches]);

  if (crumbs.length === 0) return null;

  return (
    <div className="px-4 py-2 rounded-lg border border-white/40 bg-white/40 backdrop-blur-sm w-fit transition-all duration-300">
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            const isHome = crumb.label === "Home";

            return (
              <React.Fragment key={`${crumb.path}-${index}`}>
                <BreadcrumbItem className="animate-in fade-in slide-in-from-left-1 duration-300">
                  {isLast ? (
                    <BreadcrumbPage className="font-semibold text-slate-800 truncate max-w-[200px]">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={crumb.path} 
                        className="flex items-center gap-1.5 text-slate-500 transition-all hover:text-primary hover:scale-[1.02]"
                      >
                        {isHome && <Home className="h-3 w-3" />}
                        <span className="text-[12px] font-medium">{crumb.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator className="text-slate-300">
                    <span className="text-[10px] opacity-40">/</span>
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

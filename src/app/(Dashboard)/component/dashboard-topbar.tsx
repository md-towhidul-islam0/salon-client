"use client";

import { ArrowUpRight, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import ThemeToggle from "@/components/Global/ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

const routeLabels: Record<string, string> = {
  "/admin": "Overview",
  "/admin/manage-services": "Manage Services",
  "/admin/add-update-service": "Add / Update Service",
  "/admin/manage-appointments": "Manage Appointments",
  "/admin/manage-users": "Manage Users",
  "/admin/transactions": "Transactions",
  "/admin/profile": "My Profile",
  "/Customer": "Overview",
  "/Customer/my-appointments": "My Appointments",
  "/Customer/my-profile": "My Profile",
};

export function DashboardTopbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const rootHref = isAdmin ? "/admin" : "/Customer";
  const rootLabel = isAdmin ? "Admin" : "Customer";
  const currentLabel = routeLabels[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <span
          className="hidden h-5 w-px bg-border sm:block"
          aria-hidden="true"
        />
        <nav
          aria-label="Breadcrumb"
          className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex"
        >
          <Link
            href="/"
            aria-label="Home"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <House className="size-4" aria-hidden="true" />
          </Link>
          <span className="text-muted-foreground/50" aria-hidden="true">
            /
          </span>
          <Link
            href={rootHref}
            className="rounded-md px-1 py-0.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            {rootLabel}
          </Link>
          <span className="text-muted-foreground/50" aria-hidden="true">
            /
          </span>
          <span className="truncate font-medium text-foreground">
            {currentLabel}
          </span>
        </nav>
        <span className="truncate text-sm font-semibold sm:hidden">
          {currentLabel}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
    
        <ThemeToggle />
      </div>
    </header>
  );
}

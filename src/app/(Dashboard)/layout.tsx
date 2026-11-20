import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "./component/app-sidebar";
import { DashboardTopbar } from "./component/dashboard-topbar";
import { Toaster } from "@/components/ui/toast";

// The dashboard reads the session on every request. Auth guards already stream
// behind <Suspense>, so opt this branch out of instant-navigation validation.
export const instant = false;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/30">
        <DashboardTopbar />
        <div className="flex flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
         <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}

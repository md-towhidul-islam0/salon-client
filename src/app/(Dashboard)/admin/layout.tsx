import { type ReactNode, Suspense } from "react";

import { DashboardLoading } from "../component/dashboard-ui";
import AdminAuth from "./AdminAuthantication";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardLoading label="Checking admin access" />}>
      <AdminAuth>{children}</AdminAuth>
    </Suspense>
  );
}

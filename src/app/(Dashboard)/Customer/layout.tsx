import { type ReactNode, Suspense } from "react";

import { DashboardLoading } from "../component/dashboard-ui";
import CustomerAuth from "./CustomerAuth";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardLoading label="Checking your account" />}>
      <CustomerAuth>{children}</CustomerAuth>
    </Suspense>
  );
}

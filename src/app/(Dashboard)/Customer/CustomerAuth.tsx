import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

export default async function CustomerAuth({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/SignIn");
  }

  if (session.user.role !== "Customer") {
    redirect("/unauth");
  }

  return <>{children}</>;
}

import {
  Ban,
  Filter,
  MailCheck,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

import UserAvatar from "@/components/Global/UserAvatar";
import { AllUsers } from "@/lib/core/Importantfunction";

import {
  DashboardPage,
  DashboardPanel,
  EmptyState,
  StatCard,
  StatusPill,
  TableShell,
} from "../../component/dashboard-ui";
import UserRoleDropdown from "./user-role-dropdown";
import UserStatusDropdown from "./user-status-dropdown";

interface IUser {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  isBlocked: boolean;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeRole(role: string | undefined) {
  return (role || "customer").toLowerCase();
}

export default async function ManageUsersPage() {
  let users: IUser[] = [];

  try {
    const res = await AllUsers();
    const data = await res.json();
    users = Array.isArray(data) ? (data as IUser[]) : [];
  } catch {
    users = [];
  }

  const totalUsers = users.length;
  const activeCustomers = users.filter(
    (user) => !user.isBlocked && normalizeRole(user.role) !== "admin",
  ).length;
  const administrators = users.filter(
    (user) => normalizeRole(user.role) === "admin",
  ).length;
  const blockedAccounts = users.filter((user) => user.isBlocked).length;

  return (
    <DashboardPage
      eyebrow="People"
      title="Manage users"
      description="Review customer accounts, promote trusted staff, and keep the community safe."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={String(totalUsers)}
          hint="All registered accounts"
          icon={Users}
          tone="accent"
        />
        <StatCard
          label="Active customers"
          value={String(activeCustomers)}
          hint="Customers with active access"
          icon={UserCheck}
          tone="emerald"
        />
        <StatCard
          label="Administrators"
          value={String(administrators)}
          hint="Full dashboard access"
          icon={ShieldCheck}
          tone="sky"
        />
        <StatCard
          label="Blocked accounts"
          value={String(blockedAccounts)}
          hint="Restricted from booking"
          icon={Ban}
          tone="rose"
        />
      </div>

      <DashboardPanel
        title="All accounts"
        description="Customer and administrator accounts in one place."
        bodyClassName="p-0"
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-auto">
              <span className="sr-only">Search users</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search users..."
                className="h-9 w-full rounded-lg border border-border bg-background pr-3 pl-8 text-xs outline-none placeholder:text-muted-foreground focus:border-accent sm:h-8 sm:w-48"
              />
            </label>
            <button
              type="button"
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-8 sm:w-auto"
            >
              <Filter className="size-3.5" aria-hidden="true" />
              Filter
            </button>
          </div>
        }
      >
        {users.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Users}
              title="No users found"
              description="User accounts will appear here once people register on the platform."
            />
          </div>
        ) : (
          <TableShell>
            <thead>
              <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Verification</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const role = normalizeRole(user.role);
                const isAdmin = role === "admin";
                const status = user.isBlocked ? "blocked" : "active";

                return (
                  <tr
                    key={user._id || user.email}
                    className="border-t border-border transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          image={user.image}
                          name={user.name}
                          size={36}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {user.name || "Unnamed user"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={
                          isAdmin
                            ? "inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent ring-1 ring-inset ring-accent/20"
                            : "inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground ring-1 ring-inset ring-border"
                        }
                      >
                        {isAdmin ? (
                          <ShieldCheck className="size-3" aria-hidden="true" />
                        ) : null}
                        {isAdmin ? "Admin" : "Customer"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={
                          user.emailVerified
                            ? "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-500 ring-1 ring-inset ring-emerald-500/20"
                            : "inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-500 ring-1 ring-inset ring-amber-500/20"
                        }
                      >
                        <MailCheck className="size-3" aria-hidden="true" />
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <StatusPill status={status} />
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <UserStatusDropdown
                          userId={user._id}
                          isBlocked={user.isBlocked}
                          compact
                        />
                        <UserRoleDropdown
                          userId={user._id}
                          currentRole={user.role}
                          compact
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </TableShell>
        )}
      </DashboardPanel>
    </DashboardPage>
  );
}

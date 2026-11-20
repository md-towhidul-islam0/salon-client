import {
  Ban,
  Filter,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

import UserAvatar from "@/components/Global/UserAvatar";

import {
  DashboardPage,
  DashboardPanel,
  StatCard,
  StatusPill,
  TableShell,
} from "../../component/dashboard-ui";

const users = [
  {
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    role: "Customer",
    joined: "12 Aug 2026",
    visits: 14,
    spent: "৳ 18,400",
    status: "active" as const,
  },
  {
    name: "Tanvir Ahmed",
    email: "tanvir@example.com",
    role: "Customer",
    joined: "03 Sep 2026",
    visits: 6,
    spent: "৳ 5,250",
    status: "active" as const,
  },
  {
    name: "Mehjabin Chowdhury",
    email: "mehjabin@example.com",
    role: "Customer",
    joined: "21 Jun 2026",
    visits: 22,
    spent: "৳ 31,900",
    status: "active" as const,
  },
  {
    name: "Ayesha Siddika",
    email: "ayesha@HairSalon.com",
    role: "Admin",
    joined: "01 Jan 2026",
    visits: 0,
    spent: "—",
    status: "active" as const,
  },
  {
    name: "Farhan Kabir",
    email: "farhan@example.com",
    role: "Customer",
    joined: "17 Oct 2026",
    visits: 2,
    spent: "৳ 1,300",
    status: "active" as const,
  },
  {
    name: "Sadia Rahman",
    email: "sadia@example.com",
    role: "Customer",
    joined: "29 Jul 2026",
    visits: 9,
    spent: "৳ 9,750",
    status: "blocked" as const,
  },
];

export default function ManageUsersPage() {
  return (
    <DashboardPage
      eyebrow="People"
      title="Manage users"
      description="Review customer accounts, promote trusted staff, and keep the community safe."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value="1,248"
          hint="38 joined this month"
          icon={Users}
          tone="accent"
        />
        <StatCard
          label="Active customers"
          value="1,196"
          hint="95.8% of all accounts"
          icon={UserCheck}
          tone="emerald"
        />
        <StatCard
          label="Administrators"
          value="4"
          hint="Full dashboard access"
          icon={ShieldCheck}
          tone="sky"
        />
        <StatCard
          label="Blocked accounts"
          value="12"
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
          <div className="flex items-center gap-2">
            <label className="relative hidden sm:block">
              <span className="sr-only">Search users</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search users..."
                className="h-8 w-48 rounded-lg border border-border bg-background pr-2.5 pl-8 text-xs outline-none placeholder:text-muted-foreground focus:border-accent"
              />
            </label>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Filter className="size-3.5" aria-hidden="true" />
              Filter
            </button>
          </div>
        }
      >
        <TableShell>
          <thead>
            <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Visits</th>
              <th className="px-5 py-3 font-medium">Total spent</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.email}
                className="border-t border-border transition-colors hover:bg-muted/40"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={user.name} size={32} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={
                      user.role === "Admin"
                        ? "inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent"
                        : "text-muted-foreground"
                    }
                  >
                    {user.role === "Admin" ? (
                      <ShieldCheck className="size-3" aria-hidden="true" />
                    ) : null}
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {user.joined}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {user.visits}
                </td>
                <td className="px-5 py-3.5 font-semibold">{user.spent}</td>
                <td className="px-5 py-3.5">
                  <StatusPill status={user.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      aria-label={`${user.status === "blocked" ? "Unblock" : "Block"} ${user.name}`}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger-foreground"
                    >
                      <Ban className="size-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Promote ${user.name} to admin`}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                    >
                      <ShieldCheck className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </DashboardPanel>
    </DashboardPage>
  );
}

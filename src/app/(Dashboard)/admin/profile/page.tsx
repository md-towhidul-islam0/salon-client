import {
  BadgeCheck,
  CalendarDays,
  Mail,
  MailCheck,
  Scissors,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Suspense } from "react";

import UserAvatar from "@/components/Global/UserAvatar";
import {
  Allbookingsfunc,
  AllUsers,
  getAllservices,
  getSessionByserver,
} from "@/lib/core/Importantfunction";

import {
  DashboardLoading,
  DashboardPage,
  DashboardPanel,
  StatCard,
  StatusPill,
} from "../../component/dashboard-ui";
import ProfileForm from "../../component/profile-form";

function formatDate(value: string | Date | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getCount(getter: () => Promise<unknown>) {
  try {
    const data = await getter();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

async function getServicesCount() {
  try {
    const res = await getAllservices(null);
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

async function getUsersArray() {
  try {
    const res = await AllUsers();
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function AdminProfilePage() {
  return (
    <Suspense fallback={<DashboardLoading label="Loading your profile" />}>
      <AdminProfileContent />
    </Suspense>
  );
}

async function AdminProfileContent() {
  const [session, users, appointmentsCount, servicesCount] = await Promise.all([
    getSessionByserver(),
    getUsersArray(),
    getCount(() => Allbookingsfunc()),
    getServicesCount(),
  ]);

  const user = session?.user;
  const name = user?.name?.trim() || "Salon administrator";
  const email = user?.email ?? "No email available";
  const image = user?.image ?? null;
  const isBlocked = Boolean(user?.isBlocked);
  const role = (user?.role || "admin").toLowerCase();
  const emailVerified = Boolean(user?.emailVerified);
  const createdAt = formatDate(user?.createdAt);

  const totalCustomers = users.filter(
    (item: { role?: string }) => (item.role || "").toLowerCase() === "customer",
  ).length;

  return (
    <DashboardPage
      eyebrow="Account"
      title="My profile"
      description="Manage your administrator details and review your account information."
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
        <div className="h-24 bg-gradient-to-r from-accent/25 via-accent/10 to-transparent sm:h-28" />
        <div className="flex flex-col gap-4 px-4 pb-5 sm:px-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-10 flex flex-col gap-3 sm:-mt-12 sm:flex-row sm:items-end sm:gap-4">
            <UserAvatar
              image={image}
              name={name}
              size={80}
              className="ring-4 ring-background"
            />
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-xl font-bold text-foreground sm:text-2xl">
                  {name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase ring-1 ring-inset ring-accent/20">
                  <ShieldCheck className="size-3" aria-hidden="true" />
                  {role === "admin" ? "Administrator" : role}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-1">
            <StatusPill status={isBlocked ? "blocked" : "active"} />
            <span
              className={
                emailVerified
                  ? "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-500 ring-1 ring-inset ring-emerald-500/20"
                  : "inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-500 ring-1 ring-inset ring-amber-500/20"
              }
            >
              <MailCheck className="size-3" aria-hidden="true" />
              {emailVerified ? "Email verified" : "Email unverified"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total services"
          value={String(servicesCount)}
          hint="Services in the catalog"
          icon={Scissors}
          tone="accent"
        />
        <StatCard
          label="Appointment requests"
          value={String(appointmentsCount)}
          hint="Total booking requests"
          icon={CalendarDays}
          tone="sky"
        />
        <StatCard
          label="Registered customers"
          value={String(totalCustomers)}
          hint="Customer accounts"
          icon={Users}
          tone="emerald"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardPanel
          className="xl:col-span-2"
          title="Personal information"
          description="Update your basic profile details."
        >
          <ProfileForm name={name} email={email} phone="" address="" />
        </DashboardPanel>

        <DashboardPanel title="Account details">
          <dl className="space-y-4 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <BadgeCheck className="size-4" aria-hidden="true" />
                Status
              </dt>
              <dd>
                <StatusPill status={isBlocked ? "blocked" : "active"} />
              </dd>
            </div>

            <div className="flex items-start justify-between gap-3">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Role
              </dt>
              <dd className="font-medium text-foreground capitalize">{role}</dd>
            </div>

            <div className="flex items-start justify-between gap-3">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4" aria-hidden="true" />
                Email
              </dt>
              <dd className="max-w-[60%] break-all text-right font-medium text-foreground">
                {email}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-3">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <MailCheck className="size-4" aria-hidden="true" />
                Verification
              </dt>
              <dd className="font-medium text-foreground">
                {emailVerified ? "Verified" : "Not verified"}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-3">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="size-4" aria-hidden="true" />
                Member since
              </dt>
              <dd className="text-right font-medium text-foreground">
                {createdAt}
              </dd>
            </div>
          </dl>
        </DashboardPanel>
      </div>
    </DashboardPage>
  );
}

import {
  BadgeCheck,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarX2,
  Mail,
  MailCheck,
  UserRound,
} from "lucide-react";
import { Suspense } from "react";

import UserAvatar from "@/components/Global/UserAvatar";
import {
  EachUserbookingsfuncbyId,
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

type Appointment = {
  status?: string;
};

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

export default function MyProfilePage() {
  return (
    <Suspense fallback={<DashboardLoading label="Loading your profile" />}>
      <MyProfileContent />
    </Suspense>
  );
}

async function MyProfileContent() {
  const session = await getSessionByserver();
  const user = session?.user;

  let appointments: Appointment[] = [];
  try {
    if (user?.id) {
      const res = await EachUserbookingsfuncbyId(user.id);
      const data = await res.json();
      appointments = Array.isArray(data) ? (data as Appointment[]) : [];
    }
  } catch {
    appointments = [];
  }

  const name = user?.name?.trim() || "Customer";
  const email = user?.email ?? "No email available";
  const image = user?.image ?? null;
  const isBlocked = Boolean(user?.isBlocked);
  const emailVerified = Boolean(user?.emailVerified);
  const createdAt = formatDate(user?.createdAt);
  const role = (user?.role || "customer").toLowerCase();

  const totalRequests = appointments.length;
  const pending = appointments.filter(
    (item) => item.status === "pending",
  ).length;
  const confirmed = appointments.filter(
    (item) => item.status === "confirmed",
  ).length;
  const cancelled = appointments.filter(
    (item) => item.status === "cancelled",
  ).length;

  return (
    <DashboardPage
      eyebrow="Account"
      title="My profile"
      description="Manage your personal details and review your account information."
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
                  <UserRound className="size-3" aria-hidden="true" />
                  {role === "customer" ? "Customer" : role}
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total requests"
          value={String(totalRequests)}
          hint="All your appointment requests"
          icon={CalendarDays}
          tone="accent"
        />
        <StatCard
          label="Pending"
          value={String(pending)}
          hint="Awaiting confirmation"
          icon={CalendarClock}
          tone="amber"
        />
        <StatCard
          label="Confirmed"
          value={String(confirmed)}
          hint="Approved appointments"
          icon={CalendarCheck2}
          tone="sky"
        />
        <StatCard
          label="Cancelled"
          value={String(cancelled)}
          hint="Cancelled requests"
          icon={CalendarX2}
          tone="rose"
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
                <UserRound className="size-4" aria-hidden="true" />
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

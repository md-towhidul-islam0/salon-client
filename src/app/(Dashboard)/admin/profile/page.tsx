import {
  BadgeCheck,
  Bell,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Suspense } from "react";

import UserAvatar from "@/components/Global/UserAvatar";
import { getSessionByserver } from "@/lib/core/Importantfunction";

import {
  DashboardLoading,
  DashboardPage,
  DashboardPanel,
  StatusPill,
} from "../../component/dashboard-ui";
import ProfileForm from "../../component/profile-form";

const securityItems = [
  {
    title: "Password",
    description: "Last updated 3 months ago",
    action: "Change",
    icon: KeyRound,
  },
  {
    title: "Two-factor authentication",
    description: "Add an extra layer of account security",
    action: "Enable",
    icon: ShieldCheck,
  },
  {
    title: "Email notifications",
    description: "Booking alerts and daily summaries",
    action: "Manage",
    icon: Bell,
  },
];

export default function AdminProfilePage() {
  return (
    <Suspense fallback={<DashboardLoading label="Loading your profile" />}>
      <AdminProfileContent />
    </Suspense>
  );
}

async function AdminProfileContent() {
  const session = await getSessionByserver();
  const name = session?.user.name?.trim() || "Salon administrator";
  const email = session?.user.email ?? "admin@heairsalon.com";

  return (
    <DashboardPage
      eyebrow="Account"
      title="My profile"
      description="Keep your administrator details current and review the security of your account."
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
        <div className="h-28 bg-gradient-to-r from-accent/25 via-accent/10 to-transparent" />
        <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-10 flex items-end gap-4">
            <UserAvatar
              image={session?.user.image}
              name={name}
              size={80}
              className="ring-4 ring-background"
            />
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{name}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase">
                  <ShieldCheck className="size-3" aria-hidden="true" />
                  Administrator
                </span>
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="size-3.5" aria-hidden="true" />
                {email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 pb-1 text-center">
            <div>
              <p className="text-lg font-bold">24</p>
              <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                Services
              </p>
            </div>
            <div>
              <p className="text-lg font-bold">184</p>
              <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                Bookings
              </p>
            </div>
            <div>
              <p className="text-lg font-bold">1.2k</p>
              <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                Customers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardPanel
          className="xl:col-span-2"
          title="Personal information"
          description="This information is visible only to the salon team."
        >
          <ProfileForm name={name} email={email} phone="" address="" />
        </DashboardPanel>

        <div className="space-y-4">
          <DashboardPanel title="Account details">
            <dl className="space-y-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  Status
                </dt>
                <dd>
                  <StatusPill
                    status={session?.user.isBlocked ? "blocked" : "active"}
                  />
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-4" aria-hidden="true" />
                  Email
                </dt>
                <dd className="max-w-40 truncate text-right font-medium">
                  {email}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-4" aria-hidden="true" />
                  Phone
                </dt>
                <dd className="text-right text-muted-foreground">
                  Not provided
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" aria-hidden="true" />
                  Salon
                </dt>
                <dd className="max-w-40 text-right text-muted-foreground">
                  Gulshan 1, Dhaka
                </dd>
              </div>
            </dl>
          </DashboardPanel>

          <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-accent/5 p-5">
            <Sparkles
              className="absolute -top-2 -right-2 size-16 text-accent/10"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold">Administrator tip</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Review blocked accounts weekly and keep service pricing aligned
              with the website menu.
            </p>
          </div>
        </div>
      </div>

      <DashboardPanel
        title="Security & notifications"
        description="Protect your account and choose how you hear from us."
      >
        <ul className="divide-y divide-border">
          {securityItems.map((item) => (
            <li
              key={item.title}
              className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <item.icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
              >
                {item.action}
              </button>
            </li>
          ))}
        </ul>
      </DashboardPanel>
    </DashboardPage>
  );
}

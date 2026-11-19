import {
  ArrowUpRight,
  CalendarDays,
  CirclePlus,
  Clock,
  CreditCard,
  Scissors,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { getSessionByserver } from "@/lib/core/Importantfunction";

import {
  ActionLink,
  DashboardPage,
  DashboardPanel,
  StatCard,
  StatusPill,
  TableShell,
} from "../component/dashboard-ui";

const stats = [
  {
    label: "Revenue this month",
    value: "৳ 48,250",
    hint: "vs. ৳ 39,900 last month",
    trend: "+20.9%",
    icon: CreditCard,
    tone: "emerald" as const,
  },
  {
    label: "Total appointments",
    value: "184",
    hint: "26 scheduled this week",
    trend: "+12.4%",
    icon: CalendarDays,
    tone: "sky" as const,
  },
  {
    label: "Active customers",
    value: "1,248",
    hint: "38 joined this month",
    trend: "+3.1%",
    icon: Users,
    tone: "accent" as const,
  },
  {
    label: "Services offered",
    value: "24",
    hint: "6 added this quarter",
    icon: Scissors,
    tone: "amber" as const,
  },
];

const appointments = [
  {
    customer: "Nusrat Jahan",
    service: "Balayage & Gloss",
    date: "Today · 10:30 AM",
    stylist: "Ayesha",
    status: "confirmed" as const,
    amount: "৳ 2,400",
  },
  {
    customer: "Tanvir Ahmed",
    service: "Signature Haircut",
    date: "Today · 12:00 PM",
    stylist: "Rafiq",
    status: "pending" as const,
    amount: "৳ 800",
  },
  {
    customer: "Mehjabin Chowdhury",
    service: "Luxury Facial",
    date: "Today · 2:15 PM",
    stylist: "Sadia",
    status: "confirmed" as const,
    amount: "৳ 1,600",
  },
  {
    customer: "Farhan Kabir",
    service: "Beard Sculpt & Trim",
    date: "Tomorrow · 11:00 AM",
    stylist: "Rafiq",
    status: "confirmed" as const,
    amount: "৳ 650",
  },
  {
    customer: "Ishrat Jahan",
    service: "Bridal Makeover",
    date: "Sat · 9:00 AM",
    stylist: "Ayesha",
    status: "pending" as const,
    amount: "৳ 6,500",
  },
];

const topServices = [
  { name: "Signature Haircut", bookings: 62, share: 82 },
  { name: "Luxury Facial", bookings: 41, share: 64 },
  { name: "Hair Spa & Gloss", bookings: 33, share: 52 },
  { name: "Bridal Makeover", bookings: 18, share: 34 },
];

const quickActions = [
  {
    title: "Add a new service",
    description: "Publish a treatment with pricing and duration.",
    href: "/admin/add-update-service",
    icon: CirclePlus,
  },
  {
    title: "Review appointments",
    description: "Confirm, reschedule, or close today's bookings.",
    href: "/admin/manage-appointments",
    icon: CalendarDays,
  },
  {
    title: "Manage users",
    description: "Approve, block, or promote salon customers.",
    href: "/admin/manage-users",
    icon: Users,
  },
];

async function AdminGreeting() {
  const session = await getSessionByserver();
  const firstName = session?.user.name?.split(" ")[0] ?? "Admin";

  return <>Welcome back, {firstName}</>;
}

export default function AdminOverviewPage() {
  return (
    <DashboardPage
      eyebrow="Admin overview"
      title={
        <Suspense fallback="Welcome back">
          <AdminGreeting />
        </Suspense>
      }
      description="Here's how the salon is performing today. Keep an eye on bookings, revenue, and your team's schedule."
      actions={
        <>
          <ActionLink href="/admin/add-update-service" icon={CirclePlus}>
            Add service
          </ActionLink>
          <ActionLink
            href="/admin/manage-appointments"
            variant="outline"
            icon={CalendarDays}
          >
            Appointments
          </ActionLink>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardPanel
          className="xl:col-span-2"
          title="Upcoming appointments"
          description="The next five bookings across all stylists."
          bodyClassName="p-0"
          action={
            <Link
              href="/admin/manage-appointments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
            >
              View all
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        >
          <TableShell>
            <thead>
              <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Schedule</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr
                  key={`${appointment.customer}-${appointment.date}`}
                  className="border-t border-border transition-colors hover:bg-muted/40"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{appointment.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      Stylist · {appointment.stylist}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {appointment.service}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock
                        className="size-3.5 text-accent"
                        aria-hidden="true"
                      />
                      {appointment.date}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={appointment.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold">
                    {appointment.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        </DashboardPanel>

        <div className="space-y-4">
          <DashboardPanel
            title="Top services"
            description="Most booked treatments this month."
          >
            <ul className="space-y-4">
              {topServices.map((service) => (
                <li key={service.name}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{service.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {service.bookings} bookings
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${service.share}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </DashboardPanel>

          <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-accent/5 p-5">
            <Sparkles
              className="absolute -top-3 -right-3 size-20 text-accent/10"
              aria-hidden="true"
            />
            <div className="relative">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <TrendingUp className="size-4" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-semibold">Weekend demand is up</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Saturday slots are 86% booked. Consider opening an extra stylist
                shift.
              </p>
              <Link
                href="/admin/manage-appointments"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
              >
                Plan the schedule
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <DashboardPanel
        title="Quick actions"
        description="Jump straight into the tasks you do most often."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex flex-col rounded-xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <action.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="mt-3 text-sm font-semibold">{action.title}</span>
              <span className="mt-1 text-xs leading-5 text-muted-foreground">
                {action.description}
              </span>
            </Link>
          ))}
        </div>
      </DashboardPanel>
    </DashboardPage>
  );
}

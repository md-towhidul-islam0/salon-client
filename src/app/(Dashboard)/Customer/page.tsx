import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Crown,
  Gift,
  Heart,
  MapPin,
  Scissors,
  Sparkles,
  Star,
  Wallet,
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

const nextAppointment = {
  service: "Balayage & Gloss",
  date: "Saturday, 22 November",
  time: "11:30 AM",
  stylist: "Ayesha Siddika",
  duration: "2 hr 30 min",
  price: "৳ 4,200",
};

const upcoming = [
  {
    service: "Luxury Facial",
    date: "Sat, 29 Nov",
    time: "3:00 PM",
    stylist: "Sadia",
    status: "confirmed" as const,
  },
  {
    service: "Signature Haircut",
    date: "Fri, 12 Dec",
    time: "5:30 PM",
    stylist: "Rafiq",
    status: "pending" as const,
  },
];

const history = [
  {
    service: "Hair Spa & Gloss",
    date: "18 Oct 2026",
    stylist: "Ayesha",
    status: "completed" as const,
    amount: "৳ 1,900",
  },
  {
    service: "Signature Haircut",
    date: "02 Oct 2026",
    stylist: "Rafiq",
    status: "completed" as const,
    amount: "৳ 800",
  },
  {
    service: "Luxury Facial",
    date: "14 Sep 2026",
    stylist: "Sadia",
    status: "completed" as const,
    amount: "৳ 1,600",
  },
  {
    service: "Manicure & Polish",
    date: "23 Aug 2026",
    stylist: "Mim",
    status: "cancelled" as const,
    amount: "৳ 900",
  },
];

const recommendations = [
  {
    name: "Glow Facial Ritual",
    description: "Brightening treatment with vitamin C and rose clay.",
    price: "৳ 1,800",
    duration: "60 min",
  },
  {
    name: "Silk Press & Style",
    description: "Smooth, long-lasting finish for special occasions.",
    price: "৳ 2,600",
    duration: "90 min",
  },
  {
    name: "Scalp Detox",
    description: "Deep cleanse and massage to reset your scalp.",
    price: "৳ 1,450",
    duration: "50 min",
  },
];

async function CustomerGreeting() {
  const session = await getSessionByserver();
  const firstName = session?.user.name?.split(" ")[0] ?? "there";

  return <>Hello, {firstName}</>;
}

export default function CustomerOverviewPage() {
  return (
    <DashboardPage
      eyebrow="Customer dashboard"
      title={
        <Suspense fallback="Hello">
          <CustomerGreeting />
        </Suspense>
      }
      description="Your next salon visit is all set. Manage bookings, revisit past treatments, and discover something new."
      actions={
        <ActionLink href="/services" icon={Scissors}>
          Book a service
        </ActionLink>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Upcoming visits"
          value="3"
          hint="Next on 22 November"
          icon={CalendarDays}
          tone="accent"
        />
        <StatCard
          label="Completed visits"
          value="14"
          hint="Since August 2026"
          icon={Heart}
          tone="emerald"
        />
        <StatCard
          label="Loyalty points"
          value="1,240"
          hint="160 points to your next reward"
          icon={Crown}
          tone="amber"
        />
        <StatCard
          label="Total spent"
          value="৳ 18,400"
          hint="Across 14 appointments"
          icon={Wallet}
          tone="sky"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/15 via-accent/5 to-transparent p-5 xl:col-span-2">
          <Sparkles
            className="absolute -top-4 -right-4 size-28 text-accent/10"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-accent uppercase">
              <Sparkles className="size-3" aria-hidden="true" />
              Next appointment
            </span>
            <h2 className="mt-3 text-2xl font-bold">
              {nextAppointment.service}
            </h2>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <CalendarDays
                  className="size-4 text-accent"
                  aria-hidden="true"
                />
                <span>
                  {nextAppointment.date}
                  <span className="block text-xs text-muted-foreground">
                    {nextAppointment.time} · {nextAppointment.duration}
                  </span>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-accent" aria-hidden="true" />
                <span>
                  HeairSalon, Gulshan 1
                  <span className="block text-xs text-muted-foreground">
                    Stylist · {nextAppointment.stylist}
                  </span>
                </span>
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-accent/15 pt-4">
              <span className="mr-auto text-lg font-bold">
                {nextAppointment.price}
              </span>
              <Link
                href="/Customer/my-appointments"
                className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#a96f66]"
              >
                Manage booking
              </Link>
              <Link
                href="/Customer/my-appointments"
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
              >
                Reschedule
              </Link>
            </div>
          </div>
        </div>

        <DashboardPanel
          title="Upcoming visits"
          description="The next two bookings"
        >
          <ul className="space-y-3">
            {upcoming.map((item) => (
              <li
                key={item.service}
                className="rounded-xl border border-border p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{item.service}</p>
                  <StatusPill status={item.status} />
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {item.date} · {item.time}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Stylist · {item.stylist}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/Customer/my-appointments"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            View all appointments
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </DashboardPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardPanel
          className="xl:col-span-2"
          title="Recent visits"
          description="A quick look at your treatment history."
          bodyClassName="p-0"
          action={
            <Link
              href="/Customer/my-appointments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
            >
              Full history
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        >
          <TableShell>
            <thead>
              <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Stylist</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((visit) => (
                <tr
                  key={`${visit.service}-${visit.date}`}
                  className="border-t border-border transition-colors hover:bg-muted/40"
                >
                  <td className="px-5 py-3.5 font-medium">{visit.service}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {visit.date}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {visit.stylist}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={visit.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold">
                    {visit.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        </DashboardPanel>

        <DashboardPanel
          title="Loyalty rewards"
          description="You're closer than you think."
        >
          <div className="rounded-xl bg-muted/60 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Gold member</span>
              <span className="text-xs text-muted-foreground">
                1,240 / 1,400
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: "88%" }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              160 points until a complimentary hair spa.
            </p>
          </div>
          <ul className="mt-4 space-y-3 text-xs text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <Gift className="mt-0.5 size-3.5 shrink-0 text-accent" />
              Birthday month: double points on every visit.
            </li>
            <li className="flex items-start gap-2.5">
              <Star className="mt-0.5 size-3.5 shrink-0 text-accent" />
              Gold members get priority weekend slots.
            </li>
          </ul>
        </DashboardPanel>
      </div>

      <DashboardPanel
        title="Recommended for you"
        description="Picked from treatments you've enjoyed before."
        action={
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            Browse all
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {recommendations.map((item) => (
            <div
              key={item.name}
              className="group rounded-xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-semibold">{item.name}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">{item.duration}</span>
                <span className="font-bold text-accent">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>
    </DashboardPage>
  );
}

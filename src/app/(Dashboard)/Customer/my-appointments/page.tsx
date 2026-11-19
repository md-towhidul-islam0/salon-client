import {
  CalendarDays,
  Clock,
  MapPin,
  Scissors,
  Sparkles,
  Star,
} from "lucide-react";

import {
  ActionLink,
  DashboardPage,
  DashboardPanel,
  StatusPill,
  TableShell,
} from "../../component/dashboard-ui";

const upcoming = [
  {
    id: "APT-1042",
    service: "Balayage & Gloss",
    date: "Saturday, 22 November 2026",
    time: "11:30 AM",
    duration: "2 hr 30 min",
    stylist: "Ayesha Siddika",
    price: "৳ 4,200",
    status: "confirmed" as const,
  },
  {
    id: "APT-1061",
    service: "Luxury Facial",
    date: "Saturday, 29 November 2026",
    time: "3:00 PM",
    duration: "1 hr",
    stylist: "Sadia Rahman",
    price: "৳ 1,600",
    status: "confirmed" as const,
  },
  {
    id: "APT-1088",
    service: "Signature Haircut",
    date: "Friday, 12 December 2026",
    time: "5:30 PM",
    duration: "45 min",
    stylist: "Rafiq Hasan",
    price: "৳ 800",
    status: "pending" as const,
  },
];

const past = [
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
  {
    service: "Hair Spa & Gloss",
    date: "09 Aug 2026",
    stylist: "Ayesha",
    status: "completed" as const,
    amount: "৳ 1,900",
  },
];

export default function MyAppointmentsPage() {
  return (
    <DashboardPage
      eyebrow="My bookings"
      title="My appointments"
      description="Track upcoming visits, reschedule when plans change, and revisit your treatment history."
      actions={
        <ActionLink href="/services" icon={Scissors}>
          Book a service
        </ActionLink>
      }
    >
      <DashboardPanel
        title="Upcoming appointments"
        description="You have 3 visits scheduled."
        action={
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
            <CalendarDays className="size-3" aria-hidden="true" />3 upcoming
          </span>
        }
      >
        <ul className="space-y-3">
          {upcoming.map((appointment) => (
            <li
              key={appointment.id}
              className="flex flex-col gap-4 rounded-xl border border-border p-4 transition-colors hover:border-accent/30 sm:flex-row sm:items-center"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{appointment.service}</p>
                  <StatusPill status={appointment.status} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {appointment.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {appointment.time} · {appointment.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    Gulshan 1
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Stylist · {appointment.stylist}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                <p className="text-sm font-bold">{appointment.price}</p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </DashboardPanel>

      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardPanel
          className="xl:col-span-2"
          title="Visit history"
          description="Past appointments and their payment status."
          bodyClassName="p-0"
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
              {past.map((visit) => (
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

        <div className="space-y-4">
          <DashboardPanel title="Cancellation policy">
            <p className="text-xs leading-5 text-muted-foreground">
              Reschedule or cancel free of charge up to 12 hours before your
              appointment. Later changes incur a 20% fee.
            </p>
            <div className="mt-3 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
              Need help? Call{" "}
              <a
                href="tel:+8801712345678"
                className="font-semibold text-accent hover:underline"
              >
                +880 1712-345678
              </a>
            </div>
          </DashboardPanel>

          <div className="rounded-2xl border border-accent/25 bg-accent/5 p-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <Star
                className="size-4 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              Rate your last visit
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Tell us how the Hair Spa & Gloss went on 18 October.
            </p>
            <button
              type="button"
              className="mt-3 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#a96f66]"
            >
              Leave a review
            </button>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}

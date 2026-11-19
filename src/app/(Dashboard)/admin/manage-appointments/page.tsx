import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

import {
  DashboardPage,
  DashboardPanel,
  StatCard,
  StatusPill,
  TableShell,
} from "../../component/dashboard-ui";

const tabs = ["Today", "Upcoming", "Completed", "Cancelled"];

const appointments = [
  {
    id: "APT-1042",
    customer: "Nusrat Jahan",
    email: "nusrat@example.com",
    service: "Balayage & Gloss",
    date: "Today, 19 Nov",
    time: "10:30 AM",
    stylist: "Ayesha",
    status: "confirmed" as const,
    amount: "৳ 4,200",
  },
  {
    id: "APT-1043",
    customer: "Tanvir Ahmed",
    email: "tanvir@example.com",
    service: "Signature Haircut",
    date: "Today, 19 Nov",
    time: "12:00 PM",
    stylist: "Rafiq",
    status: "pending" as const,
    amount: "৳ 800",
  },
  {
    id: "APT-1044",
    customer: "Mehjabin Chowdhury",
    email: "mehjabin@example.com",
    service: "Luxury Facial",
    date: "Today, 19 Nov",
    time: "2:15 PM",
    stylist: "Sadia",
    status: "confirmed" as const,
    amount: "৳ 1,600",
  },
  {
    id: "APT-1045",
    customer: "Farhan Kabir",
    email: "farhan@example.com",
    service: "Beard Sculpt & Trim",
    date: "Tomorrow, 20 Nov",
    time: "11:00 AM",
    stylist: "Rafiq",
    status: "confirmed" as const,
    amount: "৳ 650",
  },
  {
    id: "APT-1046",
    customer: "Ishrat Jahan",
    email: "ishrat@example.com",
    service: "Bridal Makeover",
    date: "Sat, 22 Nov",
    time: "9:00 AM",
    stylist: "Ayesha",
    status: "pending" as const,
    amount: "৳ 6,500",
  },
  {
    id: "APT-1047",
    customer: "Sadia Rahman",
    email: "sadia@example.com",
    service: "Hair Spa & Gloss",
    date: "Sat, 22 Nov",
    time: "4:30 PM",
    stylist: "Sadia",
    status: "cancelled" as const,
    amount: "৳ 1,900",
  },
];

export default function ManageAppointmentsPage() {
  return (
    <DashboardPage
      eyebrow="Bookings"
      title="Manage appointments"
      description="Confirm new requests, reschedule when needed, and keep the salon calendar running smoothly."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today's bookings"
          value="8"
          hint="4 done · 4 remaining"
          icon={CalendarDays}
          tone="accent"
        />
        <StatCard
          label="Awaiting confirmation"
          value="3"
          hint="Respond within 2 hours"
          icon={CalendarClock}
          tone="amber"
        />
        <StatCard
          label="This week"
          value="26"
          hint="3 slots still open"
          icon={CalendarCheck}
          tone="sky"
        />
        <StatCard
          label="Completion rate"
          value="94%"
          hint="Past 30 days"
          icon={CheckCircle}
          tone="emerald"
        />
      </div>

      <DashboardPanel
        title="Appointment list"
        description="Sorted by schedule. Use the row actions to confirm or cancel."
        bodyClassName="p-0"
      >
        <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-5 py-3">
          {tabs.map((tab, index) => (
            <span
              key={tab}
              className={
                index === 0
                  ? "rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-white"
                  : "rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground"
              }
            >
              {tab}
            </span>
          ))}
        </div>

        <TableShell>
          <thead>
            <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Schedule</th>
              <th className="px-5 py-3 font-medium">Stylist</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-t border-border transition-colors hover:bg-muted/40"
              >
                <td className="px-5 py-3.5">
                  <p className="font-medium">{appointment.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.email}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-muted-foreground">{appointment.service}</p>
                  <p className="text-[11px] text-muted-foreground/70">
                    {appointment.id}
                  </p>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  <p>{appointment.date}</p>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground/80">
                    <Clock className="size-3" aria-hidden="true" />
                    {appointment.time}
                  </p>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {appointment.stylist}
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill status={appointment.status} />
                </td>
                <td className="px-5 py-3.5 text-right font-semibold">
                  {appointment.amount}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      aria-label={`Confirm appointment for ${appointment.customer}`}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-500"
                    >
                      <CheckCircle className="size-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Cancel appointment for ${appointment.customer}`}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger-foreground"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>

        <div className="flex flex-col gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Showing 6 of 184 appointments</p>
          <p>Page 1 of 31</p>
        </div>
      </DashboardPanel>
    </DashboardPage>
  );
}

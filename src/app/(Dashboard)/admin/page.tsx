import {
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CirclePlus,
  Clock,
  Scissors,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import {
  Allbookingsfunc,
  AllUsers,
  getAllservices,
  getSessionByserver,
} from "@/lib/core/Importantfunction";

import {
  ActionLink,
  DashboardPage,
  DashboardPanel,
  StatCard,
  StatusPill,
  TableShell,
} from "../component/dashboard-ui";

type Appointment = {
  _id: string;
  serviceId: string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  servicePrice: number;
  paymentStatus: "paid" | "unpaid";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
};

type User = {
  _id?: string;
  role?: string;
};

type Service = {
  _id?: string;
  name?: string;
  status?: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price: number) {
  if (!Number.isFinite(price)) return "৳ 0";
  return `৳ ${price.toLocaleString("en-BD")}`;
}

async function getUsers(): Promise<User[]> {
  try {
    const res = await AllUsers();
    const data = await res.json();
    return Array.isArray(data) ? (data as User[]) : [];
  } catch {
    return [];
  }
}

async function getServices(): Promise<Service[]> {
  try {
    const res = await getAllservices(null);
    const data = await res.json();
    return Array.isArray(data) ? (data as Service[]) : [];
  } catch {
    return [];
  }
}

async function getAppointments(): Promise<Appointment[]> {
  try {
    const data = await Allbookingsfunc();
    return Array.isArray(data) ? (data as Appointment[]) : [];
  } catch {
    return [];
  }
}

async function AdminGreeting() {
  const session = await getSessionByserver();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Admin";
  return <>Welcome back, {firstName}</>;
}

export default async function AdminOverviewPage() {
  const [users, services, appointments] = await Promise.all([
    getUsers(),
    getServices(),
    getAppointments(),
  ]);

  const totalRegisteredCustomers = users.filter(
    (user) => (user.role || "").toLowerCase() === "customer",
  ).length;
  const totalActiveServices = services.filter(
    (service) => (service.status || "").toLowerCase() === "active",
  ).length;
  const totalAppointmentRequests = appointments.length;
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  ).length;
  const successfulPayments = appointments.filter(
    (appointment) => appointment.paymentStatus === "paid",
  );
  const totalSuccessfulPayments = successfulPayments.length;
  const successfulPaymentAmount = successfulPayments.reduce(
    (sum, appointment) => sum + (Number(appointment.servicePrice) || 0),
    0,
  );

  const serviceMap = new Map(
    services
      .filter((service) => typeof service._id === "string")
      .map((service) => [service._id as string, service]),
  );

  const recentAppointments = [...appointments]
    .sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return (
        (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime)
      );
    })
    .slice(0, 5);

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

  return (
    <DashboardPage
      eyebrow="Admin overview"
      title={
        <Suspense fallback="Welcome back">
          <AdminGreeting />
        </Suspense>
      }
      description="Track customers, services, appointment requests, and payment activity from one place."
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total registered customers"
          value={String(totalRegisteredCustomers)}
          hint="Customer accounts on the platform"
          icon={Users}
          tone="accent"
        />
        <StatCard
          label="Total active services"
          value={String(totalActiveServices)}
          hint="Services currently available for booking"
          icon={Scissors}
          tone="emerald"
        />
        <StatCard
          label="Total appointment requests"
          value={String(totalAppointmentRequests)}
          hint="All booking requests received"
          icon={CalendarDays}
          tone="sky"
        />
        <StatCard
          label="Pending appointments"
          value={String(pendingAppointments)}
          hint="Awaiting admin confirmation"
          icon={CalendarClock}
          tone="amber"
        />
        <StatCard
          label="Confirmed appointments"
          value={String(confirmedAppointments)}
          hint="Appointments ready to serve"
          icon={CalendarCheck2}
          tone="sky"
        />
        <StatCard
          label="Total successful payments"
          value={String(totalSuccessfulPayments)}
          hint={`Paid amount: ${formatPrice(successfulPaymentAmount)}`}
          icon={BadgeCheck}
          tone="emerald"
        />
      </div>

      <DashboardPanel
        title="Recent appointment requests"
        description="Latest appointment requests and their current status."
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
        {recentAppointments.length === 0 ? (
          <div className="p-5 text-sm text-muted-foreground">
            No appointment requests yet.
          </div>
        ) : (
          <TableShell>
            <thead>
              <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Schedule</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => {
                const service = serviceMap.get(appointment.serviceId);
                const status =
                  appointment.status === "pending" ||
                  appointment.status === "confirmed" ||
                  appointment.status === "cancelled" ||
                  appointment.status === "completed"
                    ? appointment.status
                    : "pending";

                return (
                  <tr
                    key={appointment._id}
                    className="border-t border-border transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">
                        {service?.name || "Unknown service"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested {formatDate(appointment.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      <p>{formatDate(appointment.appointmentDate)}</p>
                      <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80">
                        <Clock
                          className="size-3.5 text-accent"
                          aria-hidden="true"
                        />
                        {appointment.timeSlot || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={
                          appointment.paymentStatus === "paid"
                            ? "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-500 ring-1 ring-inset ring-emerald-500/20"
                            : "inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-500 ring-1 ring-inset ring-amber-500/20"
                        }
                      >
                        {appointment.paymentStatus === "paid"
                          ? "Paid"
                          : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={status} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                      {formatPrice(appointment.servicePrice)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </TableShell>
        )}
      </DashboardPanel>

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

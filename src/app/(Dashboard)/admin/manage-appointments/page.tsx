import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";

import {
  Allbookingsfunc,
  EachUserbyId,
  getAllservices,
} from "@/lib/core/Importantfunction";

import {
  DashboardPage,
  DashboardPanel,
  EmptyState,
  StatCard,
  StatusPill,
  TableShell,
} from "../../component/dashboard-ui";
import AppointmentDetailsDialog from "./appointment-details-dialog";
import AppointmentStatusDropdown from "./appointment-status-dropdown";

type Appointment = {
  _id: string;
  serviceId: string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
  paymentStatus: "paid" | "unpaid";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
};

type Customer = {
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
};

type Service = {
  _id?: string;
  name?: string;
  category?: string;
  price?: number;
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

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return date.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatPrice(price: number) {
  if (!Number.isFinite(price)) return "৳ 0";
  return `৳ ${price.toLocaleString("en-BD")}`;
}

function formatCategory(category: string | undefined) {
  if (!category) return "General";
  return category.replace(/-/g, " ").replace(/1/g, "&");
}

async function getServiceMap() {
  try {
    const response = await getAllservices(null);
    const data = await response.json();
    const services: Service[] = Array.isArray(data) ? data : [];
    return new Map(
      services
        .filter((service) => typeof service?._id === "string")
        .map((service) => [service._id as string, service]),
    );
  } catch {
    return new Map<string, Service>();
  }
}

async function getCustomerMap(customerIds: string[]) {
  const uniqueIds = Array.from(new Set(customerIds.filter(Boolean)));
  const entries = await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const data = await EachUserbyId(id);
        const customer = Array.isArray(data) ? data[0] : data;
        return [id, (customer ?? {}) as Customer] as const;
      } catch {
        return [id, {} as Customer] as const;
      }
    }),
  );

  return new Map(entries);
}

export default async function ManageAppointmentsPage() {
  let appointments: Appointment[] = [];
  try {
    const data = await Allbookingsfunc();
    appointments = Array.isArray(data) ? (data as Appointment[]) : [];
  } catch {
    appointments = [];
  }

  const [customerMap, serviceMap] = await Promise.all([
    getCustomerMap(appointments.map((appointment) => appointment.customerId)),
    getServiceMap(),
  ]);

  const total = appointments.length;
  const pending = appointments.filter(
    (item) => item.status === "pending",
  ).length;
  const confirmed = appointments.filter(
    (item) => item.status === "confirmed",
  ).length;
  const paid = appointments.filter(
    (item) => item.paymentStatus === "paid",
  ).length;

  return (
    <DashboardPage
      eyebrow="Bookings"
      title="Manage appointments"
      description="Review appointment requests, check customer and service details, and confirm or cancel bookings."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total requests"
          value={String(total)}
          hint="All appointment requests"
          icon={CalendarDays}
          tone="accent"
        />
        <StatCard
          label="Pending"
          value={String(pending)}
          hint="Awaiting admin confirmation"
          icon={CalendarClock}
          tone="amber"
        />
        <StatCard
          label="Confirmed"
          value={String(confirmed)}
          hint="Ready to serve"
          icon={CalendarCheck2}
          tone="sky"
        />
        <StatCard
          label="Paid"
          value={String(paid)}
          hint="Payment completed"
          icon={CircleDollarSign}
          tone="emerald"
        />
      </div>

      <DashboardPanel
        title="Appointment requests"
        description="View details, confirm pending requests, or cancel pending/confirmed appointments."
        bodyClassName="p-0"
      >
        {appointments.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={CalendarDays}
              title="No appointments found"
              description="Appointment requests will appear here when customers book a service."
            />
          </div>
        ) : (
          <TableShell>
            <thead>
              <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Appointment</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => {
                const customer = customerMap.get(appointment.customerId);
                const service = serviceMap.get(appointment.serviceId);
                const customerName = customer?.name || "Unknown customer";
                const customerEmail = customer?.email || "No email available";
                const serviceName = service?.name || "Unknown service";
                const serviceCategory = formatCategory(service?.category);
                const appointmentStatus =
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
                      <p className="font-medium">{customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {customerEmail}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">
                        {serviceName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {serviceCategory}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      <p>{formatDate(appointment.appointmentDate)}</p>
                      <p className="text-xs text-muted-foreground/80">
                        {appointment.timeSlot}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground/70">
                        Requested: {formatDateTime(appointment.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap">
                      {formatPrice(appointment.servicePrice)}
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
                      <StatusPill status={appointmentStatus} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <AppointmentDetailsDialog
                          appointment={{
                            _id: appointment._id,
                            appointmentDate: appointment.appointmentDate,
                            timeSlot: appointment.timeSlot,
                            message: appointment.message,
                            servicePrice: appointment.servicePrice,
                            paymentStatus: appointment.paymentStatus,
                            status: appointmentStatus,
                            createdAt: appointment.createdAt,
                            customerName,
                            customerEmail,
                            serviceName,
                            serviceCategory,
                          }}
                        />
                        <AppointmentStatusDropdown
                          appointmentId={appointment._id}
                          currentStatus={appointmentStatus}
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

import { CalendarDays } from "lucide-react";
import Image from "next/image";

import {
  EachUserbookingsfuncbyId,
  getAllservices,
  getSessionByserver,
} from "@/lib/core/Importantfunction";

import {
  DashboardPage,
  DashboardPanel,
  EmptyState,
  StatusPill,
  TableShell,
} from "../../component/dashboard-ui";
import AppointmentDetailsDialog from "./appointment-details-dialog";
import CancelAppointmentButton from "./cancel-appointment-button";
import Paybutton from "./Pay-button";

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

type Service = {
  _id?: string;
  name?: string;
  category?: string;
  image?: string;
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
    const res = await getAllservices(null);
    const data = await res.json();
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
type SearchParams = { [key: string]: string | string[] | undefined }
export default async function MyAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  

    const { canceled } = await searchParams

  if (canceled) {
    console.log(
      'Order canceled -- continue to shop around and check out when you\'re ready.'
    )
  }
  const session = await getSessionByserver();
  let appointments: Appointment[] = [];
  try {
    if (session?.user?.id) {
      const res = await EachUserbookingsfuncbyId(session.user.id);
      const data = await res.json();
      appointments = Array.isArray(data) ? (data as Appointment[]) : [];
    }
  } catch {
    appointments = [];
  }

  const serviceMap = await getServiceMap();

  return (
    <DashboardPage
      eyebrow="My bookings"
      title="My appointments"
      description="View all your appointment requests, track their status, and manage pending bookings."
    >
      <DashboardPanel
        title="Appointment requests"
        description="All appointment requests submitted by your account."
        bodyClassName="p-0"
      >
        {appointments.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={CalendarDays}
              title="No appointments yet"
              description="When you book a service, your appointment requests will appear here."
            />
          </div>
        ) : (
          <TableShell>
            <thead>
              <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
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
                const service = serviceMap.get(appointment.serviceId);
                const serviceName = service?.name || "Unknown service";
                const serviceCategory = formatCategory(service?.category);
                const serviceImage = service?.image;
                const status =
                  appointment.status === "pending" ||
                  appointment.status === "confirmed" ||
                  appointment.status === "cancelled" ||
                  appointment.status === "completed"
                    ? appointment.status
                    : "pending";
                const canPay =
                  status === "confirmed" &&
                  appointment.paymentStatus === "unpaid";
             
                return (
                  <tr
                    key={appointment._id}
                    className="border-t border-border transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                          {serviceImage ? (
                            <Image
                              src={serviceImage}
                              alt={serviceName}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-muted-foreground">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {serviceName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {serviceCategory}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-muted-foreground">
                      <p className="font-medium text-foreground">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        {appointment.timeSlot || "—"}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground/70">
                        Requested: {formatDateTime(appointment.createdAt)}
                      </p>
                    </td>

                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap text-foreground">
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
                      <StatusPill status={status} />
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
                            status,
                            createdAt: appointment.createdAt,
                            serviceName,
                            serviceCategory,
                            serviceImage,
                          }}
                        />

                        {canPay ? (
                          <Paybutton appointmentId={appointment._id}></Paybutton>
                        ) : null}

                        <CancelAppointmentButton
                          appointmentId={appointment._id}
                          status={status}
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

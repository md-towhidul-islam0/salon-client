import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  Clock3,
  CreditCard,
  Mail,
  MessageSquareText,
  ReceiptText,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  Allbookingsfunc,
  EachUserbyId,
  getAllservices,
} from "@/lib/core/Importantfunction";

import {
  DashboardPage,
  DashboardPanel,
  StatusPill,
} from "../../../component/dashboard-ui";
import AppointmentStatusDropdown from "../appointment-status-dropdown";

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
    weekday: "short",
    day: "numeric",
    month: "long",
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

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/20 p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {label}
        </p>
        <div className="mt-1 break-words text-sm font-medium text-foreground">
          {value}
        </div>
      </div>
    </div>
  );
}

export default async function AppointmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let appointments: Appointment[] = [];
  try {
    const data = await Allbookingsfunc();
    appointments = Array.isArray(data) ? (data as Appointment[]) : [];
  } catch {
    appointments = [];
  }

  const appointment = appointments.find((item) => item._id === id);

  if (!appointment) {
    return (
      <DashboardPage
        eyebrow="Bookings"
        title="Appointment not found"
        description="The appointment you’re looking for doesn’t exist or may have been removed."
      >
        <div className="rounded-[2rem] border border-border bg-background p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-danger-soft text-danger">
            <CircleAlert className="size-7" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-foreground">
            Couldn’t find this appointment
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Please check the appointment ID or return to the appointments list.
          </p>
          <Link
            href="/admin/manage-appointments"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-[#a96f66]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to appointments
          </Link>
        </div>
      </DashboardPage>
    );
  }

  let customer: Customer = {};
  try {
    const customerData = await EachUserbyId(appointment.customerId);
    customer =
      (Array.isArray(customerData) ? customerData[0] : customerData) ?? {};
  } catch {
    customer = {};
  }

  let service: Service = {};
  try {
    const res = await getAllservices(null);
    const services = await res.json();
    if (Array.isArray(services)) {
      service =
        (services.find(
          (item) => item?._id === appointment.serviceId,
        ) as Service) ?? {};
    }
  } catch {
    service = {};
  }

  const appointmentStatus =
    appointment.status === "pending" ||
    appointment.status === "confirmed" ||
    appointment.status === "cancelled" ||
    appointment.status === "completed"
      ? appointment.status
      : "pending";

  const customerName = customer.name || "Unknown customer";
  const customerEmail = customer.email || "No email available";
  const serviceName = service.name || "Unknown service";
  const serviceCategory = formatCategory(service.category);

  return (
    <DashboardPage
      eyebrow="Bookings"
      title="Appointment details"
      description="Review the full appointment request and manage its status."
      actions={
        <Link
          href="/admin/manage-appointments"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to list
        </Link>
      }
    >
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4 sm:space-y-6">
          <DashboardPanel
            title="Appointment overview"
            description={`Request ID: ${appointment._id}`}
            action={
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={appointmentStatus} />
                <span
                  className={
                    appointment.paymentStatus === "paid"
                      ? "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-500 ring-1 ring-inset ring-emerald-500/20"
                      : "inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-500 ring-1 ring-inset ring-amber-500/20"
                  }
                >
                  {appointment.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </span>
              </div>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={CalendarDays}
                label="Appointment date"
                value={formatDate(appointment.appointmentDate)}
              />
              <InfoItem
                icon={Clock3}
                label="Time slot"
                value={appointment.timeSlot || "—"}
              />
              <InfoItem
                icon={ReceiptText}
                label="Service price"
                value={formatPrice(appointment.servicePrice)}
              />
              <InfoItem
                icon={CreditCard}
                label="Payment status"
                value={appointment.paymentStatus === "paid" ? "Paid" : "Unpaid"}
              />
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Customer information"
            description="Details about the customer who requested this appointment."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={UserRound}
                label="Customer name"
                value={customerName}
              />
              <InfoItem
                icon={Mail}
                label="Email address"
                value={customerEmail}
              />
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Service information"
            description="The service selected for this appointment request."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={ReceiptText}
                label="Service name"
                value={serviceName}
              />
              <InfoItem
                icon={CalendarDays}
                label="Category"
                value={serviceCategory}
              />
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Customer message"
            description="Additional note provided during booking."
          >
            {appointment.message?.trim() ? (
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/20 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <MessageSquareText className="size-4" aria-hidden="true" />
                </span>
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {appointment.message}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No message was provided for this appointment.
              </p>
            )}
          </DashboardPanel>
        </div>

        <aside className="min-w-0 space-y-4 sm:space-y-6">
          <DashboardPanel
            title="Manage status"
            description="Update the appointment status as needed."
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Current status
                </p>
                <div className="mt-2">
                  <StatusPill status={appointmentStatus} />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <AppointmentStatusDropdown
                  appointmentId={appointment._id}
                  currentStatus={appointmentStatus}
                />
              </div>
            </div>
          </DashboardPanel>

          <DashboardPanel title="Request info" description="Booking metadata.">
            <div className="space-y-3 text-sm">
              <div className="flex flex-col gap-1 border-b border-border/70 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">
                  Booking request date
                </span>
                <span className="font-medium text-foreground sm:text-right">
                  {formatDateTime(appointment.createdAt)}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-b border-border/70 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Appointment ID</span>
                <span className="break-all font-mono text-xs text-foreground sm:text-right">
                  {appointment._id}
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Customer ID</span>
                <span className="break-all font-mono text-xs text-foreground sm:text-right">
                  {appointment.customerId}
                </span>
              </div>
            </div>
          </DashboardPanel>
        </aside>
      </div>
    </DashboardPage>
  );
}

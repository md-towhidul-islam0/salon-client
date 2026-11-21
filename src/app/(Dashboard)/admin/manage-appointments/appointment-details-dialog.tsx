"use client";

import {
  CalendarDays,
  Clock3,
  Eye,
  Mail,
  MessageSquareText,
  User,
  X,
} from "lucide-react";
import { useEffect, useId, useState } from "react";

import { StatusPill } from "../../component/dashboard-ui";

type AppointmentDetails = {
  _id: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
  paymentStatus: "paid" | "unpaid";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  serviceCategory: string;
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

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/20 px-4 py-3">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

export default function AppointmentDetailsDialog({
  appointment,
}: {
  appointment: AppointmentDetails;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="View appointment details"
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
      >
        <Eye className="size-3.5" aria-hidden="true" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label="Close details dialog"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-border bg-background shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                  Appointment details
                </p>
                <h2
                  id={titleId}
                  className="mt-1 text-lg font-semibold text-foreground"
                >
                  {appointment.serviceName}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Request ID: {appointment._id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close dialog"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailRow
                  label="Customer"
                  value={
                    <div className="space-y-1">
                      <p className="inline-flex items-center gap-2 font-medium">
                        <User
                          className="size-4 text-accent"
                          aria-hidden="true"
                        />
                        {appointment.customerName}
                      </p>
                      <p className="inline-flex items-center gap-2 text-muted-foreground">
                        <Mail className="size-4" aria-hidden="true" />
                        {appointment.customerEmail}
                      </p>
                    </div>
                  }
                />
                <DetailRow
                  label="Service"
                  value={
                    <div>
                      <p className="font-medium">{appointment.serviceName}</p>
                      <p className="text-muted-foreground">
                        {appointment.serviceCategory}
                      </p>
                    </div>
                  }
                />
                <DetailRow
                  label="Appointment schedule"
                  value={
                    <div className="space-y-1">
                      <p className="inline-flex items-center gap-2">
                        <CalendarDays
                          className="size-4 text-accent"
                          aria-hidden="true"
                        />
                        {formatDate(appointment.appointmentDate)}
                      </p>
                      <p className="inline-flex items-center gap-2 text-muted-foreground">
                        <Clock3 className="size-4" aria-hidden="true" />
                        {appointment.timeSlot}
                      </p>
                    </div>
                  }
                />
                <DetailRow
                  label="Booking request date"
                  value={formatDateTime(appointment.createdAt)}
                />
                <DetailRow
                  label="Service price"
                  value={formatPrice(appointment.servicePrice)}
                />
                <DetailRow
                  label="Statuses"
                  value={
                    <div className="flex flex-wrap gap-2">
                      <StatusPill status={appointment.status} />
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
                    </div>
                  }
                />
                <div className="sm:col-span-2">
                  <DetailRow
                    label="Customer message"
                    value={
                      appointment.message?.trim() ? (
                        <p className="inline-flex items-start gap-2 whitespace-pre-wrap text-muted-foreground">
                          <MessageSquareText
                            className="mt-0.5 size-4 shrink-0 text-accent"
                            aria-hidden="true"
                          />
                          <span>{appointment.message}</span>
                        </p>
                      ) : (
                        <span className="text-muted-foreground">
                          No message provided.
                        </span>
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

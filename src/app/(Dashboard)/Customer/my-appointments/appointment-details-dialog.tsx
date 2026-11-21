"use client";

import {
  CalendarDays,
  Clock3,
  CreditCard,
  Eye,
  MessageSquareText,
  ReceiptText,
  Tag,
  X,
} from "lucide-react";
import Image from "next/image";
import { type ReactNode, useEffect, useId, useState } from "react";

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
  serviceName: string;
  serviceCategory: string;
  serviceImage?: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return date.toLocaleDateString("en-BD", {
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

function DetailRow({
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
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Eye className="size-3.5" aria-hidden="true" />
        Details
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
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                  Appointment details
                </p>
                <h2
                  id={titleId}
                  className="mt-1 truncate text-lg font-semibold text-foreground"
                >
                  {appointment.serviceName}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Request date: {formatDateTime(appointment.createdAt)}
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
              <div className="mb-5 overflow-hidden rounded-2xl border border-border bg-muted/20">
                {appointment.serviceImage ? (
                  <div className="relative h-44 w-full sm:h-52">
                    <Image
                      src={appointment.serviceImage}
                      alt={appointment.serviceName}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 672px) 100vw, 672px"
                    />
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center gap-2 p-4">
                  <StatusPill status={appointment.status} />
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
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailRow
                  icon={Tag}
                  label="Service category"
                  value={appointment.serviceCategory}
                />
                <DetailRow
                  icon={ReceiptText}
                  label="Service price"
                  value={formatPrice(appointment.servicePrice)}
                />
                <DetailRow
                  icon={CalendarDays}
                  label="Appointment date"
                  value={formatDate(appointment.appointmentDate)}
                />
                <DetailRow
                  icon={Clock3}
                  label="Appointment time"
                  value={appointment.timeSlot || "—"}
                />
                <DetailRow
                  icon={CreditCard}
                  label="Payment status"
                  value={
                    appointment.paymentStatus === "paid" ? "Paid" : "Unpaid"
                  }
                />
                <DetailRow
                  icon={CalendarDays}
                  label="Request date"
                  value={formatDateTime(appointment.createdAt)}
                />
                <div className="sm:col-span-2">
                  <DetailRow
                    icon={MessageSquareText}
                    label="Your message"
                    value={
                      appointment.message?.trim()
                        ? appointment.message
                        : "No message provided."
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

"use client";

import { CalendarDays, Clock3, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useId, useMemo, useState } from "react";

import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type PaymentStatus = "unpaid" | "paid";
type BookingStatus = "pending" | "confirmed" | "cancelled";

type ExistingBooking = {
  serviceId?: string;
  appointmentDate?: string;
  timeSlot?: string;
  status?: string;
};

export type BookingFormData = {
  serviceId: string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  message: string;
  servicePrice: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  createdAt: string;
};

type BookingDialogProps = {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  customerId: string;
  existingBookings?: ExistingBooking[];
};

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
];

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20";

const labelClass = "mb-1.5 block text-xs font-semibold text-foreground";

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BookingDialog({
  serviceId,
  serviceName,
  servicePrice,
  customerId,
  existingBookings = [],
}: BookingDialogProps) {
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    appointmentDate?: string;
    timeSlot?: string;
  }>({});

  const unavailableSlots = useMemo(() => {
    if (!appointmentDate) return new Set<string>();

    return new Set(
      existingBookings
        .filter(
          (booking) =>
            booking.serviceId === serviceId &&
            booking.appointmentDate === appointmentDate &&
            booking.status !== "cancelled" &&
            typeof booking.timeSlot === "string",
        )
        .map((booking) => booking.timeSlot as string),
    );
  }, [appointmentDate, existingBookings, serviceId]);

  useEffect(() => {
    if (timeSlot && unavailableSlots.has(timeSlot)) {
      setTimeSlot("");
    }
  }, [timeSlot, unavailableSlots]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function resetForm() {
    setAppointmentDate("");
    setTimeSlot("");
    setMessage("");
    setErrors({});
  }

  function openDialog() {
    resetForm();
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: { appointmentDate?: string; timeSlot?: string } = {};
    if (!appointmentDate) {
      nextErrors.appointmentDate = "Please choose an appointment date.";
    }
    if (!timeSlot) {
      nextErrors.timeSlot = "Please select an available time slot.";
    } else if (unavailableSlots.has(timeSlot)) {
      nextErrors.timeSlot =
        "This time slot is already booked for the selected date. Please choose another slot.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const bookingData: BookingFormData = {
      serviceId,
      customerId,
      appointmentDate,
      timeSlot,
      message: message.trim(),
      servicePrice,
      paymentStatus: "unpaid",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("handleSubmit → booking data:", bookingData);
    // TODO: Post bookingData to backend later.

    setSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      console.log("handleSubmit → response:", response);

      if (!response.ok) {
        throw new Error("Failed to submit appointment");
      }

      toast.add({
        title: "Appointment request sent",
        description:
          "Your booking request was submitted successfully. We’ll confirm it shortly.",
        type: "success",
      });
      closeDialog();
      // router.refresh();
    } catch (error) {
      console.error("Failed to submit appointment:", error);
      toast.add({
        title: "Booking failed",
        description:
          "We couldn’t submit your appointment request. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-[#a96f66]"
      >
        <CalendarDays className="size-4" aria-hidden="true" />
        Book Appointment
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label="Close booking dialog"
            onClick={closeDialog}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescriptionId}
            className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-border bg-background shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                  Appointment booking
                </p>
                <h2
                  id={dialogTitleId}
                  className="mt-1 text-lg font-semibold text-foreground"
                >
                  Book {serviceName}
                </h2>
                <p
                  id={dialogDescriptionId}
                  className="mt-1 text-sm text-muted-foreground"
                >
                  Pick a date and time that works for you. We’ll handle the
                  rest.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close dialog"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor={`${dialogTitleId}-appointmentDate`}
                    className={labelClass}
                  >
                    Appointment date
                  </label>
                  <input
                    id={`${dialogTitleId}-appointmentDate`}
                    type="date"
                    min={getTodayDate()}
                    value={appointmentDate}
                    onChange={(event) => {
                      setAppointmentDate(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        appointmentDate: undefined,
                        timeSlot: undefined,
                      }));
                    }}
                    aria-invalid={Boolean(errors.appointmentDate)}
                    className={cn(
                      inputClass,
                      errors.appointmentDate &&
                        "border-danger focus:border-danger focus:ring-danger/20",
                    )}
                  />
                  {errors.appointmentDate ? (
                    <p className="mt-1.5 text-xs text-danger">
                      {errors.appointmentDate}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor={`${dialogTitleId}-timeSlot`}
                    className={labelClass}
                  >
                    Available time slot
                  </label>
                  <div className="relative">
                    <Clock3
                      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <select
                      id={`${dialogTitleId}-timeSlot`}
                      value={timeSlot}
                      onChange={(event) => {
                        setTimeSlot(event.target.value);
                        setErrors((current) => ({
                          ...current,
                          timeSlot: undefined,
                        }));
                      }}
                      aria-invalid={Boolean(errors.timeSlot)}
                      className={cn(
                        inputClass,
                        "appearance-none pr-10 pl-10",
                        errors.timeSlot &&
                          "border-danger focus:border-danger focus:ring-danger/20",
                      )}
                    >
                      <option value="">Select a time slot</option>
                      {timeSlots.map((slot) => {
                        const isBooked = unavailableSlots.has(slot);
                        return (
                          <option key={slot} value={slot} disabled={isBooked}>
                            {isBooked ? `${slot} (Booked)` : slot}
                          </option>
                        );
                      })}
                    </select>
                    <span
                      className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs text-muted-foreground"
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </div>
                  {errors.timeSlot ? (
                    <p className="mt-1.5 text-xs text-danger">
                      {errors.timeSlot}
                    </p>
                  ) : null}
                  {appointmentDate && unavailableSlots.size > 0 ? (
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      Some time slots are already booked for this service on the
                      selected date.
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor={`${dialogTitleId}-message`}
                    className={labelClass}
                  >
                    Additional message{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id={`${dialogTitleId}-message`}
                    rows={4}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Anything we should know before your appointment?"
                    className={cn(inputClass, "resize-y")}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-[#a96f66] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="size-4" aria-hidden="true" />
                    {submitting ? "Submitting..." : "Confirm booking request"}
                  </button>
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

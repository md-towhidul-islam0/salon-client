"use client";

import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type AppointmentStatus = "pending" | "confirmed" | "cancelled";

type AppointmentStatusDropdownProps = {
  appointmentId: string;
  currentStatus: AppointmentStatus | "completed";
  compact?: boolean;
};

const statusOptions: {
  value: AppointmentStatus;
  label: string;
  dotClass: string;
}[] = [
  {
    value: "pending",
    label: "Pending",
    dotClass: "bg-amber-500",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    dotClass: "bg-sky-500",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    dotClass: "bg-rose-500",
  },
];

function getStatusLabel(status: AppointmentStatus | "completed") {
  if (status === "completed") return "Completed";
  return (
    statusOptions.find((option) => option.value === status)?.label ?? "Pending"
  );
}

export default function AppointmentStatusDropdown({
  appointmentId,
  currentStatus,
  compact = false,
}: AppointmentStatusDropdownProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<AppointmentStatus | "completed">(
    currentStatus,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function handleChange(nextStatus: AppointmentStatus) {
    if (loading || nextStatus === status) {
      setOpen(false);
      return;
    }

    const previousStatus = status;
    setStatus(nextStatus);
    setLoading(true);
    setOpen(false);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_API_URL");

      const response = await fetch(`${baseUrl}/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment status");
      }

      toast.add({
        title: "Status updated",
        description: `Appointment status changed to ${nextStatus}.`,
        type: "success",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update appointment status:", error);
      setStatus(previousStatus);
      toast.add({
        title: "Update failed",
        description: "Could not update appointment status. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const activeOption = statusOptions.find((option) => option.value === status);

  return (
    <div className={cn(!compact && "space-y-2")} ref={containerRef}>
      {!compact ? (
        <p className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Change status
        </p>
      ) : null}

      <div className="relative">
        <button
          type="button"
          disabled={loading}
          onClick={() => setOpen((current) => !current)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={cn(
            "inline-flex items-center justify-between gap-2 rounded-xl border border-border bg-background text-sm font-medium text-foreground transition-colors",
            "hover:bg-muted/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
            "disabled:cursor-not-allowed disabled:opacity-60",
            compact ? "h-9 min-w-[138px] px-3" : "h-11 w-full gap-3 px-4",
          )}
        >
          <span className="inline-flex items-center gap-2">
            <span
              className={cn(
                "size-2 rounded-full",
                activeOption?.dotClass ?? "bg-muted-foreground",
              )}
              aria-hidden="true"
            />
            {getStatusLabel(status)}
          </span>
          {loading ? (
            <LoaderCircle
              className="size-4 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          )}
        </button>

        {open ? (
          <div
            role="menu"
            className={cn(
              "absolute z-20 mt-2 overflow-hidden rounded-xl border border-border bg-background p-1 shadow-lg",
              compact ? "right-0 min-w-[160px]" : "w-full",
            )}
          >
            {statusOptions.map((option) => {
              const isActive = option.value === status;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => handleChange(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-accent/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={cn("size-2 rounded-full", option.dotClass)}
                      aria-hidden="true"
                    />
                    {option.label}
                  </span>
                  {isActive ? (
                    <Check className="size-4 text-accent" aria-hidden="true" />
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {!compact ? (
        <p className="text-xs text-muted-foreground">
          Select a status to update this appointment.
        </p>
      ) : null}
    </div>
  );
}

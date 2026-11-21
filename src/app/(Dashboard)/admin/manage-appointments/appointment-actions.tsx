"use client";

import { CheckCircle, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type AppointmentActionsProps = {
  appointmentId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

export default function AppointmentActions({
  appointmentId,
  status,
}: AppointmentActionsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<
    "confirmed" | "cancelled" | null
  >(null);

  const canConfirm = status === "pending";
  const canCancel = status === "pending" || status === "confirmed";

  async function updateStatus(nextStatus: "confirmed" | "cancelled") {
    if (loadingAction) return;
    setLoadingAction(nextStatus);

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
        throw new Error("Failed to update appointment");
      }

      toast.add({
        title:
          nextStatus === "confirmed"
            ? "Appointment confirmed"
            : "Appointment cancelled",
        description:
          nextStatus === "confirmed"
            ? "The appointment request has been confirmed."
            : "The appointment has been cancelled.",
        type: "success",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update appointment:", error);
      toast.add({
        title: "Update failed",
        description: "Could not update the appointment. Please try again.",
        type: "error",
      });
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        aria-label="Confirm appointment"
        disabled={!canConfirm || loadingAction !== null}
        onClick={() => updateStatus("confirmed")}
        className={cn(
          "flex size-8 items-center justify-center rounded-md transition-colors",
          canConfirm
            ? "text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500"
            : "cursor-not-allowed text-muted-foreground/35",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
        title={
          canConfirm
            ? "Confirm appointment"
            : "Only pending appointments can be confirmed"
        }
      >
        {loadingAction === "confirmed" ? (
          <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <CheckCircle className="size-3.5" aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        aria-label="Cancel appointment"
        disabled={!canCancel || loadingAction !== null}
        onClick={() => updateStatus("cancelled")}
        className={cn(
          "flex size-8 items-center justify-center rounded-md transition-colors",
          canCancel
            ? "text-muted-foreground hover:bg-danger-soft hover:text-danger-foreground"
            : "cursor-not-allowed text-muted-foreground/35",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
        title={
          canCancel
            ? "Cancel appointment"
            : "This appointment cannot be cancelled"
        }
      >
        {loadingAction === "cancelled" ? (
          <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <X className="size-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

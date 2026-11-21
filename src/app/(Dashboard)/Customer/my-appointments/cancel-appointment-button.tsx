"use client";

import { LoaderCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type CancelAppointmentButtonProps = {
  appointmentId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

export default function CancelAppointmentButton({
  appointmentId,
  status,
}: CancelAppointmentButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const canCancel = status === "pending";

  async function handleCancel() {
    if (!canCancel || loading) return;

    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_API_URL");

      const response = await fetch(`${baseUrl}/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      toast.add({
        title: "Appointment cancelled",
        description: "Your pending appointment request has been cancelled.",
        type: "success",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.add({
        title: "Cancellation failed",
        description: "Could not cancel this appointment. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={!canCancel || loading}
      title={
        canCancel
          ? "Cancel appointment"
          : "Only pending appointments can be cancelled"
      }
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors",
        canCancel
          ? "border-rose-500/25 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10"
          : "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/50",
        "disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      {loading ? (
        <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <XCircle className="size-3.5" aria-hidden="true" />
      )}
      Cancel
    </button>
  );
}

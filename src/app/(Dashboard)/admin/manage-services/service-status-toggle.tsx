"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ServiceStatus = "active" | "inactive";

type ServiceStatusToggleProps = {
  serviceId: string;
  initialStatus: ServiceStatus;
  serviceName: string;
};

export default function ServiceStatusToggle({
  serviceId,
  initialStatus,
  serviceName,
}: ServiceStatusToggleProps) {
  const [status, setStatus] = useState<ServiceStatus>(initialStatus);
  const [saving, setSaving] = useState(false);

  async function toggleStatus() {
  

    const nextStatus: ServiceStatus =
      status === "active" ? "inactive" : "active";
    const previousStatus = status;

    setStatus(nextStatus);
      console.log(nextStatus);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) {
        throw new Error("Missing NEXT_PUBLIC_API_URL");
      }

      const response = await fetch(`${baseUrl}/services/${serviceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update service status");
      }
    } catch (error) {
      console.error("Service status update failed:", error);
      setStatus(previousStatus);
    } finally {
      setSaving(false);
    }
  }

  const isActive = status === "active";


  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        aria-label={`Set ${serviceName} ${isActive ? "inactive" : "active"}`}
        onClick={toggleStatus}
        disabled={saving}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-70",
          isActive
            ? "border-emerald-500/30 bg-emerald-500"
            : "border-border bg-muted",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-flex size-4 items-center justify-center rounded-full bg-white shadow-sm transition-transform",
            isActive ? "translate-x-6" : "translate-x-1",
          )}
        >
          {saving ? (
            <LoaderCircle className="size-3 animate-spin text-muted-foreground" />
          ) : null}
        </span>
      </button>
      <span
        className={cn(
          "text-xs font-medium",
          isActive ? "text-emerald-600" : "text-muted-foreground",
        )}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
}

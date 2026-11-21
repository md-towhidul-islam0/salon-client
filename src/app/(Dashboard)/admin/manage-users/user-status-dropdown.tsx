"use client";

import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type UserAccountStatus = "active" | "blocked";

type UserStatusDropdownProps = {
  userId: string;
  isBlocked: boolean;
  compact?: boolean;
};

const statusOptions: {
  value: UserAccountStatus;
  label: string;
  dotClass: string;
}[] = [
  { value: "active", label: "Active", dotClass: "bg-emerald-500" },
  { value: "blocked", label: "Blocked", dotClass: "bg-rose-500" },
];

export default function UserStatusDropdown({
  userId,
  isBlocked,
  compact = false,
}: UserStatusDropdownProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<UserAccountStatus>(
    isBlocked ? "blocked" : "active",
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(isBlocked ? "blocked" : "active");
  }, [isBlocked]);

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

  async function handleChange(nextStatus: UserAccountStatus) {
    if (loading || nextStatus === status) {
      setOpen(false);
      return;
    }

    const previousStatus = status;
    const nextIsBlocked = nextStatus === "blocked";
    setStatus(nextStatus);
    setLoading(true);
    setOpen(false);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_API_URL");

      const response = await fetch(`${baseUrl}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBlocked: nextIsBlocked }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      toast.add({
        title: "User status updated",
        description:
          nextStatus === "blocked"
            ? "The user account has been blocked."
            : "The user account has been unblocked.",
        type: "success",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update user status:", error);
      setStatus(previousStatus);
      toast.add({
        title: "Update failed",
        description: "Could not update user status. Please try again.",
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
          Account status
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
            compact ? "h-9 min-w-[124px] px-3" : "h-11 w-full gap-3 px-4",
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
            {activeOption?.label ?? "Active"}
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
              compact ? "right-0 min-w-[150px]" : "w-full",
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
          Choose whether this account can access the platform.
        </p>
      ) : null}
    </div>
  );
}

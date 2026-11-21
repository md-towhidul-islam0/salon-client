"use client";

import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type UserRole = "admin" | "Customer";

type UserRoleDropdownProps = {
  userId: string;
  currentRole: string;
  compact?: boolean;
};

const roleOptions: {
  value: UserRole;
  label: string;
  dotClass: string;
}[] = [
  { value: "admin", label: "Admin", dotClass: "bg-accent" },
  { value: "Customer", label: "Customer", dotClass: "bg-sky-500" },
];

function normalizeRole(role: string): UserRole {
  return role === "admin" ? "admin" : "Customer";
}

export default function UserRoleDropdown({
  userId,
  currentRole,
  compact = false,
}: UserRoleDropdownProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(normalizeRole(currentRole));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(normalizeRole(currentRole));
  }, [currentRole]);

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

  async function handleChange(nextRole: UserRole) {
    if (loading || nextRole === role) {
      setOpen(false);
      return;
    }

    const previousRole = role;
    setRole(nextRole);
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
        body: JSON.stringify({ role: nextRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      toast.add({
        title: "User role updated",
        description:
          nextRole === "admin"
            ? "User has been promoted to admin."
            : "User role has been changed to Customer.",
        type: "success",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update user role:", error);
      setRole(previousRole);
      toast.add({
        title: "Update failed",
        description: "Could not update user role. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const activeOption = roleOptions.find((option) => option.value === role);

  return (
    <div className={cn(!compact && "space-y-2")} ref={containerRef}>
      {!compact ? (
        <p className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          User role
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
            compact ? "h-9 min-w-[132px] px-3" : "h-11 w-full gap-3 px-4",
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
            {activeOption?.label ?? "Customer"}
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
            {roleOptions.map((option) => {
              const isActive = option.value === role;
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
          Change the account role between admin and Customer.
        </p>
      ) : null}
    </div>
  );
}

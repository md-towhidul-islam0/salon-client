import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "accent" | "emerald" | "sky" | "amber" | "rose";

const tones: Record<Tone, { badge: string; blob: string }> = {
  accent: { badge: "bg-accent/10 text-accent", blob: "bg-accent/10" },
  emerald: {
    badge: "bg-emerald-500/10 text-emerald-500",
    blob: "bg-emerald-500/10",
  },
  sky: { badge: "bg-sky-500/10 text-sky-500", blob: "bg-sky-500/10" },
  amber: { badge: "bg-amber-500/10 text-amber-500", blob: "bg-amber-500/10" },
  rose: { badge: "bg-rose-500/10 text-rose-500", blob: "bg-rose-500/10" },
};

export function DashboardPage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
            {actions}
          </div>
        ) : null}
      </div>

      {children}
    </div>
  );
}

export function ActionLink({
  href,
  children,
  variant = "primary",
  icon: Icon,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  icon?: LucideIcon;
}) {
  const styles = {
    primary:
      "bg-accent text-white shadow-sm shadow-accent/25 hover:bg-[#a96f66]",
    outline: "border border-border bg-background hover:bg-muted",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  } as const;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
        styles[variant],
      )}
    >
      {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
      {children}
    </Link>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "accent",
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  trend?: string;
}) {
  const style = tones[tone];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-5">
      <div
        className={cn(
          "pointer-events-none absolute -top-10 -right-10 size-28 rounded-full blur-2xl",
          style.blob,
        )}
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            style.badge,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      {hint || trend ? (
        <p className="relative mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {trend ? (
            <span className={cn("font-semibold", style.badge, "px-1.5 py-0.5")}>
              {trend}
            </span>
          ) : null}
          <span className="truncate">{hint}</span>
        </p>
      ) : null}
    </div>
  );
}

export function DashboardPanel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-background",
        className,
      )}
    >
      <header className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-0.5 break-words text-xs text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function DashboardLoading({
  label = "Loading dashboard",
}: {
  label?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="space-y-2">
        <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-3 w-full max-w-xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="h-36 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="h-64 animate-pulse rounded-2xl bg-muted xl:col-span-2" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

type Status =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"
  | "active"
  | "blocked"
  | "paid"
  | "refunded";

const statusStyles: Record<Status, string> = {
  confirmed: "bg-sky-500/10 text-sky-500 ring-sky-500/20",
  pending: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-500 ring-rose-500/20",
  active: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
  blocked: "bg-rose-500/10 text-rose-500 ring-rose-500/20",
  paid: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
  refunded: "bg-muted text-muted-foreground ring-border",
};

const statusLabels: Record<Status, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
  active: "Active",
  blocked: "Blocked",
  paid: "Paid",
  refunded: "Refunded",
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function TableShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          "w-full min-w-[640px] border-collapse text-left text-sm",
          className,
        )}
      >
        {children}
      </table>
    </div>
  );
}

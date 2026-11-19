"use client";

import { ChevronDown, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";

import ThemeToggle from "./ThemeToggle";

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

type NavBarProps = {
  logo?: string;
  links?: NavItem[];
  actions?: NavItem[];
  dashboardHref?: string;
};

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const defaultLinks: NavItem[] = [
  { label: "Home", href: "/", active: true },
  { label: "Services", href: "/services" },
  { label: "Salon Details", href: "/salon-details" },
];

const defaultActions: NavItem[] = [
  { label: "Sign In", href: "/SignIn" },
  { label: "Sign Up", href: "/SignUp" },
];

// Reusable nav link
export function NavLink({ label, href, active }: NavItem) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-accent ${
        active ? "text-accent" : "text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

// Reusable nav button
export function NavButton({
  label,
  href,
  variant = "outline",
}: NavItem & { variant?: "outline" | "solid" }) {
  const style =
    variant === "solid"
      ? "bg-foreground text-background hover:bg-accent hover:text-white"
      : "border border-border text-foreground hover:bg-muted";

  return (
    <Link
      href={href}
      className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${style}`}
    >
      {label}
    </Link>
  );
}

function Avatar({
  image,
  name,
  large = false,
}: {
  image?: string | null;
  name: string;
  large?: boolean;
}) {
  const size = large ? 40 : 32;
  const dimension = large ? "size-10" : "size-8";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={size}
        height={size}
        unoptimized
        className={`${dimension} shrink-0 rounded-full object-cover ring-2 ring-accent/25`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex ${dimension} shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent ring-2 ring-accent/25`}
    >
      {initials || "HS"}
    </span>
  );
}

function UserMenu({
  user,
  dashboardHref,
}: {
  user: SessionUser;
  dashboardHref: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const name = user.name?.trim() || "Salon member";

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="user-menu"
        aria-label="Open account menu"
        className="flex items-center gap-2 rounded-full border border-border bg-background py-1.5 pr-2 pl-1.5 transition-all hover:border-accent hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Avatar image={user.image} name={name} />
        <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
          {name}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`size-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          id="user-menu"
          role="menu"
          className="dropdown-panel absolute top-full right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-black/10"
        >
          <div className="flex items-center gap-3 bg-muted/50 px-4 py-4">
            <Avatar image={user.image} name={name} large />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email || "Welcome back"}
              </p>
            </div>
          </div>

          <div className="border-t border-border p-2">
            <Link
              href={dashboardHref}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <LayoutDashboard aria-hidden="true" className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-medium">Dashboard</span>
                <span className="block text-[11px] text-muted-foreground">
                  Manage your bookings
                </span>
              </span>
            </Link>
          </div>
          <div className={`rounded-md px-5 py-2 text-sm font-medium transition-colors bg-foreground text-background hover:bg-accent hover:text-white`}>LOgOut</div>
        </div>
      ) : null}
    </div>
  );
}

export default function NavBar({
  logo = "HeairSalon",
  links = defaultLinks,
  actions = defaultActions,
  dashboardHref = "/dashboard",
}: NavBarProps) {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold text-foreground">
          {logo}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isPending ? (
            <output
              className="flex items-center gap-2"
              aria-label="Loading account"
            >
              <span className="size-8 animate-pulse rounded-full bg-muted" />
              <span className="hidden h-3 w-20 animate-pulse rounded-full bg-muted sm:block" />
            </output>
          ) : session ? (
            <UserMenu user={session.user} dashboardHref={dashboardHref} />
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {actions.map((action, index) => (
                <NavButton
                  key={action.href}
                  {...action}
                  variant={index === actions.length - 1 ? "solid" : "outline"}
                />
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

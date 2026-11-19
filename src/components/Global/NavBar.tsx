"use client";

import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

// const defaultLinks: NavItem[] = [
//   { label: "Home", href: "/", active: true },
//   { label: "Services", href: "/services" },
//   { label: "Salon Details", href: "/salon-details" },
//   { label: "Dashboard", href: "/dashboard" },
// ];

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

// Links shared by the mobile menu and the mobile profile dropdown.
function MobileNavLinks({
  links,
  onNavigate,
}: {
  links: NavItem[];
  onNavigate: () => void;
}) {
  return (
    <div className="space-y-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent ${
            link.active ? "bg-accent/10 text-accent" : "text-foreground"
          }`}
        >
          {link.label}
          <ChevronRight aria-hidden="true" className="size-4 opacity-60" />
        </Link>
      ))}
    </div>
  );
}

function UserMenu({
  user,
  links,
  dashboardHref,
}: {
  user: SessionUser;
  links: NavItem[];
  dashboardHref: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const name = user.name?.trim() || "Salon member";
  const mobileLinks = links.filter((link) => link.href !== dashboardHref);

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

  async function handleSignOut() {
    try {
      await authClient.signOut();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Sign out failed", error);
    }
  }

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
        <span className="hidden max-w-28 truncate text-sm font-medium lg:block">
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
          className="dropdown-panel absolute top-full right-0 z-50 mt-3 max-h-[calc(100vh-6rem)] w-64 max-w-[calc(100vw-2rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-border bg-background shadow-xl shadow-black/10"
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

          <div className="border-t border-border p-2 md:hidden">
            <p className="px-3 pt-1 pb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Menu
            </p>
            <MobileNavLinks
              links={mobileLinks}
              onNavigate={() => setOpen(false)}
            />
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

            <button
              type="button"
              onClick={handleSignOut}
              role="menuitem"
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-danger-soft hover:text-danger-foreground focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-transparent group-hover:text-danger">
                <LogOut aria-hidden="true" className="size-4" />
              </span>
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const roleDashboardHref = (role?: string | null) => {
  if (role === "admin") return "/admin";
  if (role) return "/Customer";
  return undefined;
};

export default function NavBar({
  logo = "HeairSalon",
  actions = defaultActions,
  dashboardHref,
}: NavBarProps) {
  const { data: session, isPending } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);
  const resolvedDashboardHref =
    dashboardHref ?? roleDashboardHref(session?.user.role);
  const links: NavItem[] = [
    { label: "Home", href: "/", active: true },
    { label: "Services", href: "/services" },
    { label: "Salon Details", href: "/salon-details" },
    ...(resolvedDashboardHref
      ? [{ label: "Dashboard", href: resolvedDashboardHref }]
      : []),
  ];

  useEffect(() => {
    if (!mobileOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!mobileRef.current?.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20">
        <Link
          href="/"
          aria-label={logo}
          className="text-xl font-bold text-foreground md:text-2xl"
        >
          <span className="text-2xl font-bold">
            Heair<span className="text-[#f7ac9b]">Salon</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {isPending ? (
            <output
              className="flex items-center gap-2"
              aria-label="Loading account"
            >
              <span className="size-8 animate-pulse rounded-full bg-muted" />
              <span className="hidden h-3 w-20 animate-pulse rounded-full bg-muted lg:block" />
            </output>
          ) : session ? (
            <UserMenu
              user={session.user}
              links={links}
              dashboardHref={resolvedDashboardHref ?? "/SignIn"}
            />
          ) : (
            <>
              <div className="hidden items-center gap-2 sm:gap-3 md:flex">
                {actions.map((action, index) => (
                  <NavButton
                    key={action.href}
                    {...action}
                    variant={index === actions.length - 1 ? "solid" : "outline"}
                  />
                ))}
              </div>

              <div ref={mobileRef} className="relative md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileOpen((current) => !current)}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-menu"
                  className="flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {mobileOpen ? (
                    <X aria-hidden="true" className="size-5" />
                  ) : (
                    <Menu aria-hidden="true" className="size-5" />
                  )}
                </button>

                {mobileOpen ? (
                  <div
                    id="mobile-menu"
                    className="dropdown-panel absolute top-full right-0 z-50 mt-3 max-h-[calc(100vh-6rem)] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-border bg-background p-2 shadow-xl shadow-black/10"
                  >
                    <MobileNavLinks
                      links={links}
                      onNavigate={() => setMobileOpen(false)}
                    />
                    <div className="mt-2 grid gap-2 border-t border-border pt-3">
                      {actions.map((action, index) => (
                        <Link
                          key={action.href}
                          href={action.href}
                          onClick={() => setMobileOpen(false)}
                          className={`rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                            index === actions.length - 1
                              ? "bg-foreground text-background hover:bg-accent hover:text-white"
                              : "border border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          {action.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

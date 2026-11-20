"use client";

import {
  ArrowUpRight,
  CalendarDays,
  CirclePlus,
  CreditCard,
  Crown,
  House,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Scissors,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import UserAvatar from "@/components/Global/UserAvatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

const adminNav: NavItem[] = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Manage Services", href: "/admin/manage-services", icon: Scissors },
  {
    title: "Add / Update Service",
    href: "/admin/add-update-service",
    icon: CirclePlus,
  },
  {
    title: "Manage Appointments",
    href: "/admin/manage-appointments",
    icon: CalendarDays,
  },
  { title: "Manage Users", href: "/admin/manage-users", icon: Users },
  { title: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { title: "My Profile", href: "/admin/profile", icon: UserRound },
];

const customerNav: NavItem[] = [
  { title: "Overview", href: "/Customer", icon: LayoutDashboard },
  {
    title: "My Appointments",
    href: "/Customer/my-appointments",
    icon: CalendarDays,
  },
  { title: "My Profile", href: "/Customer/my-profile", icon: UserRound },
];

const skeletonKeys = ["one", "two", "three", "four", "five"];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin" || href === "/Customer") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { isMobile, setOpenMobile } = useSidebar();

  const isAdmin = session?.user.role === "admin";
  const navItems = isAdmin ? adminNav : customerNav;
  const profileHref = isAdmin ? "/admin/profile" : "/Customer/my-profile";
  const roleLabel = isAdmin ? "Administrator" : "Customer";
  const name = session?.user.name?.trim() || "Salon member";

  function closeMobile() {
    if (isMobile) setOpenMobile(false);
  }

  async function handleSignOut() {
    try {
      await authClient.signOut();
      closeMobile();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed", error);
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/70 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-sidebar-accent/60"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/25">
            <Scissors className="size-5" />
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-lg leading-tight font-bold text-sidebar-foreground">
              Heair<span className="text-accent">Salon</span>
            </span>
            <span className="block text-[10px] tracking-[0.2em] text-sidebar-foreground/50 uppercase">
              Beauty &amp; Care
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-[0.16em] uppercase">
            {isAdmin ? "Admin panel" : "Customer dashboard"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {isPending
                ? skeletonKeys.map((key) => (
                    <SidebarMenuSkeleton key={key} showIcon />
                  ))
                : navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} onClick={closeMobile} />}
                        isActive={isActivePath(pathname, item.href)}
                        tooltip={item.title}
                        className="h-10 rounded-xl px-3 data-active:shadow-sm"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-3">
        {isPending ? (
          <div className="flex items-center gap-3 rounded-xl p-1">
            <span className="size-10 animate-pulse rounded-full bg-sidebar-accent" />
            <div className="min-w-0 flex-1 space-y-2 group-data-[collapsible=icon]:hidden">
              <span className="block h-3 w-24 animate-pulse rounded-full bg-sidebar-accent" />
              <span className="block h-2.5 w-32 animate-pulse rounded-full bg-sidebar-accent" />
            </div>
          </div>
        ) : session ? (
          <div className="rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/50 p-3 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
              <UserAvatar
                image={session.user.image}
                name={name}
                size={40}
                className="ring-2 ring-accent/25"
              />
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">
                  {name}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60">
                  {session.user.email}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase">
                  <ShieldCheck className="size-3" />
                  {roleLabel}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 group-data-[collapsible=icon]:hidden">
              <Link
                href={profileHref}
                onClick={closeMobile}
                className="rounded-lg border border-sidebar-border bg-background/60 px-2 py-1.5 text-center text-xs font-medium transition-colors hover:bg-sidebar-accent"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70 transition-colors hover:bg-danger-soft hover:text-danger-foreground"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <Link
            href="/SignIn"
            className="flex items-center justify-center rounded-xl bg-accent px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a96f66]"
          >
            Sign in
          </Link>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

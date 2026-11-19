import {
  CirclePlus,
  Clock,
  Filter,
  Pencil,
  Scissors,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import {
  ActionLink,
  DashboardPage,
  DashboardPanel,
  StatusPill,
  TableShell,
} from "../../component/dashboard-ui";

const categories = ["All", "Hair", "Skin", "Makeup", "Spa", "Grooming"];

const services = [
  {
    name: "Signature Haircut",
    category: "Hair",
    duration: "45 min",
    price: "৳ 800",
    bookings: 62,
    rating: "4.9",
    status: "active" as const,
  },
  {
    name: "Balayage & Gloss",
    category: "Hair",
    duration: "2 hr 30 min",
    price: "৳ 4,200",
    bookings: 37,
    rating: "4.8",
    status: "active" as const,
  },
  {
    name: "Luxury Facial",
    category: "Skin",
    duration: "1 hr",
    price: "৳ 1,600",
    bookings: 41,
    rating: "4.8",
    status: "active" as const,
  },
  {
    name: "Hair Spa & Gloss",
    category: "Spa",
    duration: "1 hr 15 min",
    price: "৳ 1,900",
    bookings: 33,
    rating: "4.7",
    status: "active" as const,
  },
  {
    name: "Bridal Makeover",
    category: "Makeup",
    duration: "3 hr",
    price: "৳ 6,500",
    bookings: 18,
    rating: "5.0",
    status: "active" as const,
  },
  {
    name: "Beard Sculpt & Trim",
    category: "Grooming",
    duration: "30 min",
    price: "৳ 650",
    bookings: 29,
    rating: "4.6",
    status: "active" as const,
  },
  {
    name: "Keratin Repair",
    category: "Hair",
    duration: "2 hr",
    price: "৳ 3,800",
    bookings: 9,
    rating: "4.5",
    status: "pending" as const,
  },
  {
    name: "Scalp Detox Ritual",
    category: "Spa",
    duration: "50 min",
    price: "৳ 1,450",
    bookings: 0,
    rating: "—",
    status: "pending" as const,
  },
];

export default function ManageServicesPage() {
  return (
    <DashboardPage
      eyebrow="Service catalogue"
      title="Manage services"
      description="Keep your treatment menu, pricing, and availability up to date. Changes go live on the website immediately."
      actions={
        <ActionLink href="/admin/add-update-service" icon={CirclePlus}>
          Add service
        </ActionLink>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Live services
          </p>
          <p className="mt-2 text-2xl font-bold">
            {services.filter((service) => service.status === "active").length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Visible to customers
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Avg. rating
          </p>
          <p className="mt-2 flex items-center gap-1 text-2xl font-bold">
            4.8
            <Star
              className="size-4 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Across 229 reviews
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Most booked
          </p>
          <p className="mt-2 truncate text-lg font-bold">Signature Haircut</p>
          <p className="mt-1 text-xs text-muted-foreground">62 bookings</p>
        </div>
      </div>

      <DashboardPanel
        title="All services"
        description="Search, edit, or retire a treatment from the catalogue."
        bodyClassName="p-0"
        action={
          <div className="flex items-center gap-2">
            <label className="relative hidden sm:block">
              <span className="sr-only">Search services</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search services..."
                className="h-8 w-48 rounded-lg border border-border bg-background pr-2.5 pl-8 text-xs outline-none placeholder:text-muted-foreground focus:border-accent"
              />
            </label>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Filter className="size-3.5" aria-hidden="true" />
              Filter
            </button>
          </div>
        }
      >
        <div className="flex flex-wrap gap-1.5 border-b border-border px-5 py-3">
          {categories.map((category, index) => (
            <span
              key={category}
              className={
                index === 0
                  ? "rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-white"
                  : "rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground"
              }
            >
              {category}
            </span>
          ))}
        </div>

        <TableShell>
          <thead>
            <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Bookings</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.name}
                className="border-t border-border transition-colors hover:bg-muted/40"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Scissors className="size-3.5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star
                          className="size-3 fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                        {service.rating}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {service.category}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {service.duration}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-semibold">{service.price}</td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {service.bookings}
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill status={service.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href="/admin/add-update-service"
                      aria-label={`Edit ${service.name}`}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      aria-label={`Delete ${service.name}`}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger-foreground"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </DashboardPanel>
    </DashboardPage>
  );
}

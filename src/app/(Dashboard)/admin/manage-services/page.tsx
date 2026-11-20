import { CirclePlus, Clock, Filter, Scissors, Search } from "lucide-react";

import {
  ActionLink,
  DashboardPage,
  DashboardPanel,
  EmptyState,
  TableShell,
} from "../../component/dashboard-ui";
import DeleteServiceButton from "./delete-service-button";
import ServiceStatusToggle from "./service-status-toggle";
import UpdateServices from "./updateservices";

export const instant = false;

interface Service {
  _id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  durationMinutes: number;
  image?: string;
  status: "active" | "inactive";
  submittedAt?: string;
}

async function getServices(): Promise<Service[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return [];

  try {
    const response = await fetch(`${baseUrl}/services`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function ManageServicesPage() {
  const services = await getServices();

  const activeCount = services.filter(
    (service) => service.status === "active",
  ).length;
  const inactiveCount = services.length - activeCount;
  const categoryFilters = [
    "All",
    ...Array.from(new Set(services.map((service) => service.category))).filter(
      Boolean,
    ),
  ];

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
          <p className="mt-2 text-2xl font-bold">{activeCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Visible to customers
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Inactive services
          </p>
          <p className="mt-2 text-2xl font-bold">{inactiveCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Hidden from booking
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Total services
          </p>
          <p className="mt-2 text-2xl font-bold">{services.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            In your catalogue
          </p>
        </div>
      </div>

      <DashboardPanel
        title="All services"
        description="Search, review, update status, or edit a treatment from the catalogue."
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
          {categoryFilters.map((category, index) => (
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

        {services.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Scissors}
              title="No services found"
              description="Add your first service to start building the catalogue, or check that your services API is reachable."
              action={
                <ActionLink href="/admin/add-update-service" icon={CirclePlus}>
                  Add service
                </ActionLink>
              }
            />
          </div>
        ) : (
          <TableShell>
            <thead>
              <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service._id}
                  className="border-t border-border transition-colors hover:bg-muted/40"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent/10 text-accent">
                        {service.image ? (
                          // biome-ignore lint/performance/noImgElement: remote service image URL
                          <img
                            src={service.image}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <Scissors className="size-4" aria-hidden="true" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{service.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {service.category}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {service.durationMinutes} min
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold whitespace-nowrap">
                    ৳ {service.price}
                  </td>
                  <td className="px-5 py-3.5">
                    <ServiceStatusToggle
                      serviceId={service._id}
                      serviceName={service.name}
                      initialStatus={service.status}
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <UpdateServices service={service} />
                      <DeleteServiceButton
                        serviceId={service._id}
                        serviceName={service.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </DashboardPanel>
    </DashboardPage>
  );
}

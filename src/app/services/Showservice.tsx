import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";

import { getAllservices } from "@/lib/core/Importantfunction";

import ServicesToolbar from "./services-toolbar";

type ServiceItem = {
  _id?: string;
  name?: string;
  category?: string;
  description?: string;
  price?: number;
  durationMinutes?: number;
  image?: string;
  status?: string;
};

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function formatPrice(price: number | undefined) {
  if (typeof price !== "number" || !Number.isFinite(price)) return "৳ 0";
  return `৳ ${price.toLocaleString("en-BD")}`;
}

function formatDuration(minutes: number | undefined) {
  if (
    typeof minutes !== "number" ||
    !Number.isFinite(minutes) ||
    minutes <= 0
  ) {
    return "—";
  }
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
}

const Showservice = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) => {
  const params = await searchParams;
  const currentSearch = getParam(params.search);
  const currentCategory = getParam(params.category) || "All";
  const currentSort = getParam(params.sort);

  const query = new URLSearchParams();
  if (currentSearch.trim()) query.set("search", currentSearch.trim());
  if (currentCategory && currentCategory !== "All") {
    query.set("category", currentCategory);
  }
  if (currentSort) query.set("sort", currentSort);
  const queryString = query.toString();

  const res = await getAllservices(queryString || null);
  const data = await res.json();

  const services: ServiceItem[] = Array.isArray(data) ? data : [];
  const sortedServices = [...services].sort((a, b) => {
    if (currentSort === "price-asc") {
      return (
        (a.price ?? Number.POSITIVE_INFINITY) -
        (b.price ?? Number.POSITIVE_INFINITY)
      );
    }
    if (currentSort === "price-desc") {
      return (
        (b.price ?? Number.NEGATIVE_INFINITY) -
        (a.price ?? Number.NEGATIVE_INFINITY)
      );
    }
    return 0;
  });

  const categories = Array.from(
    new Set(
      services
        .map((service) => service.category?.trim())
        .filter((category): category is string => Boolean(category)),
    ),
  ).sort((a, b) => a.localeCompare(b));
  const activeservices = sortedServices.filter(
    (service) => service.status === "active",
  );

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(900px_360px_at_12%_0%,rgba(196,137,129,0.18),transparent),radial-gradient(700px_280px_at_88%_8%,rgba(196,137,129,0.12),transparent),linear-gradient(to_bottom,rgba(196,137,129,0.04),transparent)]"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-14 md:px-12 md:py-18 lg:px-20">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-accent uppercase">
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            Browse services
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl">
            Find the service that feels right for you
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Take a look through our treatments, from quick refreshes to slow,
            restorative rituals. Choose a category, search by name, and discover
            something that fits your day.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
            <span>
              <strong className="font-semibold text-foreground">
                {activeservices.length}
              </strong>{" "}
              {activeservices.length === 1 ? "service" : "services"} available
            </span>
          </span>
          {currentCategory !== "All" ? (
            <span className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
              Category: {currentCategory.replace(/-/g, " ").replace(/1/g, "&")}
            </span>
          ) : null}
        </div>

        <div className="mt-8">
          <ServicesToolbar
            categories={categories}
            currentSearch={currentSearch}
            currentCategory={currentCategory}
            currentSort={currentSort}
          />
        </div>

        {activeservices.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
            <p className="mt-5 text-lg font-semibold text-foreground">
              No services found
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              We couldn’t find any services for this selection right now. Try
              another category or clear your search to see more.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sortedServices.map((service, index) => {
              const serviceId = service._id ?? `${service.name}-${index}`;
              const detailHref = service._id
                ? `/services/${service._id}`
                : "/services";

              return (
                service.status === "active" && (
                  <article
                    key={serviceId}
                    className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
                      {service.image ? (
                        // biome-ignore lint/performance/noImgElement: remote service image URL
                        <img
                          src={service.image}
                          alt={service.name ?? "Service image"}
                          loading={index < 3 ? "eager" : "lazy"}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(196,137,129,0.28),transparent_45%),linear-gradient(to_bottom_right,var(--muted),var(--background))]">
                          <div className="text-center text-muted-foreground">
                            <Sparkles
                              className="mx-auto size-8 text-accent/70"
                              aria-hidden="true"
                            />
                            <p className="mt-2 text-xs">Photo coming soon</p>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                        <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-foreground uppercase shadow-sm backdrop-blur-sm">
                          {service.category
                            ?.replace(/-/g, " ")
                            .replace(/1/g, "&") || "Service"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold leading-snug tracking-tight text-balance text-foreground">
                            {service.name || "Untitled service"}
                          </h2>
                          <p className="mt-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {service.category
                              ?.replace(/-/g, " ")
                              .replace(/1/g, "&") || "General"}
                          </p>
                        </div>
                        <p className="shrink-0 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-bold text-accent">
                          {formatPrice(service.price)}
                        </p>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {service.description?.trim() ||
                          "A carefully prepared treatment designed to leave you feeling refreshed and cared for."}
                      </p>

                      <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5">
                          <Clock3
                            className="size-4 text-accent"
                            aria-hidden="true"
                          />
                          {formatDuration(service.durationMinutes)}
                        </span>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/70 pt-5">
                        <span className="text-xs text-muted-foreground">
                          Details & booking info
                        </span>
                        <Link
                          href={detailHref}
                          className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-[#a96f66]"
                        >
                          View details
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Showservice;

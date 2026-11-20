"use client";

import {
  ArrowRight,
  Clock3,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export type ServiceItem = {
  _id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  durationMinutes: number;
  image?: string;
  status: "active" | "inactive";
  submittedAt?: string;
};

type ServicesBrowserProps = {
  services: ServiceItem[];
};

type SortOption = "recommended" | "price-asc" | "price-desc";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function formatPrice(price: number) {
  if (!Number.isFinite(price)) return "৳ 0";
  return `৳ ${price.toLocaleString("en-BD")}`;
}

function formatDuration(minutes: number) {
  if (!Number.isFinite(minutes) || minutes <= 0) return "—";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
}

export default function ServicesBrowser({ services }: ServicesBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(services.map((service) => service.category).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
    return ["All", ...unique];
  }, [services]);

  const visibleServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = services.filter((service) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        service.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        category === "All" || service.category === category;
      return matchesQuery && matchesCategory;
    });

    const sorted = [...filtered];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    }

    return sorted;
  }, [services, query, category, sortBy]);

  const hasActiveFilters =
    query.trim().length > 0 || category !== "All" || sortBy !== "recommended";

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setSortBy("recommended");
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-[radial-gradient(1200px_400px_at_10%_-10%,rgba(196,137,129,0.18),transparent),radial-gradient(900px_300px_at_90%_0%,rgba(196,137,129,0.12),transparent)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-14 md:px-12 md:py-18 lg:px-20">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-accent uppercase">
              <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
              Our services
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              A little menu of care, picked for real days
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Browse what we offer, compare prices, and find the treatment that
              fits your time. No sign-in needed — take your time and choose what
              feels right.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4 text-accent" aria-hidden="true" />
              <strong className="font-semibold text-foreground">
                {services.length}
              </strong>{" "}
              {services.length === 1 ? "service" : "services"} available
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
            <span>{visibleServices.length} showing now</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 md:px-12 lg:px-20">
        <div className="rounded-3xl border border-border bg-background/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
            <label className="relative block">
              <span className="sr-only">Search services by name</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by service name..."
                className="h-11 w-full rounded-2xl border border-border bg-background pr-4 pl-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>

            <label className="block">
              <span className="sr-only">Filter by category</span>
              <div className="relative">
                <SlidersHorizontal
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-11 w-full appearance-none rounded-2xl border border-border bg-background pr-10 pl-10 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  {categories.map((option) => (
                    <option key={option} value={option}>
                      {option === "All" ? "All categories" : option}
                    </option>
                  ))}
                </select>
                <span
                  className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs text-muted-foreground"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </div>
            </label>

            <label className="block">
              <span className="sr-only">Sort services by price</span>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
            {categories.map((option) => {
              const isActive = option === category;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-accent text-white shadow-sm shadow-accent/20"
                      : "border border-border bg-background text-muted-foreground hover:border-accent/40 hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              );
            })}
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto text-xs font-medium text-accent underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>

        {visibleServices.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
            <p className="text-base font-semibold text-foreground">
              {services.length === 0
                ? "No services to show just yet"
                : "Nothing matches that combination"}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {services.length === 0
                ? "Our service menu is being refreshed. Please check back soon, or reach out if you’re looking for something specific."
                : "Try a different name, switch the category, or clear the filters to see everything again."}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Show all services
              </button>
            ) : null}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleServices.map((service, index) => (
              <article
                key={service._id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-background transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/50">
                  {service.image ? (
                    // biome-ignore lint/performance/noImgElement: remote service image URL
                    <img
                      src={service.image}
                      alt={service.name}
                      loading={index < 3 ? "eager" : "lazy"}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(196,137,129,0.25),transparent_45%),linear-gradient(to_bottom_right,var(--muted),var(--background))]">
                      <span className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Sparkles className="size-7 text-accent/70" />
                        <span className="text-xs">Photo coming soon</span>
                      </span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-foreground uppercase shadow-sm backdrop-blur-sm">
                    {service.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold leading-snug tracking-tight text-balance">
                      {service.name}
                    </h2>
                    <p className="shrink-0 text-base font-bold text-accent">
                      {formatPrice(service.price)}
                    </p>
                  </div>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {service.description?.trim() ||
                      "A carefully done treatment — ask us if you’d like to know more about what’s included."}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-3.5" aria-hidden="true" />
                      {formatDuration(service.durationMinutes)}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                    <span className="text-xs text-muted-foreground">
                      Available to book
                    </span>
                    <Link
                      href={`/services/${service._id}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-[#a96f66]"
                    >
                      View details
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

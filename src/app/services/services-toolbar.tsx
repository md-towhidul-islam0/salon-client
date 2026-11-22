"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { cn } from "@/lib/utils";

type ServicesToolbarProps = {
  categories: string[];
  currentSearch: string;
  currentCategory: string;
  currentSort: string;
};

const sortOptions = [
  { value: "", label: "Sort by price" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function buildQueryString(params: {
  search: string;
  category: string;
  sort: string;
}) {
  const query = new URLSearchParams();

  const search = params.search.trim();
  if (search) query.set("search", search);
  if (params.category && params.category !== "All") {
    query.set("category", params.category);
  }
  if (params.sort) query.set("sort", params.sort);

  return query.toString();
}

export default function ServicesToolbar({
  categories,
  currentSearch,
  currentCategory,
  currentSort,
}: ServicesToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(currentSearch);

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const categoryOptions = ["All", ...categories];

  function pushParams(next: {
    search: string;
    category: string;
    sort: string;
  }) {
    const queryString = buildQueryString(next);
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    pushParams({
      search: searchValue,
      category: currentCategory,
      sort: currentSort,
    });
  }

  function handleCategoryChange(value: string) {
    pushParams({
      search: searchValue,
      category: value,
      sort: currentSort,
    });
  }

  function handleSortChange(value: string) {
    pushParams({
      search: searchValue,
      category: currentCategory,
      sort: value,
    });
  }

  function clearAll() {
    setSearchValue("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  const hasActiveValues =
    searchValue.trim().length > 0 ||
    (currentCategory && currentCategory !== "All") ||
    currentSort.length > 0;

  return (
    <div className="rounded-[2rem] border border-border/80 bg-background/90 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
        <form onSubmit={handleSearchSubmit} className="relative">
          <label htmlFor="service-search" className="sr-only">
            Search services by name
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="service-search"
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by service name..."
            className="h-12 w-full rounded-2xl border border-border bg-background pr-4 pl-11 text-sm outline-none transition-all placeholder:text-muted-foreground/80 focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
        </form>

        <label className="relative block">
          <span className="sr-only">Filter by category</span>
          <SlidersHorizontal
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <select
            value={
              currentCategory?.replace(/-/g, " ").replace(/1/g, "&") || "All"
            }
            onChange={(event) => handleCategoryChange(event.target.value)}
            className="h-12 w-full appearance-none rounded-2xl border border-border bg-background pr-10 pl-11 text-sm outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10"
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option === "All"
                  ? "All categories"
                  : option.replace(/-/g, " ").replace(/1/g, "&")}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-muted-foreground"
            aria-hidden="true"
          >
            ▾
          </span>
        </label>

        <label className="block">
          <span className="sr-only">Sort by price</span>
          <div className="relative">
            <select
              value={currentSort}
              onChange={(event) => handleSortChange(event.target.value)}
              className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 pr-10 text-sm outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10"
            >
              {sortOptions.map((option) => (
                <option key={option.value || "default"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-muted-foreground"
              aria-hidden="true"
            >
              ▾
            </span>
          </div>
        </label>

        <button
          type="button"
          onClick={clearAll}
          disabled={!hasActiveValues || isPending}
          className={cn(
            "inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-medium transition-colors",
            hasActiveValues
              ? "border border-border bg-background text-foreground hover:bg-muted"
              : "border border-transparent bg-muted/50 text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          <X className="size-4" aria-hidden="true" />
          Clear
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
        <span className="mr-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Quick pick
        </span>
        {categoryOptions.map((option) => {
          const isActive = (currentCategory || "All") === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleCategoryChange(option)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-accent text-white shadow-sm shadow-accent/20"
                  : "border border-border bg-background text-muted-foreground hover:border-accent/40 hover:text-foreground",
              )}
            >
              {option.replace(/-/g, " ").replace(/1/g, "&")}
            </button>
          );
        })}
        {isPending ? (
          <span className="ml-auto text-xs text-muted-foreground">
            Updating...
          </span>
        ) : null}
      </div>
    </div>
  );
}

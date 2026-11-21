import {
  ArrowRight,
  Brush,
  Flower2,
  Hand,
  Leaf,
  Palette,
  Scissors,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type ServiceItem = {
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

type CategoryMeta = {
  name: string;
  description: string;
  icon: typeof Scissors;
  accent: string;
  iconWrap: string;
};

const featuredCategories: CategoryMeta[] = [
  {
    name: "Haircut & Styling",
    description: "Fresh cuts, tidy trims, and styles that sit just right.",
    icon: Scissors,
    accent: "group-hover:text-[#b8746b]",
    iconWrap: "bg-[#f7ecea] text-[#b8746b]",
  },
  {
    name: "Hair Coloring",
    description: "Soft blends, rich tones, and color that feels like you.",
    icon: Palette,
    accent: "group-hover:text-[#b8746b]",
    iconWrap: "bg-[#f6ece7] text-[#b8746b]",
  },
  {
    name: "Hair Treatment",
    description: "Nourishing care to bring back shine, strength, and ease.",
    icon: Sparkles,
    accent: "group-hover:text-[#b8746b]",
    iconWrap: "bg-[#f5eee9] text-[#b8746b]",
  },
  {
    name: "Facial & Skincare",
    description: "Gentle rituals for calm, clean, and glowing skin.",
    icon: Flower2,
    accent: "group-hover:text-[#b8746b]",
    iconWrap: "bg-[#f3eceb] text-[#b8746b]",
  },
  {
    name: "Makeup",
    description: "Everyday polish or a look saved for something special.",
    icon: Brush,
    accent: "group-hover:text-[#b8746b]",
    iconWrap: "bg-[#f7ece8] text-[#b8746b]",
  },
  {
    name: "Manicure & Pedicure",
    description: "Neat details and a little unhurried care for hands and feet.",
    icon: Hand,
    accent: "group-hover:text-[#b8746b]",
    iconWrap: "bg-[#f4ecea] text-[#b8746b]",
  },
  {
    name: "Spa & Massage",
    description: "Slow, soothing treatments when you need to fully switch off.",
    icon: Leaf,
    accent: "group-hover:text-[#b8746b]",
    iconWrap: "bg-[#eef2ec] text-[#7f9a76]",
  },
];

async function getActiveServices(): Promise<ServiceItem[]> {
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
    if (!Array.isArray(data)) return [];

    return data.filter(
      (service): service is ServiceItem =>
        service && typeof service === "object" && service.status === "active",
    );
  } catch {
    return [];
  }
}

function formatCount(count: number) {
  if (count === 1) return "1 service";
  return `${count} services`;
}

export default async function SalonServiceCategories() {
  const services = await getActiveServices();

  const counts = new Map<string, number>();
  for (const service of services) {
    const name = service.category.replace(/-/g, " ").replace(/1/g, "&");
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  const knownNames = new Set(
    featuredCategories.map((category) => category.name),
  );
  const extraCategories = Array.from(counts.keys())
    .filter((name) => !knownNames.has(name))
    .sort((a, b) => a.localeCompare(b))
    .map<CategoryMeta>((name) => ({
      name,
      description: "Explore what we offer in this part of our menu.",
      icon: Sparkles,
      accent: "group-hover:text-[#b8746b]",
      iconWrap: "bg-[#f5ecea] text-[#b8746b]",
    }));

  const categories = [...featuredCategories, ...extraCategories];

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-[linear-gradient(to_bottom,var(--background),rgba(196,137,129,0.05),var(--background))] py-16 sm:py-20">
      <div
        className="pointer-events-none absolute -top-24 right-[-6rem] -z-10 size-72 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-[-4rem] -z-10 size-72 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-accent uppercase">
              <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
              Explore by category
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Find the kind of care you’re in the mood for
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Whether it’s a quick tidy-up or a slow afternoon of pampering,
              start with a category and see what feels right for you today.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-muted"
          >
            See all services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => {
            const count = counts.get(category.name.replace(/-/g, " ").replace(/1/g, "&")) ?? 0;
            const Icon = category.icon;

            return (
              <Link
                key={category.name.replace(/-/g, " ").replace(/1/g, "&")}
                href={`/services?category=${encodeURIComponent(category.name.replace(/\s/g, "-").replace(/&/g, "1"))}`}
                className="group relative flex h-full flex-col rounded-3xl border border-border bg-background/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-2xl",
                      category.iconWrap,
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium",
                      count > 0
                        ? "bg-accent/10 text-accent"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count > 0 ? formatCount(count) : "Coming soon"}
                  </span>
                </div>

                <h3
                  className={cn(
                    "mt-5 text-lg font-semibold tracking-tight text-foreground transition-colors",
                    category.accent,
                  )}
                >
                  {category.name.replace(/-/g, " ").replace(/1/g, "&")}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Explore services
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Not sure where to start?{" "}
          <Link
            href="/services"
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            Browse the full menu
          </Link>{" "}
          and filter by what you need.
        </p>
      </div>
    </section>
  );
}

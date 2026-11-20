import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";

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

async function getFeaturedServices(): Promise<ServiceItem[]> {
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

    return data
      .filter(
        (service): service is ServiceItem =>
          service && typeof service === "object" && service.status === "active",
      )
      .slice(0, 6);
  } catch {
    return [];
  }
}

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

export default async function FeatureService() {
  const services = await getFeaturedServices();

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(700px_220px_at_15%_0%,rgba(196,137,129,0.16),transparent),radial-gradient(600px_200px_at_85%_10%,rgba(196,137,129,0.1),transparent)]"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-accent uppercase">
              <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
              Featured salon services
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              A few favourites our clients keep coming back to
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Thoughtful treatments, done with care — from quick refreshes to
              slower, unhurried rituals. Here are some of the services people
              book most often.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-muted"
          >
            Browse all services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
            <p className="text-base font-semibold text-foreground">
              Featured services are on their way
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              We’re updating our menu right now. In the meantime, you can
              explore everything we offer on the services page.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-[#a96f66]"
            >
              Go to services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
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
                        <Sparkles
                          className="size-7 text-accent/70"
                          aria-hidden="true"
                        />
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
                    <h3 className="text-lg font-semibold leading-snug tracking-tight text-balance">
                      {service.name}
                    </h3>
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
                      Popular pick
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
      </div>
    </section>
  );
}

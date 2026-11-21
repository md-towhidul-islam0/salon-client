import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  Clock3,
  ShieldAlert,
  Sparkles,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Allbookingsfunc,
  Eachservicesfunc,
  getSessionByserver,
} from "@/lib/core/Importantfunction";
import BookingDialog from "./BookingDialog";

type ServiceData = {
  _id?: string;
  name?: string;
  category?: string;
  description?: string;
  price?: number;
  durationMinutes?: number;
  image?: string;
  status?: string;
  message?: string;
  error?: string;
};

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

function formatCategory(category: string | undefined) {
  if (!category) return "";
  return category.replace(/-/g, " ").replace(/1/g, "&");
}

const Eachservice = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const res = await Eachservicesfunc(id);
  const data = await res.json();
  console.log("data", data);

  const service = (data ?? {}) as ServiceData;
  const invalidService =
    !res.ok ||
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    Boolean(service.error) ||
    !service._id;

  if (invalidService) {
    redirect("/SignIn");
  }

  const session = await getSessionByserver();
  const role = session?.user?.role;
  const isAdmin = role === "admin";
  const isActive = service.status === "active";
  const canBook = isActive && !isAdmin;
  const customerId = session?.user?.id ?? "";

  let existingBookings: {
    serviceId?: string;
    appointmentDate?: string;
    timeSlot?: string;
    status?: string;
  }[] = [];
  try {
    const allBookings = await Allbookingsfunc();
    if (Array.isArray(allBookings)) {
      existingBookings = allBookings.filter(
        (booking) =>
          booking &&
          typeof booking === "object" &&
          booking.serviceId === service._id &&
          booking.status !== "cancelled",
      );
    }
  } catch {
    existingBookings = [];
  }

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(900px_340px_at_10%_0%,rgba(196,137,129,0.16),transparent),radial-gradient(700px_260px_at_90%_10%,rgba(196,137,129,0.1),transparent)]"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-12 md:py-14 lg:px-20">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to all services
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <article className="overflow-hidden rounded-[2rem] border border-border bg-background shadow-sm">
            <div className="relative aspect-[16/10] overflow-hidden bg-muted/40 sm:aspect-[16/9]">
              {service.image ? (
                // biome-ignore lint/performance/noImgElement: remote service image URL
                <img
                  src={service.image}
                  alt={service.name ?? "Service image"}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(196,137,129,0.28),transparent_45%),linear-gradient(to_bottom_right,var(--muted),var(--background))]">
                  <div className="text-center text-muted-foreground">
                    <Sparkles
                      className="mx-auto size-10 text-accent/70"
                      aria-hidden="true"
                    />
                    <p className="mt-3 text-sm">Photo coming soon</p>
                  </div>
                </div>
              )}

              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-background/92 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-foreground uppercase shadow-sm backdrop-blur-sm">
                  {formatCategory(service.category) || "Service"}
                </span>
                <span
                  className={
                    isActive
                      ? "rounded-full bg-emerald-50/95 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-emerald-700 uppercase shadow-sm backdrop-blur-sm"
                      : "rounded-full bg-amber-50/95 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-amber-700 uppercase shadow-sm backdrop-blur-sm"
                  }
                >
                  {isActive ? "Active" : "Unavailable"}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-accent uppercase">
                <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
                Service details
              </p>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                {service.name || "Untitled service"}
              </h1>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-4 py-2 text-sm text-muted-foreground">
                  <Tag className="size-4 text-accent" aria-hidden="true" />
                  <span>{formatCategory(service.category) || "General"}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-4 py-2 text-sm text-muted-foreground">
                  <Clock3 className="size-4 text-accent" aria-hidden="true" />
                  <span>{formatDuration(service.durationMinutes)}</span>
                </div>
              </div>

              <div className="mt-8 border-t border-border/70 pt-8">
                <h2 className="text-sm font-semibold tracking-[0.16em] text-foreground uppercase">
                  About this service
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
                  {service.description?.trim() ||
                    "A carefully prepared treatment designed with comfort and attention to detail. Reach out if you’d like to know more before booking."}
                </p>
              </div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-border bg-background p-6 shadow-sm sm:p-7 lg:sticky lg:top-24">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Appointment
            </p>
            <p className="mt-4 text-3xl font-bold tracking-tight text-foreground">
              {formatPrice(service.price)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Estimated duration: {formatDuration(service.durationMinutes)}
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-muted/30 p-4">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock3
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>
                  Please arrive a few minutes early so your appointment can
                  start comfortably on time.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <CalendarDays
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>
                  Choose a time that suits you and we’ll take care of the rest.
                </span>
              </div>
            </div>

            <div className="mt-6">
              {canBook ? (
                <BookingDialog
                  serviceId={service._id ?? id}
                  serviceName={service.name ?? "Service"}
                  servicePrice={
                    typeof service.price === "number" ? service.price : 0
                  }
                  customerId={customerId}
                  existingBookings={existingBookings}
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-muted px-6 text-sm font-semibold text-muted-foreground"
                >
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Book Appointment
                </button>
              )}
            </div>

            {!isActive ? (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <CircleAlert
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <p>
                  This service is currently unavailable, so appointments can’t
                  be booked right now.
                </p>
              </div>
            ) : null}

            {isAdmin ? (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                <ShieldAlert
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <p>
                  Admin accounts can manage services, but customer appointment
                  requests can’t be submitted from an admin account.
                </p>
              </div>
            ) : null}

            {!session?.user && isActive ? (
              <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                You’ll be able to continue with booking as a customer.
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Eachservice;

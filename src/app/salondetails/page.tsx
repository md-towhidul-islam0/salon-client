import {
  ArrowRight,
  Clock3,
  MapPin,
  Phone,
  Scissors,
  Sparkles,
  Star,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import Footer from "@/components/Global/Footer";
import NavBar from "@/components/Global/NavBar";
import { auth } from "@/lib/auth";

const highlights = [
  {
    icon: Scissors,
    title: "Expert Stylists",
    description:
      "Skilled professionals delivering personalized hair, beauty, and grooming services.",
  },
  {
    icon: Sparkles,
    title: "Premium Care",
    description:
      "Quality products and a relaxing environment designed around your comfort.",
  },
  {
    icon: Star,
    title: "Trusted Experience",
    description:
      "A customer-first salon experience with easy booking and attentive service.",
  },
];

const hours = [
  { day: "Saturday - Thursday", time: "10:00 AM - 8:00 PM" },
  { day: "Friday", time: "2:00 PM - 9:00 PM" },
];

export const instant = false;

export default async function SalonDetailsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/SignIn");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      <main className="relative flex-1 overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(217,119,6,0.1),transparent_35%)]"
          aria-hidden="true"
        />

        <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Salon Details
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Where style, care, and confidence come together.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Welcome to SalonBook, your destination for professional beauty
                and grooming services. We combine expert care, premium products,
                and a calming atmosphere to make every visit feel special.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-[#a96f66]"
                >
                  Explore services
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/Customer/my-appointments"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  My appointments
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm"
                    >
                      <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <h2 className="mt-4 text-sm font-semibold text-foreground">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8">
              <div className="rounded-2xl bg-muted/40 p-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Salon information
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  Visit SalonBook
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Book your next appointment and enjoy a premium salon
                  experience tailored to your style.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex gap-4 rounded-2xl border border-border bg-background p-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <MapPin className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Location
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      123 Beauty Avenue, Dhanmondi, Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-2xl border border-border bg-background p-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Clock3 className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Opening hours
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {hours.map((item) => (
                        <div
                          key={item.day}
                          className="flex flex-col gap-0.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span>{item.day}</span>
                          <span className="font-medium text-foreground">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 rounded-2xl border border-border bg-background p-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                    <Phone className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Contact
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      +880 1700-000000
                    </p>
                    <p className="text-sm text-muted-foreground">
                      support@salonbook.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

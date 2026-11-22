import { ArrowRight, Compass, Home, SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Global/Footer";
import NavBar from "@/components/Global/NavBar";

export const metadata: Metadata = {
  title: "Page Not Found | SalonBook",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(217,119,6,0.12),transparent_35%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 text-[8rem] font-black tracking-tighter text-foreground/[0.03] select-none sm:text-[12rem]"
          aria-hidden="true"
        >
          404
        </div>

        <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card/90 p-8 text-center shadow-xl shadow-black/5 backdrop-blur-sm sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/10 text-accent ring-8 ring-accent/5">
            <SearchX className="size-8" aria-hidden="true" />
          </div>

          <p className="mt-6 text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
            404 Error
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            The page you&apos;re looking for doesn&apos;t exist, may have been
            moved, or the URL might be incorrect. Let&apos;s get you back on
            track.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-[#a96f66]"
            >
              <Home className="size-4" aria-hidden="true" />
              Back to home
            </Link>
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Compass className="size-4" aria-hidden="true" />
              Browse services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

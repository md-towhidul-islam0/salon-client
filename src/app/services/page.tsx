import { Suspense } from "react";

import Footer from "@/components/Global/Footer";
import NavBar from "@/components/Global/NavBar";

import Servicerdata from "./Servicerdata";

function ServicesLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-14 md:px-12 lg:px-20">
      <div className="max-w-2xl space-y-3">
        <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
        <div className="h-10 w-72 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
            key={index}
            className="overflow-hidden rounded-3xl border border-border bg-background"
          >
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-3/4 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <Suspense fallback={<ServicesLoading />}>
          <Servicerdata />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

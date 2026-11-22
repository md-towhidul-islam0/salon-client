import { Suspense } from "react";

import Footer from "@/components/Global/Footer";
import NavBar from "@/components/Global/NavBar";
import Banner from "@/components/Home/Banner";
import FeatureService from "@/components/Home/feature_service";
import SalonServiceCategories from "@/components/Home/salon_services";
import Aboutus from "@/components/Global/Aboutus";

export default function Page() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Banner />
        <Suspense
          fallback={
            <section className="mx-auto w-full max-w-7xl px-6 py-16 md:px-12 lg:px-20">
              <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
                    key={index}
                    className="overflow-hidden rounded-3xl border border-border bg-background"
                  >
                    <div className="aspect-[4/3] animate-pulse bg-muted" />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted" />
                      <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
                      <div className="h-3 w-5/6 animate-pulse rounded-full bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          }
        >
          <FeatureService />
        </Suspense>
        <Suspense
          fallback={
            <section className="mx-auto w-full max-w-7xl px-6 py-16 md:px-12 lg:px-20">
              <div className="h-8 w-72 animate-pulse rounded-lg bg-muted" />
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
                    key={index}
                    className="h-44 animate-pulse rounded-3xl border border-border bg-muted/40"
                  />
                ))}
              </div>
            </section>
          }
        >
          <SalonServiceCategories />
          <Aboutus></Aboutus>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

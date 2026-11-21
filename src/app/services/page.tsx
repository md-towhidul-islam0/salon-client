import { Suspense } from "react";

import Footer from "@/components/Global/Footer";
import NavBar from "@/components/Global/NavBar";

import Showservice from "./Showservice";

function ServicesLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-14 md:px-12 md:py-18 lg:px-20">
      <div className="max-w-3xl space-y-4">
        <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
        <div className="h-12 w-full max-w-xl animate-pulse rounded-2xl bg-muted" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-2/3 max-w-lg animate-pulse rounded-full bg-muted" />
      </div>

      <div className="mt-8 h-32 animate-pulse rounded-[2rem] border border-border bg-muted/30" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
            key={index}
            className="overflow-hidden rounded-[2rem] border border-border bg-background"
          >
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="space-y-3 p-6">
              <div className="h-5 w-3/4 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-muted" />
              <div className="mt-6 h-10 w-32 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <Suspense fallback={<ServicesLoading />}>
          <Showservice searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default page;

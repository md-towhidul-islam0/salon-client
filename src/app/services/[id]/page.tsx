import { Suspense } from "react";

import Footer from "@/components/Global/Footer";
import NavBar from "@/components/Global/NavBar";

import Eachservice from "./Eachservice";

function ServiceDetailsLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-14 md:px-12 lg:px-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-background">
          <div className="aspect-[4/3] animate-pulse bg-muted" />
          <div className="space-y-4 p-6 sm:p-8">
            <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
        <div className="h-80 animate-pulse rounded-[2rem] border border-border bg-muted/30" />
      </div>
    </section>
  );
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <Suspense fallback={<ServiceDetailsLoading />}>
          <Eachservice params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default page;

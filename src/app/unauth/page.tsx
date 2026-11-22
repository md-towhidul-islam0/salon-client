import { ArrowRight, LockKeyhole, ShieldAlert } from "lucide-react";
import Link from "next/link";

const UnauthPage = () => {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(15,118,110,0.08),transparent_35%)]"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-xl shadow-black/5 sm:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 ring-8 ring-rose-500/5">
          <ShieldAlert className="size-8" aria-hidden="true" />
        </div>

        <p className="mt-5 text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
          Access restricted
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          You’re not authorized
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          You don&apos;t have permission to access this page. Please sign in
          with the correct account, or return to the home page.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/sign-in"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-[#a96f66]"
          >
            <LockKeyhole className="size-4" aria-hidden="true" />
            Sign in
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Go home
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UnauthPage;

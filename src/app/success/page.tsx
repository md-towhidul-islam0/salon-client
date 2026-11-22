import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  CreditCard,
  Mail,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionByserver } from "@/lib/core/Importantfunction";
import { paymentPost } from "@/lib/core/paymentPost";
import { stripe } from "../../lib/stripe";

type SearchParams = { [key: string]: string | string[] | undefined };
export const instant = false;

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { session_id } = await searchParams;
  const UserSession = await getSessionByserver();
  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const {
    status,
    customer_email,
    payment_intent,
    payment_status,
    metadata,
    amount_total,
    currency,
    line_items,
  } = await stripe.checkout.sessions.retrieve(session_id as string, {
    expand: ["line_items", "payment_intent"],
  });
  console.log(UserSession?.user.email);
  console.log({
    status,
    customer_email,
    payment_intent,
    payment_status,
    metadata,
    amount_total,
    currency,
    line_items,
  });

  if (status === "open") {
    return redirect("/");
  }
  const res = await paymentPost(session_id as string);
  console.log(res);

  if (status === "complete") {
    const amount =
      typeof amount_total === "number"
        ? amount_total
        : Number(amount_total ?? 0);
    const curr = (currency || "BDT").toUpperCase();
    const formattedAmount = Number.isFinite(amount)
      ? curr === "BDT"
        ? `৳ ${amount.toLocaleString("en-BD")}`
        : `${curr} ${amount.toLocaleString()}`
      : "—";
    const email = customer_email || UserSession?.user?.email || "your email";
    const shortSessionId =
      typeof session_id === "string" && session_id.length > 20
        ? `${session_id.slice(0, 12)}...${session_id.slice(-8)}`
        : String(session_id ?? "—");

    return (
      <section
        id="success"
        className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(217,119,6,0.12),transparent_35%)]"
          aria-hidden="true"
        />

        <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-black/5">
          <div className="border-b border-border bg-muted/30 px-6 py-8 text-center sm:px-10 sm:py-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-8 ring-emerald-500/5">
              <BadgeCheck className="size-8" aria-hidden="true" />
            </div>
            <p className="mt-5 text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
              Payment successful
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your booking is confirmed
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              We appreciate your business! A confirmation email will be sent to{" "}
              <span className="font-medium text-foreground">{email}</span>. If
              you have any questions, please email{" "}
              <a
                href="mailto:orders@example.com"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                orders@example.com
              </a>
              .
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ReceiptText className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Payment amount
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {formattedAmount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <CalendarCheck2 className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Payment status
                  </p>
                  <p className="text-lg font-semibold capitalize text-foreground">
                    {payment_status || status}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Confirmation email
                  </p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <CreditCard className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Session reference
                  </p>
                  <p
                    className="truncate font-mono text-sm font-medium text-foreground"
                    title={String(session_id ?? "")}
                  >
                    {shortSessionId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
            <Link
              href="/Customer/my-appointments"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              View appointments
            </Link>
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-[#a96f66]"
            >
              Browse services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">
          Payment status: {status}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not confirm your payment yet. Please check your appointments
          or contact support.
        </p>
        <Link
          href="/Customer/my-appointments"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-sm font-medium text-white"
        >
          Go to appointments
        </Link>
      </div>
    </section>
  );
}

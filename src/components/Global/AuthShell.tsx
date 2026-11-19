import { ArrowLeft, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import salonImage from "../../Image/Banar/Banar03.jpg";

const ratingStars = ["one", "two", "three", "four", "five"];

type AuthShellProps = {

  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -top-40 -left-40 size-[28rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 size-[28rem] rounded-full bg-accent/10 blur-3xl" />

      <Link
        href="/"
        className="fixed top-6 right-1 z-50 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/85 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-md transition-all hover:border-accent hover:text-accent"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <div className="relative hidden w-[46%] shrink-0 lg:block">
        <Image
          src={salonImage}
          alt="A calm, stylish salon interior"
          fill
          priority
          sizes="46vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/25" />
        <div className="absolute top-16 left-16 text-white/90">
          <p className="text-lg font-bold tracking-tight">HeairSalon</p>
          <p className="mt-1 text-xs tracking-[0.25em] uppercase opacity-70">
            Beauty & Care
          </p>
        </div>
        <div className="absolute right-16 bottom-70 left-16 text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase backdrop-blur-md">
            {/* <Sparkles className="size-3" /> */}
            Your beauty sanctuary
          </span>
          <h2 className="mt-5 text-4xl leading-tight font-bold xl:text-5xl">
            A little glow,
            <br />
            goes a long way.
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-white/80">
            Relax, unwind, and let our stylists take care of the rest. Your next
            great salon experience starts right here.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex gap-0.5 text-[#f4c7a1]">
              {ratingStars.map((key) => (
                <Star key={key} className="size-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-white/80">
              <span className="font-semibold text-white">4.9/5</span> from
              2,000+ happy clients
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[54%]">
        <div className="w-full max-w-lg">
          <div className="rounded-3xl border border-border/70 bg-background/75 p-6 shadow-2xl shadow-black/5 backdrop-blur-sm sm:p-9">
            <div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            </div>

            <div className="mt-8">{children}</div>

            <div className="mt-7 border-t border-border/70 pt-5 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            © 2026 HeairSalon. Made for your calm.
          </p>
        </div>
      </div>
    </main>
  );
}

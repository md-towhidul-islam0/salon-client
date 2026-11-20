import {
  ArrowUpRight,
  Clock,
  Heart,
  Mail,
  MapPin,
  Phone,
  Scissors,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const headingClass =
  "text-xs font-semibold tracking-[0.2em] text-[#e9b9ae] uppercase";

const COPYRIGHT_YEAR = 2026;

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Salon Details", href: "/salon-details" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sign In", href: "/SignIn" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5H17V4.6c-.3 0-1.3-.13-2.45-.13-2.43 0-4.1 1.48-4.1 4.2v2.23H7.7V14h2.75v8h3.05z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3V9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.77 7.74L23 22h-6.24l-4.9-6.4L5.9 22H2.8l7.24-8.28L1.5 2h6.4l4.43 5.86L18.9 2zm-1.1 18h1.73L7.36 3.9H5.5L17.8 20z" />
    </svg>
  );
}

const socialLinks: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: <InstagramIcon className="size-4" />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: <FacebookIcon className="size-4" />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    icon: <YoutubeIcon className="size-4" />,
  },
  {
    label: "X",
    href: "https://x.com/",
    icon: <XIcon className="size-4" />,
  },
];

const openingHours = [
  { days: "Monday – Friday", hours: "10:00 AM – 8:00 PM" },
  { days: "Saturday", hours: "9:00 AM – 7:00 PM" },
  { days: "Sunday", hours: "Closed" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#1b1715] text-white/70">
      <div className="pointer-events-none absolute -top-32 left-1/4 size-96 rounded-full bg-[#c48981]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-[#c48981]/10 blur-3xl" />
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#c48981] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-10 sm:px-8 lg:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
             
              <span className="text-2xl font-bold text-white">
                Hair<span className="text-[#e9b9ae]">Salon</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              A modern salon where expert stylists, calm spaces, and premium
              care come together. Book your next look in just a few clicks.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:-translate-y-0.5 hover:border-[#c48981] hover:bg-[#c48981] hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className={headingClass}>Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#e9b9ae]"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className={headingClass}>Get in touch</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-[#e9b9ae]" />
                <a
                  href="tel:+8801712345678"
                  className="transition-colors hover:text-white"
                >
                  +880 1712-345678
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#e9b9ae]" />
                <a
                  href="mailto:hello@HairSalon.com"
                  className="break-all transition-colors hover:text-white"
                >
                  hello@HairSalon.com
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className={headingClass}>Visit us</h3>
            <div className="mt-5 flex items-start gap-3 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#e9b9ae]" />
              <address className="not-italic leading-6 text-white/70">
                House 12, Road 5, Gulshan 1
                <br />
                Dhaka 1212, Bangladesh
              </address>
            </div>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Clock className="size-4 text-[#e9b9ae]" />
                Opening hours
              </p>
              <ul className="mt-3 space-y-2 text-xs">
                {openingHours.map((item) => (
                  <li key={item.days} className="flex justify-between gap-3">
                    <span>{item.days}</span>
                    <span className="text-white/90">{item.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {COPYRIGHT_YEAR} HairSalon. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with
            <Heart className="size-3.5 fill-[#c48981] text-[#c48981]" />
            for beautiful days.
          </p>
          <a
            href="#top"
            className="inline-flex w-fit items-center gap-1.5 transition-colors hover:text-[#e9b9ae]"
          >
            Back to top
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

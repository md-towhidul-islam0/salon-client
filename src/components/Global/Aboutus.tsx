import { Clock, HeartHandshake, Scissors } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Scissors,
    title: "Expert Care",
    description: "Professional stylists dedicated to your perfect look.",
  },
  {
    icon: HeartHandshake,
    title: "Personal Service",
    description: "Treatments tailored to your style and comfort.",
  },
  {
    icon: Clock,
    title: "Easy Booking",
    description: "Simple appointments that fit your schedule.",
  },
];

const Aboutus = () => {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
            About Us
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A salon experience made for comfort and confidence
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            At SalonBook, we believe beauty care should feel relaxing, personal,
            and effortless. From everyday styling to special treatments, our
            team is here to help you look and feel your best.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border bg-muted/30 p-3">
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
              alt="Salon interior with styling chairs and mirrors"
              width={1200}
              height={900}
              className="h-[320px] w-full rounded-2xl object-cover sm:h-[420px]"
            />
          </div>
          <div className="absolute -bottom-4 left-4 rounded-2xl border border-border bg-background px-5 py-4 shadow-lg sm:left-6">
            <p className="text-2xl font-bold text-foreground">10+</p>
            <p className="text-sm text-muted-foreground">Years of experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutus;

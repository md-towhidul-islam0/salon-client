"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import banar01 from "../../Image/Banar/Banar01.jpg";
import banar02 from "../../Image/Banar/Banar02.jpg";
import banar03 from "../../Image/Banar/Banar03.jpg";
import banar04 from "../../Image/Banar/Banar04.jpg";

type Slide = {
  image: typeof banar01;
  tag: string;
  title: string;
  description: string;
};

const slides: Slide[] = [
  {
    image: banar01,
    tag: "Relax · Refresh · Rejuvenate",
    title: "Your Beauty, Our Passion",
    description:
      "Expert hair, skin and spa treatments crafted to leave you feeling confident, relaxed and completely renewed.",
  },
  {
    image: banar02,
    tag: "Style That Speaks For You",
    title: "A New Look Starts Here",
    description:
      "From precision haircuts to stunning colour, our stylists create a look that is uniquely and beautifully you.",
  },
  {
    image: banar03,
    tag: "Care You Can Feel",
    title: "Pampering, Perfectly Done",
    description:
      "Unwind with soothing rituals and premium products, thoughtfully chosen to bring out your best self.",
  },
  {
    image: banar04,
    tag: "Your Moment To Shine",
    title: "Feel Amazing Every Day",
    description:
      "Book your favourite service and let our team take care of the rest in a calm, welcoming space.",
  },
];

export default function Banner() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const goTo = (index: number) =>
    setActive((index + slides.length) % slides.length);
  const slide = slides[active];

  return (
    <section
      aria-label="Featured salon services"
      className="relative isolate h-[520px] w-full overflow-hidden bg-[#1a1512] md:h-[600px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((item, index) => (
        <Image
          key={item.image.src}
          src={item.image}
          alt=""
          fill
          priority={index === 0}
          placeholder="blur"
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      <div
        key={active}
        className="banner-content relative z-10 flex h-full max-w-7xl items-center px-6 md:px-12 lg:px-20"
      >
        <div className="max-w-2xl text-white">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-[#e9b9ae] uppercase">
            <span className="h-px w-8 bg-[#e9b9ae]" />
            {slide.tag}
          </p>
          <h1 className="text-4xl leading-tight font-bold md:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            {slide.description}
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c48981] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-colors hover:bg-[#a96f66]"
          >
            Explore Salon Services
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => goTo(active - 1)}
        aria-label="Previous slide"
        className="absolute top-1/2 left-3 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:left-6"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(active + 1)}
        aria-label="Next slide"
        className="absolute top-1/2 right-3 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:right-6"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((item, index) => (
          <button
            key={item.image.src}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
            className={`h-2 rounded-full transition-all ${
              index === active
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { Button } from "@/components/ui/button";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { whatsAppHref } from "@/lib/whatsapp";

const slides = [
  {
    image: hero1,
    alt: "Premium sedan driving along the Pondicherry seafront at sunrise",
    title: "Your Ride. Your Journey. Your Pondicherry.",
    subtitle:
      "Reliable cab and car rental services from Pondicherry for local rides, airport transfers, sightseeing and outstation travel.",
    cta: "Book Your Cab",
  },
  {
    image: hero2,
    alt: "Car parked on a French Quarter street in White Town, Pondicherry",
    title: "Explore Pondicherry in Comfort",
    subtitle:
      "Discover beaches, White Town, Auroville and nearby destinations with a comfortable private cab.",
    cta: "Plan Your Trip",
  },
  {
    image: hero3,
    alt: "SUV travelling on a South Indian highway at dawn",
    title: "Pondicherry to Anywhere",
    subtitle: "One-way, round-trip and airport transfers across South India.",
    cta: "Get a Quote",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index] ?? slides[0]!;

  return (
    <section className="relative overflow-hidden bg-primary" aria-label="Pondicherry cab booking">
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <img
            key={s.image}
            src={s.image}
            alt={s.alt}
            width={1920}
            height={1088}
            fetchPriority={i === 0 ? "high" : "low"}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b2740]/92 via-[#123b5d]/70 to-[#123b5d]/25" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pb-24 lg:pt-20">
        <div key={index} className="animate-fade-up max-w-xl text-ocean-foreground">
          <p className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            Pondicherry • Puducherry
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-4 text-base text-ocean-foreground/85 sm:text-lg">{slide.subtitle}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-accent px-7 text-accent-foreground hover:bg-accent/90"
            >
              <Link to="/booking">{slide.cta}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/40 bg-white/10 px-7 text-ocean-foreground backdrop-blur hover:bg-white/20 hover:text-ocean-foreground"
            >
              <a href={whatsAppHref()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp Us
              </a>
            </Button>
          </div>
          <div className="mt-8 flex gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((s, i) => (
              <button
                key={s.title}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-10 bg-accent" : "w-4 bg-white/40"}`}
              />
            ))}
          </div>
        </div>

        <div className="lg:pl-4">
          <BookingWidget />
        </div>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Car,
  Clock,
  MapPinned,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "./Section";
import {
  PricingCard,
  RouteCard,
  ServiceCard,
  TestimonialCard,
  VehicleCard,
} from "@/components/cards";
import { services } from "@/data/services";
import { vehicles } from "@/data/vehicles";
import { pricingDisclaimer, pricingTiers } from "@/data/pricing";
import { popularRoutes } from "@/data/routes";
import { places } from "@/data/places";
import { testimonials } from "@/data/testimonials";
import { brand, callHref } from "@/config/brand";
import { whatsAppHref } from "@/lib/whatsapp";
import driverImg from "@/assets/driver.jpg";
import routesBanner from "@/assets/routes-banner.jpg";

export function TrustStrip() {
  const items = [
    { icon: Clock, label: "On-time pickups" },
    { icon: Car, label: "Clean, maintained cars" },
    { icon: ShieldCheck, label: "Professional drivers" },
    { icon: Wallet, label: "Transparent fares" },
  ];
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="size-5 shrink-0 text-aqua" aria-hidden="true" />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhoWeAre() {
  const points = [
    "Pondicherry-based",
    "Professional drivers",
    "Well-maintained vehicles",
    "Customer-focused service",
    "Local travel expertise",
    "Flexible booking",
  ];
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-3xl shadow-card">
          <img
            src={driverImg}
            alt="Professional chauffeur standing beside a clean sedan in Pondicherry"
            loading="lazy"
            width={1200}
            height={900}
            className="size-full object-cover"
          />
        </div>
        <div>
          <SectionHeading
            align="left"
            eyebrow="Who We Are"
            title="Travel across Pondicherry with people who know the roads"
          />
          <p className="mt-4 text-base text-muted-foreground">
            We are a {brand.city}-based travel and cab service focused on making every journey
            comfortable, dependable and stress-free. From quick local rides to airport transfers,
            sightseeing and long-distance journeys, we connect travellers with reliable vehicles and
            professional service.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-medium">
                <BadgeCheck className="size-4 text-accent" aria-hidden="true" /> {p}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-7 rounded-full px-6">
            <Link to="/about">More about us</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

export function ServicesGrid() {
  return (
    <Section tone="soft" id="services">
      <SectionHeading
        eyebrow="What We Do"
        title="Cab services built around your journey"
        description="Pick a service and we will take care of the vehicle, the driver and the route."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>
    </Section>
  );
}

export function WhyChooseUs() {
  const cards = [
    {
      icon: ShieldCheck,
      title: "Reliable Service",
      text: "We focus on dependable pickups and smooth journeys.",
    },
    {
      icon: Car,
      title: "Comfortable Cars",
      text: "Clean and well-maintained vehicles for every trip.",
    },
    {
      icon: Smile,
      title: "Professional Drivers",
      text: "Experienced drivers focused on safe and courteous travel.",
    },
    {
      icon: Wallet,
      title: "Transparent Booking",
      text: "Clear trip information before you confirm.",
    },
    {
      icon: MapPinned,
      title: "Local Expertise",
      text: "Pondicherry-based, with knowledge of local and regional routes.",
    },
    {
      icon: Sparkles,
      title: "Easy Booking",
      text: "Book online, call us or send a message on WhatsApp.",
    },
  ];
  return (
    <Section>
      <SectionHeading eyebrow="Why Choose Us" title="Travel With Confidence" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-card"
          >
            <Icon className="size-7 text-aqua" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function PricingSection() {
  return (
    <Section tone="soft" id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple & Transparent Pricing"
        description="Indicative starting rates. Share your route and we will confirm the exact fare."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pricingTiers.map((t) => (
          <PricingCard key={t.id} tier={t} />
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-muted-foreground">
        {pricingDisclaimer}
      </p>
    </Section>
  );
}

export function FleetSection() {
  return (
    <Section id="cars">
      <SectionHeading
        eyebrow="Our Fleet"
        title="Choose Your Ride"
        description="From compact sedans to group-friendly tempo travellers."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </Section>
  );
}

export function DiscoverPondicherry() {
  return (
    <Section tone="soft">
      <SectionHeading
        eyebrow="Discover Pondicherry"
        title="Places we drive travellers to every week"
        description="We handle the driving, parking and waiting time so you can enjoy the day."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {places.map((p) => (
          <article
            key={p.id}
            className="group overflow-hidden rounded-3xl border border-border bg-card"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={1200}
                height={900}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="text-base font-semibold">{p.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button asChild size="lg" className="rounded-full px-7">
          <Link to="/booking" search={{ service: "sightseeing", tripType: "LOCAL" }}>
            Book a Sightseeing Cab
          </Link>
        </Button>
      </div>
    </Section>
  );
}

export function PopularRoutesSection() {
  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Popular Routes"
            title="Outstation trips from Pondicherry"
            description="One-way and round-trip options on the routes travellers ask for most."
          />
          <div className="mt-6 overflow-hidden rounded-3xl shadow-card">
            <img
              src={routesBanner}
              alt="Coastal highway near Pondicherry at dusk"
              loading="lazy"
              width={1600}
              height={900}
              className="size-full object-cover"
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {popularRoutes.map((r) => (
            <RouteCard key={r.id} route={r} />
          ))}
        </div>
      </div>
    </Section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tell Us Your Trip",
      text: "Enter pickup, destination, date and travel requirements.",
    },
    { n: "02", title: "Choose Your Ride", text: "Select the vehicle that fits your journey." },
    {
      n: "03",
      title: "Confirm & Travel",
      text: "Receive booking confirmation and enjoy the journey.",
    },
  ];
  return (
    <Section tone="soft">
      <SectionHeading eyebrow="How Booking Works" title="Three simple steps" />
      <ol className="relative mt-10 grid gap-6 lg:grid-cols-3">
        <span
          className="absolute left-0 right-0 top-11 hidden h-px bg-border lg:block"
          aria-hidden="true"
        />
        {steps.map((s) => (
          <li key={s.n} className="relative rounded-3xl border border-border bg-card p-6">
            <span className="gradient-hero inline-flex size-11 items-center justify-center rounded-2xl text-sm font-bold text-ocean-foreground">
              {s.n}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function TestimonialsSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Testimonials"
        title="What travellers say"
        description="Placeholder reviews shown until verified customer feedback is added."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>
    </Section>
  );
}

export function FinalCTA() {
  return (
    <section className="gradient-hero py-16 text-ocean-foreground sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">Need a cab in {brand.city}?</h2>
        <p className="mt-3 text-base text-ocean-foreground/85">
          Book it quickly, travel comfortably, and let us handle the journey.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-background px-7 text-primary hover:bg-background/90"
          >
            <Link to="/booking">Book a Cab</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-white/40 bg-white/10 px-7 text-ocean-foreground hover:bg-white/20 hover:text-ocean-foreground"
          >
            <a href={whatsAppHref()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp Us
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 rounded-full px-7 text-ocean-foreground hover:bg-white/15 hover:text-ocean-foreground"
          >
            <a href={callHref}>
              <Phone className="size-4" aria-hidden="true" /> {brand.phoneDisplay}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

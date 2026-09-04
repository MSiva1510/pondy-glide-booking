import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Camera,
  Car,
  KeyRound,
  MoveRight,
  Plane,
  Repeat,
  Route as RouteIcon,
  Snowflake,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceItem } from "@/data/services";
import { serviceToTripType } from "@/data/services";
import type { PopularRoute } from "@/data/routes";
import type { PricingTier } from "@/data/pricing";
import type { Testimonial } from "@/data/testimonials";
import type { Vehicle } from "@/types";

const iconMap = { Car, Plane, MoveRight, Repeat, Route: RouteIcon, Camera, KeyRound, Briefcase };

export function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = iconMap[service.icon as keyof typeof iconMap] ?? Car;
  return (
    <article className="group flex flex-col rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{service.description}</p>
      <Link
        to="/booking"
        search={{ service: service.slug, tripType: serviceToTripType[service.slug] }}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-aqua"
      >
        Book Now <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="aspect-[3/2] overflow-hidden bg-surface">
        <img
          src={vehicle.image}
          alt={`${vehicle.name} — ${vehicle.category}`}
          loading="lazy"
          width={1200}
          height={800}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{vehicle.name}</h3>
            <p className="text-xs text-muted-foreground">{vehicle.category}</p>
          </div>
          <p className="text-right text-sm font-bold text-primary">
            ₹{vehicle.basePricePerKm}
            <span className="block text-[10px] font-medium text-muted-foreground">
              starting / km
            </span>
          </p>
        </div>
        <ul className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <li className="flex items-center gap-1">
            <Users className="size-3.5" aria-hidden="true" /> {vehicle.passengers} passengers
          </li>
          <li className="flex items-center gap-1">
            <Briefcase className="size-3.5" aria-hidden="true" /> {vehicle.luggage} bags
          </li>
          {vehicle.ac ? (
            <li className="flex items-center gap-1">
              <Snowflake className="size-3.5" aria-hidden="true" /> AC
            </li>
          ) : null}
          <li>{vehicle.transmission}</li>
        </ul>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {vehicle.features.map((f) => (
            <li
              key={f}
              className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Availability depends on date and booking request.
        </p>
        <Button asChild className="mt-4 w-full rounded-xl">
          <Link to="/booking" search={{ vehicle: vehicle.id }}>
            Book Now
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <article className="flex flex-col rounded-3xl border border-border bg-card p-6 transition-all hover:shadow-card">
      <h3 className="text-lg font-semibold">{tier.title}</h3>
      <p className="text-xs text-muted-foreground">{tier.subtitle}</p>
      <p className="mt-4 text-3xl font-bold text-primary">{tier.price}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {tier.unit}
      </p>
      <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
        {tier.includes.map((i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {i}
          </li>
        ))}
      </ul>
      <Button asChild variant="outline" className="mt-5 rounded-xl">
        <Link to="/booking">Get Exact Fare</Link>
      </Button>
    </article>
  );
}

export function RouteCard({ route }: { route: PopularRoute }) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-aqua hover:shadow-card">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold">
          {route.from} → {route.to}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          ~{route.distanceKm} km · {route.approxHours} · {route.types.join(" / ")}
        </p>
        {route.fare ? (
          <p className="mt-1 text-xs font-bold text-primary">
            From ₹{route.fare.toLocaleString("en-IN")}
            <span className="font-medium text-muted-foreground"> · one way</span>
          </p>
        ) : null}
      </div>
      <Button asChild size="sm" variant="secondary" className="shrink-0 rounded-full">
        <Link
          to="/booking"
          search={{
            pickup: route.from,
            drop: route.to,
            tripType: route.types.includes("One Way") ? "ONE_WAY" : "ROUND_TRIP",
          }}
        >
          Book Now
        </Link>
      </Button>
    </article>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="rounded-3xl border border-border bg-card p-6">
      <blockquote className="text-sm leading-relaxed text-foreground">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-4 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">— {testimonial.name}</span>
        <span className="block">{testimonial.trip}</span>
      </figcaption>
    </figure>
  );
}

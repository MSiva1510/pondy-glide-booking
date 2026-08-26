import { Link } from "@tanstack/react-router";
import { Clock, Info, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/sections/Section";
import {
  outstationFares,
  pricingNotes,
  sightseeingPackages,
  sightseeingPlaces,
  specialTrips,
} from "@/data/pricing";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function SightseeingPackagesSection() {
  return (
    <Section tone="soft" id="sightseeing">
      <SectionHeading
        eyebrow="Local Sightseeing"
        title="Pondicherry city tour packages"
        description="Hourly packages with a dedicated driver for local sightseeing and city tours."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {sightseeingPackages.map((p) => (
          <article
            key={p.vehicle}
            className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{p.vehicle}</h3>
                <p className="text-xs text-muted-foreground">{p.seats}</p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-primary">
                City Tour
              </span>
            </div>
            <ul className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border">
              {p.tiers.map((t) => (
                <li
                  key={t.hours}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                    {t.hours}
                  </span>
                  <span className="font-bold text-primary">{inr(t.price)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Additional hours {inr(p.extraHour)} per hour · Driver bata ₹300 per day · Parking,
              driver food and permit charges extra.
            </p>
            <Button asChild className="mt-5 w-full rounded-xl">
              <Link to="/booking" search={{ service: "sightseeing", tripType: "LOCAL" }}>
                Book {p.vehicle}
              </Link>
            </Button>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <MapPin className="size-4 text-aqua" aria-hidden="true" />
          Places covered in the local sightseeing tour
        </h3>
        <ol className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
          {sightseeingPlaces.map((place, i) => (
            <li key={place} className="flex gap-2">
              <span className="font-semibold text-primary">{i + 1}.</span>
              <span>{place}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export function SpecialTripsSection() {
  return (
    <Section id="special-trips">
      <SectionHeading
        eyebrow="Popular Packages"
        title="Day trips & airport transfers"
        description="Fixed-price packages for the trips our travellers book most often."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {specialTrips.map((t) => (
          <article
            key={t.title}
            className="flex flex-col rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-card"
          >
            <Sparkles className="size-6 text-aqua" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold">{t.title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{t.detail}</p>
            <p className="mt-4 text-2xl font-bold text-primary">{inr(t.price)}</p>
            {t.note ? <p className="mt-1 text-xs text-muted-foreground">{t.note}</p> : null}
          </article>
        ))}
      </div>
    </Section>
  );
}

export function OutstationFaresSection() {
  return (
    <Section tone="soft" id="outstation-fares">
      <SectionHeading
        eyebrow="Outstation"
        title="Pondicherry outstation drop fares"
        description="Drop or pickup with 3 hours free waiting for the return. Rates shown are for the Swift Dzire (4+1)."
      />
      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {outstationFares.map((f) => (
            <li
              key={f.to}
              className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm transition-colors hover:bg-secondary/60"
            >
              <span className="min-w-0 truncate">
                <span className="text-muted-foreground">Pondicherry → </span>
                <span className="font-medium">{f.to}</span>
              </span>
              <span className="shrink-0 font-bold text-primary">{inr(f.fare)}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mx-auto mt-6 max-w-4xl text-center text-xs text-muted-foreground">
        Extra waiting ₹150 per hour · Kia Carens and Toyota Innova ₹1,500 above these rates.
      </p>
      <div className="mt-8 text-center">
        <Button asChild size="lg" className="rounded-full px-7">
          <Link to="/booking" search={{ tripType: "ONE_WAY" }}>
            Book an Outstation Trip
          </Link>
        </Button>
      </div>
    </Section>
  );
}

export function PricingNotesSection() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <Info className="size-4 text-aqua" aria-hidden="true" />
          Important notes
        </h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {pricingNotes.map((n) => (
            <li key={n} className="flex items-start gap-2">
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                aria-hidden="true"
              />
              {n}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

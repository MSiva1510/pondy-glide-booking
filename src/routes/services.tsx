import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Car, Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/sections/Section";
import { iconMap } from "@/components/cards";
import { FinalCTA, HowItWorks } from "@/components/sections/HomeSections";
import { services, serviceToTripType, type ServiceItem } from "@/data/services";
import { vehicles } from "@/data/vehicles";
import { brand } from "@/config/brand";

const title = `Cab & Travel Services in ${brand.city}`;
const description =
  "Local cabs, airport transfers, one way and round trip taxis, outstation travel, sightseeing, car rental and corporate travel from Pondicherry.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${brand.siteUrl}/services` }],
  }),
  component: ServicesPage,
});

function ServiceDetail({ service, index }: { service: ServiceItem; index: number }) {
  const Icon = iconMap[service.icon as keyof typeof iconMap] ?? Car;
  const flipped = index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");
  return (
    <article
      id={service.slug}
      className="grid scroll-mt-24 gap-6 rounded-3xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10"
    >
      <div className={flipped ? "lg:order-2" : ""}>
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Icon className="size-7" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-aqua">
              Service {num}
            </p>
            <h2 className="mt-1 text-2xl font-bold">{service.title}</h2>
          </div>
        </div>
        <p className="mt-4 leading-relaxed text-muted-foreground">{service.tagline}</p>
        <p className="mt-4 text-sm font-bold text-primary">{service.priceHint}</p>
        <Link
          to="/booking"
          search={{ service: service.slug, tripType: serviceToTripType[service.slug] }}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Book {service.title} <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className={`space-y-3 lg:self-center ${flipped ? "lg:order-1" : ""}`}>
        {service.highlights.map((h) => (
          <li key={h} className="flex items-start gap-3 text-sm">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Check className="size-3.5" aria-hidden="true" />
            </span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Every kind of journey from Pondicherry"
        description="Six services, one promise — a clean car, a professional driver and a fare agreed upfront. Jump to a service or read the details below."
      />
      <Section>
        <nav aria-label="Services" className="flex flex-wrap justify-center gap-2">
          {services.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-aqua hover:text-primary"
            >
              {s.title}
            </a>
          ))}
        </nav>
        <div className="mt-10 grid gap-6">
          {services.map((s, i) => (
            <ServiceDetail key={s.slug} service={s} index={i} />
          ))}
        </div>
      </Section>
      <Section tone="soft">
        <SectionHeading
          eyebrow="The Fleet"
          title="Paired with the right car"
          description="Every service runs on clean, well-maintained vehicles — pick the size that fits your group."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {vehicles.map((v) => (
            <Link
              key={v.id}
              to="/cars"
              className="group flex items-center gap-4 rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Car className="size-6" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold">{v.name}</span>
                <span className="block text-xs text-muted-foreground">{v.category}</span>
                <span className="mt-0.5 block text-xs font-bold text-primary">
                  ₹{v.basePricePerKm}/km →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <HowItWorks />
      <FinalCTA />
    </>
  );
}

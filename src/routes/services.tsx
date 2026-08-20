import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/sections/Section";
import { ServiceCard } from "@/components/cards";
import { FinalCTA, HowItWorks } from "@/components/sections/HomeSections";
import { services } from "@/data/services";
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
    ],
    links: [{ rel: "canonical", href: `${brand.siteUrl}/services` }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Every kind of journey from Pondicherry"
        description="Choose the service that fits your trip — we handle the vehicle, driver and route."
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </Section>
      <HowItWorks />
      <FinalCTA />
    </>
  );
}
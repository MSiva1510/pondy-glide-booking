import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/sections/Section";
import { PricingCard } from "@/components/cards";
import { FinalCTA } from "@/components/sections/HomeSections";
import {
  OutstationFaresSection,
  PricingNotesSection,
  SightseeingPackagesSection,
  SpecialTripsSection,
} from "@/components/sections/PricingSections";
import { pricingDisclaimer, pricingTiers } from "@/data/pricing";
import { brand } from "@/config/brand";

const title = `Taxi Fare & Car Rental Pricing in ${brand.city}`;
const description =
  "Transparent rates for Pondicherry local sightseeing packages, day rentals, Chennai airport transfers and outstation drops in a Swift Dzire, Kia Carens or Toyota Innova.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${brand.siteUrl}/pricing` }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple & Transparent Pricing"
        description="Real rates for sightseeing packages, day rentals, airport transfers and outstation drops — confirmed before you travel."
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((t) => (
            <PricingCard key={t.id} tier={t} />
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-muted-foreground">
          {pricingDisclaimer}
        </p>
      </Section>
      <SightseeingPackagesSection />
      <SpecialTripsSection />
      <OutstationFaresSection />
      <PricingNotesSection />
      <FinalCTA />
    </>
  );
}

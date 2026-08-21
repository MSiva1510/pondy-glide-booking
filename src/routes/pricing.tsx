import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/sections/Section";
import { PricingCard } from "@/components/cards";
import { FinalCTA, PopularRoutesSection } from "@/components/sections/HomeSections";
import { pricingDisclaimer, pricingTiers } from "@/data/pricing";
import { brand } from "@/config/brand";

const title = `Taxi Fare & Car Rental Pricing in ${brand.city}`;
const description =
  "Transparent starting rates for Pondicherry local rentals, sedans, SUVs, Innova, Crysta and Tempo Traveller. Get an exact fare for your route.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
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
        description="Indicative starting rates — share your route and we confirm the exact fare before travel."
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((t) => (
            <PricingCard key={t.id} tier={t} />
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-muted-foreground">{pricingDisclaimer}</p>
      </Section>
      <PopularRoutesSection />
      <FinalCTA />
    </>
  );
}

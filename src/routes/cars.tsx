import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/sections/Section";
import { VehicleCard } from "@/components/cards";
import { FinalCTA } from "@/components/sections/HomeSections";
import { vehicles } from "@/data/vehicles";
import { brand } from "@/config/brand";

const title = `Cars & Fleet | ${brand.city} Car Rental with Driver`;
const description =
  "Swift Dzire (4+1), Kia Carens (6+1) and Toyota Innova (7 seater) for Pondicherry local trips, sightseeing, airport transfers and outstation journeys.";

export const Route = createFileRoute("/cars")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${brand.siteUrl}/cars` }],
  }),
  component: CarsPage,
});

function CarsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Fleet"
        title="Choose Your Ride"
        description="Clean, air-conditioned vehicles with professional drivers. Availability depends on date and booking request."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </Section>
      <FinalCTA />
    </>
  );
}

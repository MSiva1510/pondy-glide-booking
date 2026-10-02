import { createFileRoute } from "@tanstack/react-router";
import { HeroSlider } from "@/components/sections/HeroSlider";
import {
  DiscoverPondicherry,
  FinalCTA,
  FleetSection,
  HowItWorks,
  PopularRoutesSection,
  PricingSection,
  ServicesGrid,
  TestimonialsSection,
  TrustStrip,
  WhoWeAre,
  WhyChooseUs,
} from "@/components/sections/HomeSections";
import { brand } from "@/config/brand";

const title = `${brand.city} Cab Service, Taxi & Car Rental Booking`;
const description =
  "Book a Pondicherry cab online — local taxi, Chennai airport transfers, one way and round trip outstation cabs, sightseeing and car rental with driver.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: brand.siteUrl }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSlider />
      <TrustStrip />
      <WhoWeAre />
      <ServicesGrid />
      <WhyChooseUs />
      <PricingSection />
      <FleetSection />
      <DiscoverPondicherry />
      <PopularRoutesSection />
      <HowItWorks />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}

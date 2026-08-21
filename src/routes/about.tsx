import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/sections/Section";
import { FinalCTA, FleetSection, WhyChooseUs } from "@/components/sections/HomeSections";
import driverImg from "@/assets/driver.jpg";
import frenchQuarter from "@/assets/pondy-frenchquarter.jpg";
import { brand } from "@/config/brand";

const title = `About Us | ${brand.city} Cab & Travel Service`;
const description =
  "A Pondicherry-based cab and car rental service focused on safe, comfortable and dependable travel for local, airport and outstation journeys.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${brand.siteUrl}/about` }],
  }),
  component: AboutPage,
});

const promises = [
  { title: "Safety", text: "Well-maintained vehicles and drivers who take road safety seriously." },
  { title: "Comfort", text: "Clean, air-conditioned cabs suited to the length of your journey." },
  { title: "Reliability", text: "Confirmed pickups and clear communication before every trip." },
  { title: "Transparency", text: "Trip details and fare shared before you travel — no surprises." },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Your Journey Starts Here"
        description={`Travel and cab services based in ${brand.city}, built around comfort, dependability and local knowledge.`}
      />

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading align="left" eyebrow="Who We Are" title="A Pondicherry travel service, not a call-centre" />
            <p className="mt-4 text-muted-foreground">
              We are a {brand.city}-based travel and cab service focused on making every journey comfortable,
              dependable and stress-free. From quick local rides to airport transfers, sightseeing and
              long-distance journeys, we connect travellers with reliable vehicles and professional service.
            </p>
            <p className="mt-4 text-muted-foreground">
              Every trip request is reviewed by our operations team, who assign the right vehicle and driver
              for your route before confirming your booking.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-card">
            <img src={driverImg} alt="Driver beside a clean cab in Pondicherry" loading="lazy" width={1200} height={900} className="size-full object-cover" />
          </div>
        </div>
      </Section>

      <Section tone="soft">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="mt-3 text-muted-foreground">
              To make road travel in and around Pondicherry simple and predictable — a clear booking process,
              a suitable vehicle and a driver who knows the route.
            </p>
            <h2 className="mt-8 text-2xl font-bold">Our Approach to Customer Service</h2>
            <p className="mt-3 text-muted-foreground">
              You can reach us by phone or WhatsApp at any stage of your booking. We confirm details in writing,
              share driver information before pickup and stay reachable through the trip.
            </p>
            <h2 className="mt-8 text-2xl font-bold">Why Pondicherry Travellers Choose Us</h2>
            <p className="mt-3 text-muted-foreground">
              Local knowledge matters — from the best time to leave for Chennai Airport to where a cab can wait
              near White Town. That experience is what we bring to each journey.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Our Service Promise</h2>
            <ul className="mt-4 space-y-4">
              {promises.map((p) => (
                <li key={p.title} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold">{p.title}</span>
                    <span className="text-sm text-muted-foreground">{p.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 overflow-hidden rounded-3xl shadow-card">
              <img src={frenchQuarter} alt="French colonial architecture in Pondicherry" loading="lazy" width={1200} height={900} className="size-full object-cover" />
            </div>
          </div>
        </div>
      </Section>

      <FleetSection />
      <WhyChooseUs />
      <FinalCTA />
    </>
  );
}

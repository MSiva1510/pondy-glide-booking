import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/sections/Section";
import { brand } from "@/config/brand";

const title = `Terms & Conditions | ${brand.brandName}`;
const description = `Booking, fare and cancellation terms for ${brand.brandName} cab and car rental services in ${brand.city}.`;

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${brand.siteUrl}/terms` }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <Section>
        <div className="max-w-3xl space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            These terms apply to bookings made through this website. Please review and adjust them
            with your own legal wording before publishing.
          </p>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Booking requests</h2>
            <p className="mt-2">
              Submitting the booking form creates a trip request, not a confirmed booking. A booking
              is confirmed only after our team contacts you and confirms vehicle availability and
              fare.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Fares</h2>
            <p className="mt-2">
              Prices shown on the website are indicative starting rates. Final fare may vary
              depending on route, distance, waiting time, tolls, parking, permits and trip
              requirements.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Cancellations</h2>
            <p className="mt-2">
              Please inform us as early as possible if your plans change. Cancellation terms for
              confirmed trips will be communicated at the time of confirmation.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p className="mt-2">Questions about these terms: {brand.phoneDisplay}.</p>
          </div>
        </div>
      </Section>
    </>
  );
}

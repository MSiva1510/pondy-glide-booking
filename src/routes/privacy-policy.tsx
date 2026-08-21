import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/sections/Section";
import { brand } from "@/config/brand";

const title = `Privacy Policy | ${brand.brandName}`;
const description = `How ${brand.brandName} collects and uses the information you share when booking a cab in ${brand.city}.`;

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${brand.siteUrl}/privacy-policy` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Section>
        <div className="max-w-3xl space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            This policy explains what information {brand.brandName} collects through this website
            and how it is used. Please review and adjust this text with your own legal wording
            before publishing.
          </p>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Information we collect</h2>
            <p className="mt-2">
              When you submit a booking or enquiry we collect your name, mobile number, optional
              email address and the trip details you provide (pickup, destination, date, time,
              passengers and any special request).
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">How we use it</h2>
            <p className="mt-2">
              Your details are used to confirm availability, assign a vehicle and driver, share fare
              details and contact you about your trip. Booking information is passed to our internal
              fleet management system for operational handling.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Sharing</h2>
            <p className="mt-2">
              We share trip information with the driver assigned to your booking. We do not sell
              your personal information.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              For questions about this policy, call or message us on {brand.phoneDisplay}.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

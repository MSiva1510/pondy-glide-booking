import { createFileRoute } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/sections/Section";
import { ContactForm } from "@/components/ContactForm";
import { brand } from "@/config/brand";
import { whatsAppHref } from "@/lib/whatsapp";
import paymentQr from "@/assets/payment-qr.png.asset.json";

const title = `Contact | Book a ${brand.city} Cab by Phone or WhatsApp`;
const description =
  "Call or WhatsApp us to plan your Pondicherry trip — local cabs, airport transfers, sightseeing and outstation travel.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${brand.siteUrl}/contact` }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Plan Your Journey"
        description="Tell us where you are going and we will confirm the vehicle and fare."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <a
              href={brand.callHref}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-aqua"
            >
              <Phone className="mt-0.5 size-5 text-aqua" aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold">Call Us</span>
                <span className="text-sm text-muted-foreground">{brand.phoneDisplay}</span>
              </span>
            </a>
            <a
              href={whatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-aqua"
            >
              <MessageCircle className="mt-0.5 size-5 text-[#25D366]" aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold">WhatsApp</span>
                <span className="text-sm text-muted-foreground">{brand.phoneDisplay}</span>
              </span>
            </a>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <MapPin className="mt-0.5 size-5 text-aqua" aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold">Location</span>
                <span className="text-sm text-muted-foreground">
                  {brand.address || `${brand.city} / ${brand.state}`}
                </span>
              </span>
            </div>

            {/* Map placeholder — set brand.mapEmbedUrl to show the real location. */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              {brand.mapEmbedUrl ? (
                <iframe
                  src={brand.mapEmbedUrl}
                  title={`${brand.brandName} location map`}
                  loading="lazy"
                  className="h-64 w-full border-0"
                />
              ) : (
                <div className="flex h-64 items-center justify-center px-6 text-center text-sm text-muted-foreground">
                  Map will be shown here once the office location is added.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="text-sm font-semibold">Pay by UPI</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Scan this QR with any UPI app to pay {brand.brandName}.
              </p>
              <img
                src={paymentQr.url}
                alt={`UPI payment QR code for ${brand.brandName}`}
                loading="lazy"
                className="mx-auto mt-4 h-40 w-40 rounded-xl bg-white p-2 sm:h-48 sm:w-48"
              />
            </div>
          </div>

          <ContactForm />
        </div>
      </Section>
    </>
  );
}

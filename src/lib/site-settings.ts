/**
 * Editable site settings: shape, defaults and the "apply overrides" logic.
 *
 * Overrides are stored in the `site_settings` table (public rows) and applied
 * on top of the static data files at load time, so the public site keeps
 * working even when nothing has been customised yet.
 */
import { brand, setBrandOverrides } from "@/config/brand";
import { vehicles } from "@/data/vehicles";
import { testimonials, type Testimonial } from "@/data/testimonials";
import { popularRoutes, type PopularRoute } from "@/data/routes";
import { pricingTiers, setPricingDisclaimer, type PricingTier } from "@/data/pricing";
import type { Vehicle } from "@/types";

export interface BrandOverrides {
  brandName?: string;
  tagline?: string;
  phone?: string;
  phoneDisplay?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  state?: string;
  address?: string;
  mapEmbedUrl?: string;
  siteUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface SeoOverrides {
  titleSuffix?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  keywords?: string;
  ogImage?: string;
  googleSiteVerification?: string;
  gaMeasurementId?: string;
  noIndex?: boolean;
}

export interface VehicleOverride {
  id: string;
  name: string;
  category: string;
  passengers: number;
  luggage: number;
  transmission: Vehicle["transmission"];
  features: string[];
  basePricePerKm: number;
  localStartingPrice: number;
  active: boolean;
  imageUrl?: string;
}

export interface ContentOverrides {
  vehicles?: VehicleOverride[];
  testimonials?: Testimonial[];
  routes?: PopularRoute[];
  pricingTiers?: PricingTier[];
  pricingDisclaimer?: string;
}

export interface BookingApiSettings {
  enabled: boolean;
  url?: string;
  method?: "POST" | "PUT";
  authHeaderName?: string;
  authHeaderValue?: string;
  extraHeadersJson?: string;
}

export interface PublicSiteSettings {
  brand: BrandOverrides;
  seo: SeoOverrides;
  content: ContentOverrides;
}

export const emptyPublicSettings: PublicSiteSettings = { brand: {}, seo: {}, content: {} };

/** Current defaults, used to pre-fill the admin forms. */
export function currentDefaults(): { vehicles: VehicleOverride[]; testimonials: Testimonial[]; routes: PopularRoute[]; pricingTiers: PricingTier[] } {
  return {
    vehicles: vehicles.map((v) => ({
      id: v.id,
      name: v.name,
      category: v.category,
      passengers: v.passengers,
      luggage: v.luggage,
      transmission: v.transmission,
      features: [...v.features],
      basePricePerKm: v.basePricePerKm,
      localStartingPrice: v.localStartingPrice,
      active: v.active,
    })),
    testimonials: testimonials.map((t) => ({ ...t })),
    routes: popularRoutes.map((r) => ({ ...r })),
    pricingTiers: pricingTiers.map((p) => ({ ...p, includes: [...p.includes] })),
  };
}

function replaceAll<T>(target: T[], next: T[]) {
  target.length = 0;
  target.push(...next);
}

/** Applies stored overrides on top of the static data (in place). */
export function applySiteSettings(settings: PublicSiteSettings | null | undefined) {
  if (!settings) return;

  setBrandOverrides(settings.brand ?? {});

  const content = settings.content ?? {};

  if (content.vehicles?.length) {
    const byId = new Map(vehicles.map((v) => [v.id, v]));
    replaceAll(
      vehicles,
      content.vehicles.map((v) => ({
        id: v.id,
        name: v.name,
        category: v.category,
        passengers: v.passengers,
        luggage: v.luggage,
        ac: true,
        transmission: v.transmission,
        image: v.imageUrl || byId.get(v.id)?.image || byId.values().next().value?.image || "",
        features: v.features,
        basePricePerKm: v.basePricePerKm,
        localStartingPrice: v.localStartingPrice,
        active: v.active,
      })),
    );
  }

  if (content.testimonials?.length) replaceAll(testimonials, content.testimonials);
  if (content.routes?.length) replaceAll(popularRoutes, content.routes);
  if (content.pricingTiers?.length) replaceAll(pricingTiers, content.pricingTiers);
  if (content.pricingDisclaimer) setPricingDisclaimer(content.pricingDisclaimer);

  return brand;
}

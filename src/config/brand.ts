// Central brand configuration. Editable defaults live here; the admin area can
// override any of these values (stored in the database and applied at load).
export interface BrandConfig {
  brandName: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  address: string;
  mapEmbedUrl: string;
  siteUrl: string;
  logoUrl: string;
  faviconUrl: string;
  readonly callHref: string;
}

const defaultBrand = {
  brandName: "Sri Jayam Travels",
  tagline: "Pondicherry Cabs & Car Rental",
  phone: "+919442337470",
  phoneDisplay: "+91 94423 37470",
  whatsapp: "919442337470",
  email: "bookings@example.com",
  city: "Pondicherry",
  state: "Puducherry",
  address: "Pondicherry, Puducherry",
  mapEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=79.7982108%2C11.8866644%2C79.8122108%2C11.9006644&layer=mapnik&marker=11.8936644%2C79.8052108",
  siteUrl: "https://pondy-glide-booking.netlify.app",
  logoUrl: "",
  faviconUrl: "",
};

export const brandDefaults = { ...defaultBrand };

export const brand: BrandConfig = {
  ...defaultBrand,
  get callHref() {
    return `tel:${brand.phone}`;
  },
};

/** Applies admin overrides on top of the defaults (blank values are ignored). */
export function setBrandOverrides(overrides: Partial<Record<keyof typeof defaultBrand, string>>) {
  for (const key of Object.keys(defaultBrand) as (keyof typeof defaultBrand)[]) {
    const value = overrides?.[key];
    brand[key] = value !== undefined && value !== null && value !== "" ? value : defaultBrand[key];
  }
}

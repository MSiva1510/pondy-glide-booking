// Central brand configuration. Replace these values to rebrand the site.
export const brand = {
  brandName: "Sri Jayam Travels",
  tagline: "Pondicherry Cabs & Car Rental",
  phone: "+919442337470",
  phoneDisplay: "+91 94423 37470",
  whatsapp: "919442337470",
  email: "bookings@example.com",
  city: "Pondicherry",
  state: "Puducherry",
  // Add a full street address here later; it is optional everywhere in the UI.
  address: "",
  mapEmbedUrl: "",
  siteUrl: "https://pondicherry-cabs.lovable.app",
} as const;

export const callHref = `tel:${brand.phone}`;

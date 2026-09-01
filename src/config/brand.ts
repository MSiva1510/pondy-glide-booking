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
  address: "Pondicherry, Puducherry",
  mapEmbedUrl: `https://www.google.com/maps/embed/v1/place?key=${import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"]}&q=Sri+Jayam+Travels,+Pondicherry&center=11.8936644,79.8052108&zoom=16`,
  siteUrl: "https://pondicherry-cabs.lovable.app",
} as const;

export const callHref = `tel:${brand.phone}`;

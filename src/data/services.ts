export interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  icon: string;
  tagline: string;
  highlights: string[];
  priceHint: string;
}

export const services: ServiceItem[] = [
  {
    slug: "local-cab",
    title: "Local Cab",
    description: "Comfortable rides across Pondicherry, whenever you need them.",
    icon: "Car",
    tagline:
      "Hourly packages and point-to-point rides across Pondicherry — White Town lanes, Rock Beach evenings and Auroville day trips.",
    highlights: [
      "3, 4 and 8-hour packages starting ₹1,000",
      "Rock Beach, French Quarter, Auroville & Paradise Beach runs",
      "Sedan, SUV or MPV — pick the size that fits your group",
      "Extra hours at a fixed per-hour rate, agreed upfront",
    ],
    priceHint: "Packages from ₹1,000",
  },
  {
    slug: "airport-transfer",
    title: "Airport Transfer",
    description: "Pondicherry to Chennai Airport and other airport transfers, on time.",
    icon: "Plane",
    tagline:
      "Door-to-door drops and pickups between Pondicherry and Chennai Airport, timed around your flight — day or night.",
    highlights: [
      "One-way airport drop ₹4,200 with ECR toll included",
      "Chennai city drop ₹4,600",
      "Add a 2-hour Mahabalipuram stop on the way at ₹5,200",
      "Pickup service with waiting time included",
    ],
    priceHint: "From ₹4,200 one way",
  },
  {
    slug: "round-trip",
    title: "Round Trip",
    description: "Flexible return journeys with the same vehicle and driver.",
    icon: "Repeat",
    tagline:
      "Go and return with the same vehicle and driver — no rebooking, no hunting for a cab on the way back.",
    highlights: [
      "Same vehicle and driver throughout the journey",
      "Waiting time built into the plan",
      "Ideal for weddings, weekend getaways & temple tours",
      "Per-km billing from ₹15 on longer same-day runs",
    ],
    priceHint: "From ₹15/km",
  },
  {
    slug: "outstation-cab",
    title: "Outstation Cab",
    description: "Travel from Pondicherry to destinations across South India.",
    icon: "Route",
    tagline:
      "One-way drops from Pondicherry to cities across South India — pay for the journey, not the empty return.",
    highlights: [
      "One-way drops starting ₹2,200",
      "Chennai, Bengaluru, Madurai, Tiruchirappalli, Velankanni & 20+ more",
      "Kia Carens & Toyota Innova available at +₹1,500",
      "Toll and parking at actuals, shared upfront",
    ],
    priceHint: "Drops from ₹2,200",
  },
  {
    slug: "car-rental",
    title: "Car Rental",
    description: "Cars with drivers for personal, family and business travel.",
    icon: "KeyRound",
    tagline:
      "A car with driver for the full day — run your own itinerary while we handle the roads, parking and waiting.",
    highlights: [
      "Full-day rental priced on your itinerary",
      "Share your plan for an exact quote",
      "Sedans for the city, SUVs & MPV for groups and luggage",
      "Tolls & parking extra at actuals",
    ],
    priceHint: "Priced on request",
  },
  {
    slug: "corporate-travel",
    title: "Corporate Travel",
    description: "Dependable transportation for companies and business travellers.",
    icon: "Briefcase",
    tagline:
      "Dependable daily transport for companies and business travellers — airport runs, client visits and team movement.",
    highlights: [
      "Professional drivers, clean well-maintained vehicles",
      "Airport transfers & intra-city trips on schedule",
      "One point of contact — phone, WhatsApp or online",
      "Custom quotes for regular requirements",
    ],
    priceHint: "Custom quotes",
  },
];

export const serviceToTripType: Record<string, "ONE_WAY" | "ROUND_TRIP" | "LOCAL" | "AIRPORT"> = {
  "local-cab": "LOCAL",
  "airport-transfer": "AIRPORT",
  "round-trip": "ROUND_TRIP",
  "outstation-cab": "ONE_WAY",
  "car-rental": "LOCAL",
  "corporate-travel": "LOCAL",
};

export interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const services: ServiceItem[] = [
  {
    slug: "local-cab",
    title: "Local Cab",
    description: "Comfortable rides across Pondicherry, whenever you need them.",
    icon: "Car",
  },
  {
    slug: "airport-transfer",
    title: "Airport Transfer",
    description: "Pondicherry to Chennai Airport and other airport transfers, on time.",
    icon: "Plane",
  },
  {
    slug: "round-trip",
    title: "Round Trip",
    description: "Flexible return journeys with the same vehicle and driver.",
    icon: "Repeat",
  },
  {
    slug: "outstation-cab",
    title: "Outstation Cab",
    description: "Travel from Pondicherry to destinations across South India.",
    icon: "Route",
  },
  {
    slug: "car-rental",
    title: "Car Rental",
    description: "Cars with drivers for personal, family and business travel.",
    icon: "KeyRound",
  },
  {
    slug: "corporate-travel",
    title: "Corporate Travel",
    description: "Dependable transportation for companies and business travellers.",
    icon: "Briefcase",
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

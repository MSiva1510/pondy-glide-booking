// Central pricing configuration. Later this can be fetched from the
// Fleet Management API via pricingService.getPricing().
export interface PricingTier {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  unit: string;
  includes: string[];
}

export const pricingDisclaimer =
  "Final fare may vary depending on route, distance, waiting time, tolls, parking, permits and trip requirements.";

export const pricingTiers: PricingTier[] = [
  {
    id: "local",
    title: "Local Rental",
    subtitle: "8 hrs / 80 km package",
    price: "₹1,500",
    unit: "starting from",
    includes: [
      "Driver allowance included",
      "Extra hours charged separately",
      "Within Pondicherry limits",
    ],
  },
  {
    id: "sedan",
    title: "Sedan",
    subtitle: "Dzire / Etios or similar",
    price: "₹14",
    unit: "starting from / km",
    includes: ["4 passengers", "AC vehicle", "Outstation & one way"],
  },
  {
    id: "suv",
    title: "SUV",
    subtitle: "Ertiga or similar",
    price: "₹17",
    unit: "starting from / km",
    includes: ["6 passengers", "AC vehicle", "Family friendly"],
  },
  {
    id: "innova",
    title: "Innova",
    subtitle: "Toyota Innova or similar",
    price: "₹19",
    unit: "starting from / km",
    includes: ["7 passengers", "AC vehicle", "Long distance comfort"],
  },
  {
    id: "crysta",
    title: "Innova Crysta",
    subtitle: "Premium MPV",
    price: "₹22",
    unit: "starting from / km",
    includes: ["7 passengers", "Premium interiors", "Corporate travel"],
  },
  {
    id: "tempo",
    title: "Tempo Traveller",
    subtitle: "Group travel",
    price: "₹26",
    unit: "starting from / km",
    includes: ["12+ passengers", "AC vehicle", "Tours & events"],
  },
];

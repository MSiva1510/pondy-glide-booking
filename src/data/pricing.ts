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
  "Rates shown are for the Swift Dzire (4+1) unless mentioned. Kia Carens (6+1) and Toyota Innova (7) are available at ₹1,500 above the base package price. Final fare may vary depending on route, distance, waiting time, tolls, parking, permits and trip requirements.";

export const pricingTiers: PricingTier[] = [
  {
    id: "local-sedan",
    title: "Local Sightseeing",
    subtitle: "Swift Dzire (4+1) · City tour",
    price: "₹3,000",
    unit: "8 hrs package",
    includes: ["4 hrs ₹1,500 · 3 hrs ₹1,000", "Extra hour ₹400", "3 hrs sunrise package ₹1,000"],
  },
  {
    id: "local-suv",
    title: "Local Sightseeing · SUV",
    subtitle: "Kia Carens (6+1) · City tour",
    price: "₹5,000",
    unit: "8 hrs package",
    includes: ["4 hrs ₹2,500 · 3 hrs ₹1,800", "Extra hour ₹700", "Spacious premium SUV"],
  },
  {
    id: "day-rental",
    title: "Full Day Rental",
    subtitle: "250 km · 12 hrs per day",
    price: "₹4,500",
    unit: "per day",
    includes: [
      "Rent ₹1,700 + driver bata ₹300",
      "250 km × ₹10 included",
      "Extra km ₹15 · tolls & parking extra",
    ],
  },
  {
    id: "per-km",
    title: "Per KM Rental",
    subtitle: "Above 350 km · same-day return",
    price: "₹15",
    unit: "per km",
    includes: ["Driver bata ₹400", "Swift Dzire (4+1)", "Tollgate & parking extra"],
  },
  {
    id: "airport",
    title: "Chennai Airport",
    subtitle: "Drop or pickup",
    price: "₹4,200",
    unit: "one way",
    includes: ["Chennai city ₹4,600", "ECR tollgate included", "With 2 hrs Mahabalipuram ₹5,200"],
  },
  {
    id: "outstation",
    title: "Outstation Drops",
    subtitle: "One-way drop or pickup",
    price: "₹2,200",
    unit: "starting from",
    includes: [
      "3 hrs free waiting for return",
      "Extra waiting ₹150 / hour",
      "+₹1,500 for Carens / Innova",
    ],
  },
];

// ——— Local sightseeing packages ———
export interface SightseeingPackage {
  vehicle: string;
  seats: string;
  tiers: { hours: string; price: number }[];
  extraHour: number;
}

export const sightseeingPackages: SightseeingPackage[] = [
  {
    vehicle: "Swift Dzire",
    seats: "4+1 · Premium Sedan",
    tiers: [
      { hours: "8 Hrs Package", price: 3000 },
      { hours: "4 Hrs Package", price: 1500 },
      { hours: "3 Hrs Package", price: 1000 },
      { hours: "3 Hrs Sunrise Package", price: 1000 },
    ],
    extraHour: 400,
  },
  {
    vehicle: "Kia Carens",
    seats: "6+1 · Premium SUV",
    tiers: [
      { hours: "8 Hrs Package", price: 5000 },
      { hours: "4 Hrs Package", price: 2500 },
      { hours: "3 Hrs Package", price: 1800 },
    ],
    extraHour: 700,
  },
];

export const sightseeingPlaces: string[] = [
  "Manakula Vinayagar Temple",
  "Aurobindo Ashram (White Building)",
  "Pondicherry Museum — history of Pondy",
  "Bharathi Park — symbol of Pondicherry",
  "Mahatma Gandhi Statue & Old Lighthouse, Rock Beach",
  "French War Memorial, Rock Beach",
  "Kamarajar Memorial Hall, Rock Beach",
  "Dupleix Statue & French Colony, White Town",
  "Basilica Church & Dumas Church",
  "Botanical Garden & Fish Aquarium",
  "Auroville Matrimandir (Golden Globe)",
  "Paradise Beach & government boat rides",
  "Eden Beach — Blue Flag certified, safe for bathing",
  "New Lighthouse — city view (2 pm – 5 pm only)",
  "Pondy Marina Beach & mangrove forest boating",
];

// ——— Outstation one-way drop fares (4+1 sedan) ———
export interface OutstationFare {
  to: string;
  fare: number;
}

export const outstationFares: OutstationFare[] = [
  { to: "Chennai Airport", fare: 4500 },
  { to: "Chennai City", fare: 4700 },
  { to: "Mahabalipuram", fare: 3500 },
  { to: "Kanchipuram", fare: 3800 },
  { to: "Tindivanam", fare: 2200 },
  { to: "Villupuram", fare: 2200 },
  { to: "Thirukovilure", fare: 3200 },
  { to: "Kallakurichi", fare: 3500 },
  { to: "Vellore", fare: 4600 },
  { to: "Thiruvanamalai", fare: 3500 },
  { to: "Tirupati", fare: 7000 },
  { to: "Bangalore", fare: 10000 },
  { to: "Virudhachalam", fare: 3500 },
  { to: "Chidambaram", fare: 3000 },
  { to: "Sirkali", fare: 3500 },
  { to: "Mayiladuthurai", fare: 3500 },
  { to: "Kumbakonam", fare: 4200 },
  { to: "Thanjavur", fare: 5500 },
  { to: "Karaikal", fare: 4500 },
  { to: "Nagapattinam", fare: 4700 },
  { to: "Velankanni", fare: 5500 },
  { to: "Tiruchirapalli", fare: 6000 },
  { to: "Salem", fare: 6000 },
  { to: "Madurai", fare: 9500 },
  { to: "Rameswaram", fare: 12500 },
  { to: "Thiruchendur", fare: 14700 },
  { to: "Coimbatore", fare: 11000 },
];

// ——— Special trips ———
export interface SpecialTrip {
  title: string;
  detail: string;
  price: number;
  note?: string;
}

export const specialTrips: SpecialTrip[] = [
  {
    title: "Chennai Airport Transfer",
    detail: "Drop or pickup, any hour",
    price: 4200,
    note: "Chennai city ₹4,600 · ECR tollgate included · airport parking extra",
  },
  {
    title: "Airport + Mahabalipuram",
    detail: "2 hrs Mahabalipuram sightseeing, then Chennai Airport drop",
    price: 5200,
  },
  {
    title: "Pichavaram Trip",
    detail: "Mangrove forest boating getaway",
    price: 3000,
    note: "8 hrs combo with Chidambaram Natarajar Temple ₹3,500",
  },
  {
    title: "Mahabalipuram Day Tour",
    detail: "8 hrs — Shore Temple, Pancha Rathas, Krishna's Butterball & more",
    price: 4000,
  },
];

export const pricingNotes: string[] = [
  "Driver allowance ₹300 per day extra (₹400 on per-km rentals).",
  "Driver food expenses ₹300 per day extra.",
  "Tollgate, parking, permit and other-state entry fees are extra.",
  "Hill-station charges extra where applicable.",
  "Outstation drop fares include 3 hours free waiting for return; extra waiting ₹150 per hour.",
  "Kia Carens (6+1) and Toyota Innova (7) are available at ₹1,500 above the base price.",
];

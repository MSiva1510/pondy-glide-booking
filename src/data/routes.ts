export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  approxHours: string;
  types: string[];
  /** One-way drop fare for the 4+1 sedan, in INR. */
  fare?: number;
}

// Editable route data — distances are approximate, fares are one-way drops.
export const popularRoutes: PopularRoute[] = [
  {
    id: "chennai-airport",
    from: "Pondicherry",
    to: "Chennai Airport",
    distanceKm: 165,
    approxHours: "3h 45m",
    types: ["One Way", "Round Trip"],
    fare: 4200,
  },
  {
    id: "chennai",
    from: "Pondicherry",
    to: "Chennai City",
    distanceKm: 155,
    approxHours: "3h 30m",
    types: ["One Way", "Round Trip"],
    fare: 4600,
  },
  {
    id: "mahabalipuram",
    from: "Pondicherry",
    to: "Mahabalipuram",
    distanceKm: 95,
    approxHours: "2h 15m",
    types: ["One Way", "Round Trip"],
    fare: 3500,
  },
  {
    id: "tiruvannamalai",
    from: "Pondicherry",
    to: "Tiruvannamalai",
    distanceKm: 105,
    approxHours: "2h 30m",
    types: ["One Way", "Round Trip"],
    fare: 3500,
  },
  {
    id: "chidambaram",
    from: "Pondicherry",
    to: "Chidambaram",
    distanceKm: 65,
    approxHours: "1h 30m",
    types: ["One Way", "Round Trip"],
    fare: 3000,
  },
  {
    id: "thanjavur",
    from: "Pondicherry",
    to: "Thanjavur",
    distanceKm: 175,
    approxHours: "3h 30m",
    types: ["One Way", "Round Trip"],
    fare: 5500,
  },
  {
    id: "tirupati",
    from: "Pondicherry",
    to: "Tirupati",
    distanceKm: 280,
    approxHours: "6h",
    types: ["One Way", "Round Trip"],
    fare: 7000,
  },
  {
    id: "bangalore",
    from: "Pondicherry",
    to: "Bangalore",
    distanceKm: 320,
    approxHours: "6h 30m",
    types: ["One Way", "Round Trip"],
    fare: 10000,
  },
  {
    id: "madurai",
    from: "Pondicherry",
    to: "Madurai",
    distanceKm: 330,
    approxHours: "6h 30m",
    types: ["One Way", "Round Trip"],
    fare: 9500,
  },
  {
    id: "kumbakonam",
    from: "Pondicherry",
    to: "Kumbakonam",
    distanceKm: 120,
    approxHours: "3h",
    types: ["One Way", "Round Trip"],
    fare: 4000,
  },
  {
    id: "trichy",
    from: "Pondicherry",
    to: "Trichy",
    distanceKm: 200,
    approxHours: "4h 30m",
    types: ["One Way", "Round Trip"],
    fare: 6500,
  },
];

export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  approxHours: string;
  types: string[];
}

// Editable route data — distances are approximate.
export const popularRoutes: PopularRoute[] = [
  {
    id: "chennai",
    from: "Pondicherry",
    to: "Chennai",
    distanceKm: 155,
    approxHours: "3h 30m",
    types: ["One Way", "Round Trip"],
  },
  {
    id: "chennai-airport",
    from: "Pondicherry",
    to: "Chennai Airport",
    distanceKm: 165,
    approxHours: "3h 45m",
    types: ["One Way", "Round Trip"],
  },
  {
    id: "mahabalipuram",
    from: "Pondicherry",
    to: "Mahabalipuram",
    distanceKm: 95,
    approxHours: "2h 15m",
    types: ["One Way", "Round Trip"],
  },
  {
    id: "tiruvannamalai",
    from: "Pondicherry",
    to: "Tiruvannamalai",
    distanceKm: 105,
    approxHours: "2h 30m",
    types: ["One Way", "Round Trip"],
  },
  {
    id: "tirupati",
    from: "Pondicherry",
    to: "Tirupati",
    distanceKm: 280,
    approxHours: "6h",
    types: ["Round Trip"],
  },
  {
    id: "bangalore",
    from: "Pondicherry",
    to: "Bangalore",
    distanceKm: 320,
    approxHours: "6h 30m",
    types: ["One Way", "Round Trip"],
  },
  {
    id: "trichy",
    from: "Pondicherry",
    to: "Trichy",
    distanceKm: 200,
    approxHours: "4h",
    types: ["One Way", "Round Trip"],
  },
  {
    id: "thanjavur",
    from: "Pondicherry",
    to: "Thanjavur",
    distanceKm: 175,
    approxHours: "3h 30m",
    types: ["One Way", "Round Trip"],
  },
  {
    id: "chidambaram",
    from: "Pondicherry",
    to: "Chidambaram",
    distanceKm: 65,
    approxHours: "1h 30m",
    types: ["One Way", "Round Trip"],
  },
  {
    id: "pichavaram",
    from: "Pondicherry",
    to: "Pichavaram",
    distanceKm: 75,
    approxHours: "1h 45m",
    types: ["Round Trip"],
  },
];

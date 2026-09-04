import carSedan from "@/assets/car-sedan.jpg";
import carSuv from "@/assets/car-suv.jpg";
import carInnova from "@/assets/car-innova.jpg";
import type { Vehicle } from "@/types";

// Editable fleet data. Later this will be served by the Fleet Management API.
// Kia Carens & Toyota Innova are priced ₹1,500 above the base (4+1) package rates.
export const vehicles: Vehicle[] = [
  {
    id: "sedan",
    name: "Swift Dzire",
    category: "Premium Sedan · 4+1",
    passengers: 4,
    luggage: 2,
    ac: true,
    transmission: "Manual",
    image: carSedan,
    features: ["Air conditioned", "Ideal for city & airport runs", "Fuel efficient"],
    basePricePerKm: 15,
    localStartingPrice: 1000,
    active: true,
  },
  {
    id: "carens",
    name: "Kia Carens",
    category: "Premium SUV · 6+1",
    passengers: 6,
    luggage: 3,
    ac: true,
    transmission: "Manual",
    image: carSuv,
    features: ["Extra legroom", "19 km per litre", "Great for families", "Air conditioned"],
    basePricePerKm: 18,
    localStartingPrice: 1800,
    active: true,
  },
  {
    id: "innova",
    name: "Toyota Innova",
    category: "Premium MPV · 7 seater",
    passengers: 7,
    luggage: 4,
    ac: true,
    transmission: "Manual / Automatic",
    image: carInnova,
    features: ["Spacious cabin", "22 km per litre", "Comfortable for long trips", "Air conditioned"],
    basePricePerKm: 20,
    localStartingPrice: 2500,
    active: true,
  },
];

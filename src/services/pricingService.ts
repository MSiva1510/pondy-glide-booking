import { getPricing } from "./fleetService";
import { vehicles } from "@/data/vehicles";
import type { FareEstimate, TripType } from "@/types";

export { getPricing };

/**
 * Rough indicative estimate only. Never present this as a final fare —
 * the Fleet Management system confirms the actual fare.
 */
export function estimateFare(input: {
  vehicleType: string;
  tripType: TripType;
  distanceKm?: number;
}): FareEstimate {
  const vehicle = vehicles.find((v) => v.id === input.vehicleType);
  if (!vehicle || !input.distanceKm) {
    return {
      estimatedFare: null,
      currency: "INR",
      note: "Fare will be confirmed by our team based on your route and trip requirements.",
    };
  }
  const multiplier = input.tripType === "ROUND_TRIP" ? 2 : 1;
  return {
    estimatedFare: Math.round(vehicle.basePricePerKm * input.distanceKm * multiplier),
    currency: "INR",
    note: "Indicative estimate. Tolls, parking, permits and waiting time may apply.",
  };
}
export type TripType = "ONE_WAY" | "ROUND_TRIP" | "LOCAL" | "AIRPORT";

export const TRIP_TYPE_LABELS: Record<TripType, string> = {
  ONE_WAY: "One Way",
  ROUND_TRIP: "Round Trip",
  LOCAL: "Local / Rental",
  AIRPORT: "Airport Transfer",
};

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  passengers: number;
  luggage: number;
  ac: boolean;
  transmission: "Manual" | "Automatic" | "Manual / Automatic";
  image: string;
  features: string[];
  basePricePerKm: number;
  localStartingPrice: number;
  active: boolean;
}

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "DRIVER_ON_WAY"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

export interface BookingRequest {
  customerName: string;
  phone: string;
  email?: string;
  pickup: string;
  drop: string;
  date: string;
  time: string;
  returnDate?: string;
  tripType: TripType;
  vehicleType: string;
  passengers: number;
  specialRequest?: string;
  serviceSlug?: string;
  source: "PUBLIC_WEBSITE";
}

export interface Booking extends BookingRequest {
  id: string;
  status: BookingStatus;
  createdAt: string;
  estimatedFare?: number | null;
}

export interface FareEstimate {
  estimatedFare: number | null;
  currency: "INR";
  note: string;
}
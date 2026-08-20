import { brand } from "@/config/brand";
import { TRIP_TYPE_LABELS, type TripType } from "@/types";

export interface WhatsAppTrip {
  customerName?: string;
  pickup?: string;
  drop?: string;
  date?: string;
  time?: string;
  tripType?: TripType;
  passengers?: number | string;
  vehicle?: string;
  bookingId?: string;
  note?: string;
}

export function buildWhatsAppMessage(trip: WhatsAppTrip = {}): string {
  const lines = ["Hello, I would like to book a cab.", ""];
  const push = (label: string, value?: string | number) => {
    if (value !== undefined && value !== null && `${value}`.trim() !== "") lines.push(`${label}: ${value}`);
  };
  push("Booking ID", trip.bookingId);
  push("Name", trip.customerName);
  push("Pickup", trip.pickup);
  push("Drop", trip.drop);
  push("Date", trip.date);
  push("Time", trip.time);
  push("Trip Type", trip.tripType ? TRIP_TYPE_LABELS[trip.tripType] : undefined);
  push("Passengers", trip.passengers);
  push("Vehicle", trip.vehicle);
  push("Note", trip.note);
  lines.push("", "Please confirm availability and fare.");
  return lines.join("\n");
}

export function whatsAppHref(trip: WhatsAppTrip | string = {}): string {
  const text = typeof trip === "string" ? trip : buildWhatsAppMessage(trip);
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;
}
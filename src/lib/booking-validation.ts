import type { TripType } from "@/types";

export type FieldErrors = Partial<
  Record<"pickup" | "drop" | "date" | "time" | "name" | "phone" | "vehicle", string>
>;

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function isValidIndianMobile(phone: string) {
  return /^(\+?91[- ]?)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ""));
}

export function validateTrip(input: {
  pickup: string;
  drop: string;
  date: string;
  time: string;
  name?: string;
  phone?: string;
  tripType: TripType;
}) {
  const errors: FieldErrors = {};
  if (!input.pickup.trim()) errors.pickup = "Please enter a pickup location.";
  if (input.tripType !== "LOCAL" && !input.drop.trim()) errors.drop = "Please enter a drop location.";
  if (!input.date) errors.date = "Please choose a travel date.";
  else if (input.date < todayISO()) errors.date = "Travel date cannot be in the past.";
  if (!input.time) errors.time = "Please choose a pickup time.";
  if (input.name !== undefined && !input.name.trim()) errors.name = "Please enter your name.";
  if (input.phone !== undefined && !isValidIndianMobile(input.phone))
    errors.phone = "Enter a valid 10-digit mobile number.";
  return errors;
}
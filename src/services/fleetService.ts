/**
 * Integration boundary with the internal Fleet Management Web App.
 *
 * Today every function returns mock data. When the fleet API is ready, set
 * VITE_FLEET_API_URL and replace the mock branches with real fetch calls —
 * no UI component needs to change.
 *
 * Never expose admin endpoints or fleet credentials from this file.
 */
import { vehicles } from "@/data/vehicles";
import { pricingTiers } from "@/data/pricing";
import type { Booking, BookingRequest, BookingStatus, Vehicle } from "@/types";

const FLEET_API_URL = import.meta.env["VITE_FLEET_API_URL"] as string | undefined;

export const isFleetApiConnected = Boolean(FLEET_API_URL);

const delay = (ms = 550) => new Promise((r) => setTimeout(r, ms));

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${FLEET_API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Fleet API error (${res.status})`);
  return (await res.json()) as T;
}

function generateBookingId() {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 999999)
    .toString()
    .padStart(6, "0");
  return `PB-${year}-${seq}`;
}

export async function getVehicleTypes(): Promise<Vehicle[]> {
  if (isFleetApiConnected) return request<Vehicle[]>("/vehicle-types");
  await delay(200);
  return vehicles.filter((v) => v.active);
}

export async function getAvailableVehicles(params: {
  date: string;
  tripType: string;
  passengers?: number;
}): Promise<Vehicle[]> {
  if (isFleetApiConnected)
    return request<Vehicle[]>(
      `/availability?${new URLSearchParams({ date: params.date, tripType: params.tripType, passengers: String(params.passengers ?? 1) })}`,
    );
  await delay();
  // Mock: availability is confirmed by the operations team after the request.
  return vehicles.filter(
    (v) => v.active && (!params.passengers || v.passengers >= params.passengers),
  );
}

export async function getPricing() {
  if (isFleetApiConnected) return request<typeof pricingTiers>("/pricing");
  await delay(150);
  return pricingTiers;
}

export async function createBooking(payload: BookingRequest): Promise<Booking> {
  if (isFleetApiConnected)
    return request<Booking>("/bookings", { method: "POST", body: JSON.stringify(payload) });
  await delay(900);
  return {
    ...payload,
    id: generateBookingId(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
    estimatedFare: null,
  };
}

export async function getBookingStatus(
  bookingId: string,
): Promise<{ id: string; status: BookingStatus }> {
  if (isFleetApiConnected) return request(`/bookings/${bookingId}/status`);
  await delay(300);
  return { id: bookingId, status: "PENDING" };
}

export async function cancelBooking(
  bookingId: string,
): Promise<{ id: string; status: BookingStatus }> {
  if (isFleetApiConnected) return request(`/bookings/${bookingId}/cancel`, { method: "POST" });
  await delay(400);
  return { id: bookingId, status: "CANCELLED" };
}

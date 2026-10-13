import { createBooking, cancelBooking, getBookingStatus } from "./fleetService";
import { dispatchBooking } from "@/lib/settings.functions";
import { enqueueOutbox } from "@/lib/booking-outbox";
import type { Booking, BookingRequest } from "@/types";

export { cancelBooking, getBookingStatus };

export interface SubmitResult {
  ok: boolean;
  booking?: Booking;
  bookingNumber?: string | undefined;
  via?: "dashboard" | "outbox" | undefined;
  /** True when the request is queued on this device and not yet delivered. */
  pending?: boolean | undefined;
  error?: string;
}

/** Submits a customer trip request to the fleet system. */
export async function submitBooking(input: Omit<BookingRequest, "source">): Promise<SubmitResult> {
  try {
    const booking = await createBooking({ ...input, source: "PUBLIC_WEBSITE" });
    // Forward the request to the owner's own booking system, when connected.
    try {
      const res = await dispatchBooking({ data: { booking } });
      if (res.ok && res.saved) {
        return {
          ok: true,
          booking,
          bookingNumber: res.bookingNumber || undefined,
          via: "dashboard" as const,
        };
      }
      if (!res.retryable) {
        return { ok: false, error: res.message || "Please check the details and try again." };
      }
      throw new Error(res.message || "Dashboard dispatch failed");
    } catch (error) {
      // Same-origin failsafe: neither same-origin database accepts anonymous
      // booking writes, so the request is queued in this browser and retried
      // automatically on the next visit.
      console.error("Dashboard dispatch failed, queuing in browser outbox", error);
      enqueueOutbox(booking);
      return { ok: true, booking, via: "outbox" as const, pending: true };
    }
  } catch (error) {
    console.error("Booking submission failed", error);
    return {
      ok: false,
      error: "Unable to connect right now. Please try again or book directly through WhatsApp.",
    };
  }
}

import { createBooking, cancelBooking, getBookingStatus } from "./fleetService";
import { dispatchBooking } from "@/lib/settings.functions";
import type { Booking, BookingRequest } from "@/types";

export { cancelBooking, getBookingStatus };

export interface SubmitResult {
  ok: boolean;
  booking?: Booking;
  error?: string;
}

/** Submits a customer trip request to the fleet system. */
export async function submitBooking(input: Omit<BookingRequest, "source">): Promise<SubmitResult> {
  try {
    const booking = await createBooking({ ...input, source: "PUBLIC_WEBSITE" });
    // Forward the request to the owner's own booking system, when connected.
    try {
      await dispatchBooking({ data: { booking } });
    } catch (error) {
      console.error("Could not forward booking to the connected booking system", error);
    }
    return { ok: true, booking };
  } catch (error) {
    console.error("Booking submission failed", error);
    return {
      ok: false,
      error: "Unable to connect right now. Please try again or book directly through WhatsApp.",
    };
  }
}

import { createFileRoute } from "@tanstack/react-router";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { brand } from "@/config/brand";
import type { TripType } from "@/types";

const title = `Book a Cab in ${brand.city} | Online Taxi Booking`;
const description =
  "Request a Pondicherry cab in a few steps — enter your trip, choose a vehicle and our team confirms availability and fare.";

const tripTypes: TripType[] = ["ONE_WAY", "ROUND_TRIP", "LOCAL", "AIRPORT"];
const str = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v : undefined);

export interface BookingSearch {
  pickup?: string | undefined;
  drop?: string | undefined;
  date?: string | undefined;
  time?: string | undefined;
  passengers?: string | undefined;
  vehicle?: string | undefined;
  name?: string | undefined;
  phone?: string | undefined;
  service?: string | undefined;
  tripType?: TripType | undefined;
}

export const Route = createFileRoute("/booking")({
  validateSearch: (search: Record<string, unknown>): BookingSearch => ({
    pickup: str(search["pickup"]),
    drop: str(search["drop"]),
    date: str(search["date"]),
    time: str(search["time"]),
    passengers: str(search["passengers"]),
    vehicle: str(search["vehicle"]),
    name: str(search["name"]),
    phone: str(search["phone"]),
    service: str(search["service"]),
    tripType: tripTypes.includes(search["tripType"] as TripType)
      ? (search["tripType"] as TripType)
      : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const search = Route.useSearch();
  return (
    <div className="bg-surface py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Book your cab</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Submit a trip request — our team confirms the vehicle and final fare before your journey.
        </p>
        <div className="mt-8">
          <BookingFlow initial={search} />
        </div>
      </div>
    </div>
  );
}

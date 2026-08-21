// Replace placeholder testimonials with verified customer reviews.
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  trip: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: "Very smooth booking experience and the driver was punctual.",
    name: "Customer",
    trip: "Pondicherry → Chennai Airport",
  },
  {
    id: "t2",
    quote: "The car was clean and comfortable for our family sightseeing day.",
    name: "Customer",
    trip: "Pondicherry Sightseeing",
  },
  {
    id: "t3",
    quote: "Fare was explained clearly before the trip started. No surprises.",
    name: "Customer",
    trip: "Outstation Round Trip",
  },
  {
    id: "t4",
    quote: "Booked on WhatsApp late at night and got a confirmation quickly.",
    name: "Customer",
    trip: "Local Cab",
  },
];

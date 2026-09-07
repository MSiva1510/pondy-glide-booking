import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAvailableVehicles } from "@/services/fleetService";
import { submitBooking } from "@/services/bookingService";
import { estimateFare } from "@/services/pricingService";
import { todayISO, validateTrip, type FieldErrors } from "@/lib/booking-validation";
import { LocationField } from "@/components/booking/LocationField";
import { DateField, TimeField } from "@/components/booking/DateTimeField";
import { IosSelect } from "@/components/ui/ios-select";

import { whatsAppHref } from "@/lib/whatsapp";
import { brand } from "@/config/brand";
import { TRIP_TYPE_LABELS, type Booking, type TripType } from "@/types";

export interface BookingFlowInitial {
  pickup?: string | undefined;
  drop?: string | undefined;
  date?: string | undefined;
  time?: string | undefined;
  passengers?: string | undefined;
  vehicle?: string | undefined;
  name?: string | undefined;
  phone?: string | undefined;
  tripType?: TripType | undefined;
  service?: string | undefined;
}

const stepLabels = ["Trip Details", "Vehicle", "Your Details", "Summary", "Confirmation"];

export function BookingFlow({ initial = {} }: { initial?: BookingFlowInitial }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState({
    tripType: (initial.tripType ?? "ONE_WAY") as TripType,
    pickup: initial.pickup ?? "",
    drop: initial.drop ?? "",
    date: initial.date ?? "",
    time: initial.time ?? "",
    passengers: initial.passengers ?? "2",
    vehicle: initial.vehicle ?? "",
    name: initial.name ?? "",
    phone: initial.phone ?? "",
    email: "",
    specialRequest: "",
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const availability = useQuery({
    queryKey: ["available-vehicles", form.date, form.tripType, form.passengers],
    queryFn: () =>
      getAvailableVehicles({
        date: form.date,
        tripType: form.tripType,
        passengers: Number(form.passengers) || 1,
      }),
    enabled: step === 2,
  });

  const selectedVehicle = availability.data?.find((v) => v.id === form.vehicle);
  const fare = estimateFare({ vehicleType: form.vehicle, tripType: form.tripType });

  const goStep1Next = () => {
    const found = validateTrip({
      pickup: form.pickup,
      drop: form.drop,
      date: form.date,
      time: form.time,
      tripType: form.tripType,
    });
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(2);
  };

  const goStep3Next = () => {
    const found = validateTrip({
      pickup: form.pickup,
      drop: form.drop,
      date: form.date,
      time: form.time,
      name: form.name,
      phone: form.phone,
      tripType: form.tripType,
    });
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(4);
  };

  const onConfirm = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const result = await submitBooking({
      customerName: form.name,
      phone: form.phone,
      email: form.email || undefined,
      pickup: form.pickup,
      drop: form.drop,
      date: form.date,
      time: form.time,
      tripType: form.tripType,
      vehicleType: form.vehicle,
      passengers: Number(form.passengers) || 1,
      specialRequest: form.specialRequest || undefined,
      serviceSlug: initial.service,
    });
    setSubmitting(false);
    if (result.ok && result.booking) {
      setBooking(result.booking);
      setStep(5);
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try WhatsApp.");
    }
  };

  const waTrip = {
    customerName: form.name,
    pickup: form.pickup,
    drop: form.drop,
    date: form.date,
    time: form.time,
    tripType: form.tripType,
    passengers: form.passengers,
    vehicle: selectedVehicle?.name ?? form.vehicle,
    bookingId: booking?.id,
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-8">
      {/* Step indicator */}
      <ol className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium">
        {stepLabels.map((label, i) => {
          const n = i + 1;
          const state = n === step ? "current" : n < step ? "done" : "todo";
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`flex size-6 items-center justify-center rounded-full text-[11px] font-bold ${
                  state === "current"
                    ? "gradient-hero text-ocean-foreground"
                    : state === "done"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground"
                }`}
                aria-current={state === "current" ? "step" : undefined}
              >
                {n}
              </span>
              <span className={state === "todo" ? "text-muted-foreground" : "text-foreground"}>
                {label}
              </span>
              {n < stepLabels.length ? (
                <span className="hidden h-px w-6 bg-border sm:block" />
              ) : null}
            </li>
          );
        })}
      </ol>

      {step === 1 ? (
        <div className="animate-fade-up">
          <h2 className="text-xl font-bold">Tell us about your trip</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="bf-triptype">Trip Type</Label>
              <div className="mt-1">
                <IosSelect
                  id="bf-triptype"
                  title="Trip type"
                  value={form.tripType}
                  onChange={(v) => set("tripType", v as TripType)}
                  options={(Object.keys(TRIP_TYPE_LABELS) as TripType[]).map((t) => ({
                    value: t,
                    label: TRIP_TYPE_LABELS[t],
                  }))}
                />
              </div>
            </div>
            <Field id="bf-pickup" label="Pickup Location" error={errors.pickup}>
              <LocationField
                id="bf-pickup"
                value={form.pickup}
                onChange={(v) => set("pickup", v)}
                placeholder="Pickup address or area"
              />
            </Field>
            <Field
              id="bf-drop"
              label={form.tripType === "LOCAL" ? "Drop / Area (optional)" : "Drop Location"}
              error={errors.drop}
            >
              <LocationField
                id="bf-drop"
                value={form.drop}
                onChange={(v) => set("drop", v)}
                placeholder="Destination"
              />
            </Field>
            <Field id="bf-date" label="Travel Date" error={errors.date}>
              <DateField
                id="bf-date"
                minISO={todayISO()}
                value={form.date}
                onChange={(v) => set("date", v)}
              />
            </Field>
            <Field id="bf-time" label="Pickup Time" error={errors.time}>
              <TimeField id="bf-time" value={form.time} onChange={(v) => set("time", v)} />
            </Field>
          </div>
          <StepNav onNext={goStep1Next} nextLabel="Choose Vehicle" />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="animate-fade-up">
          <h2 className="text-xl font-bold">Choose your ride</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Availability is confirmed by our team after you submit the request.
          </p>
          {availability.isLoading ? (
            <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Checking vehicles…
            </p>
          ) : availability.isError ? (
            <ErrorNote
              message="Unable to load vehicles right now. Please try again or book directly through WhatsApp."
              trip={waTrip}
            />
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {availability.data?.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => set("vehicle", v.id)}
                  aria-pressed={form.vehicle === v.id}
                  className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition-all ${
                    form.vehicle === v.id
                      ? "border-accent bg-accent/10 shadow-card"
                      : "border-border hover:border-aqua"
                  }`}
                >
                  <img
                    src={v.image}
                    alt={v.name}
                    loading="lazy"
                    width={120}
                    height={80}
                    className="h-16 w-24 rounded-xl object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{v.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {v.category}
                    </span>
                    <span className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" aria-hidden="true" />
                        {v.passengers}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="size-3.5" aria-hidden="true" />
                        {v.luggage}
                      </span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
          {errors.vehicle ? (
            <p className="mt-2 text-xs text-destructive">{errors.vehicle}</p>
          ) : null}
          <StepNav
            onBack={() => setStep(1)}
            onNext={() => {
              if (!form.vehicle) {
                setErrors({ vehicle: "Please select a vehicle to continue." });
                return;
              }
              setErrors({});
              setStep(3);
            }}
          />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="animate-fade-up">
          <h2 className="text-xl font-bold">Your details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field id="bf-name" label="Name" error={errors.name}>
              <Input
                id="bf-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Your full name"
              />
            </Field>
            <Field id="bf-phone" label="Mobile Number" error={errors.phone}>
              <Input
                id="bf-phone"
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="10-digit mobile"
              />
            </Field>
            <Field id="bf-email" label="Email (optional)">
              <Input
                id="bf-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
              />
            </Field>
            <Field id="bf-pax" label="Passengers">
              <Input
                id="bf-pax"
                type="number"
                min={1}
                max={20}
                value={form.passengers}
                onChange={(e) => set("passengers", e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Label htmlFor="bf-note">Special request (optional)</Label>
              <Textarea
                id="bf-note"
                className="mt-1"
                rows={3}
                value={form.specialRequest}
                onChange={(e) => set("specialRequest", e.target.value)}
                placeholder="Child seat, extra luggage, multiple stops…"
              />
            </div>
          </div>
          <StepNav onBack={() => setStep(2)} onNext={goStep3Next} nextLabel="Review Booking" />
        </div>
      ) : null}

      {step === 4 ? (
        <div className="animate-fade-up">
          <h2 className="text-xl font-bold">Booking summary</h2>
          <dl className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {[
              ["Trip type", TRIP_TYPE_LABELS[form.tripType]],
              ["Pickup", form.pickup],
              ["Drop", form.drop || "—"],
              ["Date", form.date],
              ["Time", form.time],
              ["Vehicle", selectedVehicle?.name ?? form.vehicle],
              ["Passengers", form.passengers],
              ["Name", form.name],
              ["Mobile", form.phone],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-start justify-between gap-4 bg-card px-4 py-3 text-sm"
              >
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 rounded-2xl bg-secondary p-4">
            <p className="text-sm font-semibold">
              {fare.estimatedFare
                ? `Estimated fare ₹${fare.estimatedFare}`
                : "Fare will be confirmed"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{fare.note}</p>
          </div>
          {submitError ? <ErrorNote message={submitError} trip={waTrip} /> : null}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setStep(3)}
              disabled={submitting}
            >
              <ArrowLeft className="size-4" aria-hidden="true" /> Back
            </Button>
            <Button className="flex-1 rounded-xl" onClick={onConfirm} disabled={submitting}>
              {submitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <BadgeCheck className="size-4" aria-hidden="true" />
              )}
              Get Final Fare Confirmation
            </Button>
          </div>
        </div>
      ) : null}

      {step === 5 && booking ? (
        <div className="animate-fade-up text-center">
          <CheckCircle2 className="mx-auto size-14 text-accent" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-bold">Your booking request is received</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you! Our team will confirm your vehicle and fare shortly.
          </p>
          <p className="mt-5 inline-block rounded-full bg-secondary px-4 py-2 text-sm font-semibold">
            Booking ID: {booking.id}
          </p>
          <dl className="mx-auto mt-6 max-w-md divide-y divide-border overflow-hidden rounded-2xl border border-border text-left">
            {[
              [
                "Your trip",
                `${booking.pickup} → ${booking.drop || TRIP_TYPE_LABELS[booking.tripType]}`,
              ],
              ["Date", booking.date],
              ["Time", booking.time],
              ["Vehicle", selectedVehicle?.name ?? booking.vehicleType],
              ["Status", "Awaiting Confirmation"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button asChild className="rounded-xl">
              <a href={whatsAppHref(waTrip)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp Confirmation
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <a href={brand.callHref}>
                <Phone className="size-4" aria-hidden="true" /> Call {brand.phoneDisplay}
              </a>
            </Button>
            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1">{children}</div>
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextLabel = "Continue",
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string | undefined;
}) {
  return (
    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
      {onBack ? (
        <Button variant="outline" className="rounded-xl" onClick={onBack}>
          <ArrowLeft className="size-4" aria-hidden="true" /> Back
        </Button>
      ) : null}
      <Button className="flex-1 rounded-xl" onClick={onNext}>
        {nextLabel} <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

function ErrorNote({
  message,
  trip,
}: {
  message: string;
  trip: Parameters<typeof whatsAppHref>[0];
}) {
  return (
    <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
      <p className="text-sm text-destructive">{message}</p>
      <Button asChild variant="outline" size="sm" className="mt-3 rounded-xl">
        <a href={whatsAppHref(trip)} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="size-4" aria-hidden="true" /> Book on WhatsApp
        </a>
      </Button>
    </div>
  );
}

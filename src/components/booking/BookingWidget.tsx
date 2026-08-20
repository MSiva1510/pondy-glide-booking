import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { whatsAppHref } from "@/lib/whatsapp";
import { vehicles } from "@/data/vehicles";
import { TRIP_TYPE_LABELS, type TripType } from "@/types";
import { todayISO, validateTrip } from "@/lib/booking-validation";

const tabs: TripType[] = ["ONE_WAY", "ROUND_TRIP", "LOCAL", "AIRPORT"];

export function BookingWidget({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>("ONE_WAY");
  const [form, setForm] = useState({
    pickup: "",
    drop: "",
    date: "",
    time: "",
    passengers: "2",
    vehicle: "sedan",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateTrip({ ...form, tripType });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    navigate({ to: "/booking", search: { ...form, tripType } });
  };

  const field = "h-11 rounded-xl bg-background";

  return (
    <form
      onSubmit={onSubmit}
      className={`glass-panel rounded-3xl p-4 shadow-float sm:p-6 ${compact ? "" : "w-full"}`}
      aria-label="Cab booking form"
    >
      <div className="flex flex-wrap gap-1.5 rounded-2xl bg-secondary p-1.5">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTripType(t)}
            aria-pressed={tripType === t}
            className={`flex-1 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              tripType === t ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:text-primary"
            }`}
          >
            {TRIP_TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="bw-pickup" className="text-xs font-semibold text-muted-foreground">Pickup Location</Label>
          <Input id="bw-pickup" className={field} placeholder="e.g. White Town, Pondicherry" value={form.pickup} onChange={set("pickup")} />
          {errors.pickup ? <p className="mt-1 text-xs text-destructive">{errors.pickup}</p> : null}
        </div>
        <div>
          <Label htmlFor="bw-drop" className="text-xs font-semibold text-muted-foreground">
            {tripType === "LOCAL" ? "Drop / Area (optional)" : "Drop Location"}
          </Label>
          <Input id="bw-drop" className={field} placeholder="e.g. Chennai Airport" value={form.drop} onChange={set("drop")} />
          {errors.drop ? <p className="mt-1 text-xs text-destructive">{errors.drop}</p> : null}
        </div>
        <div>
          <Label htmlFor="bw-date" className="text-xs font-semibold text-muted-foreground">Travel Date</Label>
          <Input id="bw-date" type="date" min={todayISO()} className={field} value={form.date} onChange={set("date")} />
          {errors.date ? <p className="mt-1 text-xs text-destructive">{errors.date}</p> : null}
        </div>
        <div>
          <Label htmlFor="bw-time" className="text-xs font-semibold text-muted-foreground">Pickup Time</Label>
          <Input id="bw-time" type="time" className={field} value={form.time} onChange={set("time")} />
          {errors.time ? <p className="mt-1 text-xs text-destructive">{errors.time}</p> : null}
        </div>
        <div>
          <Label htmlFor="bw-passengers" className="text-xs font-semibold text-muted-foreground">Passengers</Label>
          <Input id="bw-passengers" type="number" min={1} max={20} className={field} value={form.passengers} onChange={set("passengers")} />
        </div>
        <div>
          <Label htmlFor="bw-vehicle" className="text-xs font-semibold text-muted-foreground">Vehicle Type</Label>
          <select
            id="bw-vehicle"
            value={form.vehicle}
            onChange={set("vehicle")}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="bw-name" className="text-xs font-semibold text-muted-foreground">Name</Label>
          <Input id="bw-name" className={field} placeholder="Your name" value={form.name} onChange={set("name")} />
          {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name}</p> : null}
        </div>
        <div>
          <Label htmlFor="bw-phone" className="text-xs font-semibold text-muted-foreground">Mobile Number</Label>
          <Input id="bw-phone" type="tel" inputMode="tel" className={field} placeholder="10-digit mobile" value={form.phone} onChange={set("phone")} />
          {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone}</p> : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button type="submit" size="lg" className="h-12 flex-1 rounded-xl text-base">
          <Search className="size-4" aria-hidden="true" /> Check Availability
        </Button>
        <Button asChild type="button" variant="outline" size="lg" className="h-12 rounded-xl">
          <a
            href={whatsAppHref({
              customerName: form.name,
              pickup: form.pickup,
              drop: form.drop,
              date: form.date,
              time: form.time,
              tripType,
              passengers: form.passengers,
              vehicle: vehicles.find((v) => v.id === form.vehicle)?.name,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="size-4" aria-hidden="true" /> Book via WhatsApp
          </a>
        </Button>
      </div>
    </form>
  );
}
import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MapPin, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { MapPicker, type LatLng } from "@/components/booking/MapPicker";
import {
  autocompletePlaces,
  getPlaceLocation,
  reverseGeocode,
  type PlaceSuggestion,
} from "@/lib/places.functions";

export function LocationField({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const search = useServerFn(autocompletePlaces);
  const details = useServerFn(getPlaceLocation);
  const reverse = useServerFn(reverseGeocode);

  const [suggestions, setSuggestions] = React.useState<PlaceSuggestion[]>([]);
  const [openList, setOpenList] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [mapOpen, setMapOpen] = React.useState(false);
  const [pin, setPin] = React.useState<LatLng | null>(null);
  const [pinAddress, setPinAddress] = React.useState("");
  const [resolving, setResolving] = React.useState(false);
  const skipNext = React.useRef(false);

  React.useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    const q = value.trim();
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }
    let active = true;
    setLoading(true);
    const t = window.setTimeout(async () => {
      try {
        const results = await search({ data: { input: q } });
        if (active) {
          setSuggestions(results);
          setOpenList(true);
        }
      } catch {
        if (active) setSuggestions([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 400);
    return () => {
      active = false;
      window.clearTimeout(t);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const choose = async (s: PlaceSuggestion) => {
    skipNext.current = true;
    onChange(s.label);
    setOpenList(false);
    setSuggestions([]);
    try {
      const loc = await details({ data: { placeId: s.placeId } });
      if (loc.lat != null && loc.lng != null) setPin({ lat: loc.lat, lng: loc.lng });
    } catch {
      /* address text is enough */
    }
  };

  const onPin = async (pos: LatLng) => {
    setPin(pos);
    setResolving(true);
    try {
      const res = await reverse({ data: pos });
      setPinAddress(res.address || `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`);
    } catch {
      setPinAddress(`${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`);
    } finally {
      setResolving(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((p) => {
      void onPin({ lat: p.coords.latitude, lng: p.coords.longitude });
    });
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpenList(true)}
          onBlur={() => setOpenList(false)}
          placeholder={placeholder}
          autoComplete="off"
          className="h-11 rounded-xl bg-background pl-9 pr-24"
        />
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold text-primary"
        >
          <Navigation className="size-3.5" aria-hidden="true" /> Map
        </button>
      </div>

      {openList && (suggestions.length > 0 || loading) ? (
        <ul className="absolute z-30 mt-1 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-float">
          {loading && suggestions.length === 0 ? (
            <li className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Searching…
            </li>
          ) : null}
          {suggestions.map((s) => (
            <li key={s.placeId}>
              <button
                type="button"
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => void choose(s)}
                className="flex w-full items-start gap-2 px-4 py-2.5 text-left hover:bg-secondary"
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{s.primary}</span>
                  {s.secondary ? (
                    <span className="block truncate text-xs text-muted-foreground">
                      {s.secondary}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <Drawer open={mapOpen} onOpenChange={setMapOpen} handleOnly>
        <DrawerContent className="rounded-t-3xl">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-center text-base">Pick location on map</DrawerTitle>
          </DrawerHeader>
          <div className="mx-auto w-full max-w-md px-4">
            <MapPicker center={pin} onPick={(p) => void onPin(p)} />
            <button
              type="button"
              onClick={useMyLocation}
              className="mt-3 flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs font-semibold text-primary"
            >
              <Search className="size-3.5" aria-hidden="true" /> Use my current location
            </button>
            <p className="mt-3 min-h-10 rounded-xl bg-secondary px-3 py-2 text-sm">
              {resolving ? "Finding address…" : pinAddress || "Tap or drag the pin to set a spot."}
            </p>
          </div>
          <DrawerFooter className="mx-auto w-full max-w-md">
            <Button
              className="h-12 rounded-xl text-base"
              disabled={!pinAddress}
              onClick={() => {
                skipNext.current = true;
                onChange(pinAddress);
                setMapOpen(false);
              }}
            >
              Use this location
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

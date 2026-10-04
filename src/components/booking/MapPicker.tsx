import * as React from "react";
import { Loader2 } from "lucide-react";
import { loadGoogleMaps } from "@/lib/google-maps";

export interface LatLng {
  lat: number;
  lng: number;
}

const PONDY: LatLng = { lat: 11.9416, lng: 79.8083 };

export function MapPicker({
  center,
  onPick,
}: {
  center?: LatLng | null;
  onPick: (pos: LatLng) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const markerRef = React.useRef<google.maps.Marker | null>(null);
  const pickRef = React.useRef(onPick);
  pickRef.current = onPick;

  React.useEffect(() => {
    let cancelled = false;
    const el = ref.current;
    if (!el) return;
    let lastW = 0;
    let lastH = 0;

    const onAuthFailure = () => {
      if (!cancelled)
        setError("Google Maps key was rejected. Check the API key and its referer restrictions.");
    };
    window.addEventListener("gm_authfailure", onAuthFailure);

    const create = () => {
      if (cancelled || mapRef.current || !window.google?.maps) return;
      if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
      const start = center ?? PONDY;
      const map = new window.google.maps.Map(el, {
        center: start,
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
      });
      const marker = new window.google.maps.Marker({
        position: start,
        map,
        draggable: true,
      });
      marker.addListener("dragend", () => {
        const p = marker.getPosition();
        if (p) pickRef.current({ lat: p.lat(), lng: p.lng() });
      });
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        marker.setPosition(e.latLng);
        pickRef.current({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      });
      mapRef.current = map;
      markerRef.current = marker;
      setReady(true);
    };

    const observer = new ResizeObserver(() => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w === 0 || h === 0) return;
      const changed = w !== lastW || h !== lastH;
      lastW = w;
      lastH = h;
      create();
      if (changed && mapRef.current) google.maps.event.trigger(mapRef.current, "resize");
    });
    observer.observe(el);

    loadGoogleMaps()
      .then(create)
      .catch(() => {
        if (!cancelled) setError("Map could not be loaded. You can still type the address.");
      });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("gm_authfailure", onAuthFailure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!center || !mapRef.current || !markerRef.current) return;
    mapRef.current.panTo(center);
    markerRef.current.setPosition(center);
  }, [center]);

  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-border bg-secondary">
      <div ref={ref} className="size-full" />
      {!ready && !error ? (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading map…
        </div>
      ) : null}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground">
          {error}
        </div>
      ) : null}
    </div>
  );
}

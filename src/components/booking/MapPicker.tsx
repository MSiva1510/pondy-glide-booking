import * as React from "react";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    google?: typeof google;
    __initSriJayamMap?: () => void;
  }
}

let mapsPromise: Promise<void> | null = null;

function loadMaps() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps) return Promise.resolve();
  if (mapsPromise) return mapsPromise;
  const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
  const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] ?? "";
  if (!key) return Promise.reject(new Error("Maps key missing"));
  mapsPromise = new Promise<void>((resolve, reject) => {
    window.__initSriJayamMap = () => resolve();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__initSriJayamMap&channel=${channel}`;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return mapsPromise;
}

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
    loadMaps()
      .then(() => {
        if (cancelled || !ref.current || !window.google) return;
        const start = center ?? PONDY;
        const map = new window.google.maps.Map(ref.current, {
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
      })
      .catch(() => {
        if (!cancelled) setError("Map could not be loaded. You can still type the address.");
      });
    return () => {
      cancelled = true;
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

import * as React from "react";
import { Loader2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface LatLng {
  lat: number;
  lng: number;
}

const PONDY: LatLng = { lat: 11.9416, lng: 79.8083 };

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const pinIcon = L.divIcon({
  className: "",
  html: '<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:var(--color-accent,#0ea5a4);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

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
  const mapRef = React.useRef<L.Map | null>(null);
  const markerRef = React.useRef<L.Marker | null>(null);
  const pickRef = React.useRef(onPick);
  pickRef.current = onPick;

  React.useEffect(() => {
    let cancelled = false;
    const el = ref.current;
    if (!el) return;
    let lastW = 0;
    let lastH = 0;

    const create = () => {
      if (cancelled || mapRef.current) return;
      if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
      const start = center ?? PONDY;
      const map = L.map(el, {
        center: [start.lat, start.lng],
        zoom: 14,
        zoomControl: true,
        attributionControl: true,
      });
      L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map);
      const marker = L.marker([start.lat, start.lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        pickRef.current({ lat: p.lat, lng: p.lng });
      });
      map.on("click", (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        pickRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
      mapRef.current = map;
      markerRef.current = marker;
      map.invalidateSize();
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
      if (changed && mapRef.current) mapRef.current.invalidateSize();
    });
    observer.observe(el);

    try {
      create();
    } catch {
      if (!cancelled) setError("Map could not be loaded. You can still type the address.");
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!center || !mapRef.current || !markerRef.current) return;
    mapRef.current.panTo([center.lat, center.lng]);
    markerRef.current.setLatLng([center.lat, center.lng]);
  }, [center]);

  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-border bg-secondary">
      <div ref={ref} className="size-full z-0" />
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

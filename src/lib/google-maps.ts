const BROWSER_KEY = import.meta.env["VITE_GOOGLE_MAPS_BROWSER_KEY"] as string | undefined;

const PONDY = { lat: 11.9416, lng: 79.8083 };

let mapsPromise: Promise<void> | null = null;

declare global {
  interface Window {
    google?: typeof google;
    __initSriJayamMap?: () => void;
  }
}

export function mapsKeyMissing() {
  return !BROWSER_KEY;
}

export function loadGoogleMaps() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps) return Promise.resolve();
  if (mapsPromise) return mapsPromise;
  if (!BROWSER_KEY) return Promise.reject(new Error("Maps key missing"));
  mapsPromise = new Promise<void>((resolve, reject) => {
    window.__initSriJayamMap = () => resolve();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${BROWSER_KEY}&loading=async&callback=__initSriJayamMap`;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
    setTimeout(() => reject(new Error("Google Maps timed out")), 20000);
  });
  return mapsPromise;
}

export interface PlaceSuggestion {
  placeId: string;
  primary: string;
  secondary: string;
  label: string;
}

const suggestCache = new Map<string, { at: number; value: PlaceSuggestion[] }>();
const reverseCache = new Map<string, { at: number; value: string }>();

function cacheGet<T>(store: Map<string, { at: number; value: T }>, key: string, ttl: number) {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > ttl) {
    store.delete(key);
    return undefined;
  }
  return hit.value;
}

export async function autocompletePlaces(input: string): Promise<PlaceSuggestion[]> {
  const q = input.trim();
  if (q.length < 3) return [];
  if (!BROWSER_KEY) throw new Error("Maps key missing");
  const cached = cacheGet(suggestCache, q.toLowerCase(), 5 * 60 * 1000);
  if (cached) return cached;

  const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": BROWSER_KEY,
      "X-Goog-FieldMask":
        "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.text",
    },
    body: JSON.stringify({
      input: q,
      includedRegionCodes: ["in"],
      locationBias: {
        circle: {
          center: { latitude: PONDY.lat, longitude: PONDY.lng },
          radius: 50000,
        },
      },
    }),
  });
  if (!response.ok) {
    console.error(`Places autocomplete failed [${response.status}]`);
    return [];
  }
  const json = (await response.json()) as {
    suggestions?: Array<{
      placePrediction?: {
        placeId?: string;
        structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
        text?: { text?: string };
      };
    }>;
  };
  const results = (json.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
    .slice(0, 6)
    .map((p) => {
      const primary = p.structuredFormat?.mainText?.text ?? p.text?.text ?? "";
      const secondary = p.structuredFormat?.secondaryText?.text ?? "";
      return {
        placeId: p.placeId!,
        primary,
        secondary,
        label: secondary ? `${primary}, ${secondary}` : primary,
      };
    });
  suggestCache.set(q.toLowerCase(), { at: Date.now(), value: results });
  return results;
}

export async function getPlaceLocation(placeId: string) {
  if (!BROWSER_KEY) throw new Error("Maps key missing");
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": BROWSER_KEY,
        "X-Goog-FieldMask": "location,formattedAddress,displayName",
      },
    },
  );
  if (!response.ok) throw new Error(`Place details failed (${response.status}).`);
  const json = (await response.json()) as {
    location?: { latitude: number; longitude: number };
    formattedAddress?: string;
    displayName?: { text?: string };
  };
  return {
    lat: json.location?.latitude ?? null,
    lng: json.location?.longitude ?? null,
    address: json.formattedAddress ?? json.displayName?.text ?? "",
  };
}

export async function reverseGeocode(lat: number, lng: number) {
  const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  const cached = cacheGet(reverseCache, key, 10 * 60 * 1000);
  if (cached !== undefined) return { address: cached };
  await loadGoogleMaps();
  const geocoder = new window.google!.maps.Geocoder();
  const result = await geocoder.geocode({ location: { lat, lng } });
  const address = result.results?.[0]?.formatted_address ?? "";
  if (address) reverseCache.set(key, { at: Date.now(), value: address });
  return { address };
}

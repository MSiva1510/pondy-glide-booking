import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PHOTON_URL = "https://photon.komoot.io/api/";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
const PONDY = { lat: 11.9416, lng: 79.8083 };

const USER_AGENT =
  process.env["NOMINATIM_USER_AGENT"] ?? "PondyGlideBooking/1.0 (https://github.com/MSiva1510)";

const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX = 200;
const cache = new Map<string, { at: number; value: unknown }>();

function cacheGet<T>(key: string): T | undefined {
  const hit = cache.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return undefined;
  }
  cache.delete(key);
  cache.set(key, hit);
  return hit.value as T;
}

function cacheSet(key: string, value: unknown) {
  cache.set(key, { at: Date.now(), value });
  while (cache.size > CACHE_MAX) {
    const oldest = cache.keys().next();
    if (oldest.done) break;
    cache.delete(oldest.value);
  }
}

let lastRequest = 0;
let queue: Promise<unknown> = Promise.resolve();

/** Nominatim allows at most one request per second; serialise and space them out. */
function throttle<T>(fn: () => Promise<T>, minGapMs: number): Promise<T> {
  const run = queue.then(async () => {
    const wait = minGapMs - (Date.now() - lastRequest);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastRequest = Date.now();
    return fn();
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function toBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(token: string) {
  const bin = atob(token.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

interface PlaceToken {
  lat: number;
  lng: number;
  label: string;
}

export interface PlaceSuggestion {
  placeId: string;
  primary: string;
  secondary: string;
  label: string;
}

interface PhotonFeature {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    district?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export const autocompletePlaces = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ input: z.string().min(3).max(120) }).parse(data))
  .handler(async ({ data }): Promise<PlaceSuggestion[]> => {
    const key = `photon:${data.input.toLowerCase()}`;
    const cached = cacheGet<PlaceSuggestion[]>(key);
    if (cached) return cached;

    const params = new URLSearchParams({
      q: data.input,
      limit: "6",
      lang: "en",
      lat: String(PONDY.lat),
      lon: String(PONDY.lng),
    });
    const response = await fetch(`${PHOTON_URL}?${params}`, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    });
    if (!response.ok) {
      console.error(`Photon search failed [${response.status}]`);
      return [];
    }
    const json = (await response.json()) as { features?: PhotonFeature[] };

    const results: PlaceSuggestion[] = [];
    for (const feature of json.features ?? []) {
      const coords = feature.geometry?.coordinates;
      if (!coords) continue;
      const [lng, lat] = coords;
      const p = feature.properties ?? {};
      const primary = p.name ?? [p.housenumber, p.street].filter(Boolean).join(" ") ?? "";
      if (!primary) continue;
      const locality = p.city ?? p.district ?? p.county ?? "";
      const secondary = [locality, p.state].filter(Boolean).join(", ");
      const label = secondary ? `${primary}, ${secondary}` : primary;
      results.push({
        placeId: toBase64Url(JSON.stringify({ lat, lng, label } satisfies PlaceToken)),
        primary,
        secondary,
        label,
      });
      if (results.length >= 6) break;
    }

    cacheSet(key, results);
    return results;
  });

export const getPlaceLocation = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ placeId: z.string().min(3).max(300) }).parse(data))
  .handler(async ({ data }) => {
    let token: PlaceToken;
    try {
      token = JSON.parse(fromBase64Url(data.placeId)) as PlaceToken;
    } catch {
      throw new Error("Invalid place id.");
    }
    if (typeof token?.lat !== "number" || typeof token?.lng !== "number") {
      throw new Error("Invalid place id.");
    }
    return { lat: token.lat, lng: token.lng, address: token.label ?? "" };
  });

export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).parse(data),
  )
  .handler(async ({ data }) => {
    const key = `rev:${data.lat.toFixed(5)},${data.lng.toFixed(5)}`;
    const cached = cacheGet<string>(key);
    if (cached !== undefined) return { address: cached };

    const address = await throttle(async () => {
      const params = new URLSearchParams({
        lat: String(data.lat),
        lon: String(data.lng),
        format: "jsonv2",
        zoom: "18",
      });
      const response = await fetch(`${NOMINATIM_URL}?${params}`, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      });
      if (!response.ok) {
        console.error(`Nominatim reverse geocode failed [${response.status}]`);
        return "";
      }
      const json = (await response.json()) as { display_name?: string };
      return json.display_name ?? "";
    }, 1100);

    if (address) cacheSet(key, address);
    return { address };
  });

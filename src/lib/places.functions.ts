import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

function gatewayHeaders() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!lovableKey || !mapsKey) throw new Error("Google Maps is not configured.");
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": mapsKey,
    "Content-Type": "application/json",
  };
}

async function readError(response: Response) {
  const body = await response.text();
  console.error(`Google Maps gateway failed [${response.status}]: ${body}`);
  throw new Error(`Location service failed (${response.status}).`);
}

export interface PlaceSuggestion {
  placeId: string;
  primary: string;
  secondary: string;
  label: string;
}

export const autocompletePlaces = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ input: z.string().min(3).max(120) }).parse(data))
  .handler(async ({ data }): Promise<PlaceSuggestion[]> => {
    const response = await fetch(`${GATEWAY_URL}/places/v1/places:autocomplete`, {
      method: "POST",
      headers: gatewayHeaders(),
      body: JSON.stringify({
        input: data.input,
        includedRegionCodes: ["in"],
        locationBias: {
          circle: {
            center: { latitude: 11.9416, longitude: 79.8083 },
            radius: 50000,
          },
        },
      }),
    });
    if (!response.ok) await readError(response);
    const json = (await response.json()) as {
      suggestions?: Array<{
        placePrediction?: {
          placeId?: string;
          structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
          text?: { text?: string };
        };
      }>;
    };
    return (json.suggestions ?? [])
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
  });

export const getPlaceLocation = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ placeId: z.string().min(3).max(300) }).parse(data))
  .handler(async ({ data }) => {
    const response = await fetch(
      `${GATEWAY_URL}/places/v1/places/${encodeURIComponent(data.placeId)}`,
      {
        headers: {
          ...gatewayHeaders(),
          "X-Goog-FieldMask": "location,formattedAddress,displayName",
        },
      },
    );
    if (!response.ok) await readError(response);
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
  });

export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).parse(data),
  )
  .handler(async ({ data }) => {
    const response = await fetch(
      `${GATEWAY_URL}/maps/api/geocode/json?latlng=${data.lat},${data.lng}`,
      { headers: gatewayHeaders() },
    );
    if (!response.ok) await readError(response);
    const json = (await response.json()) as {
      results?: Array<{ formatted_address?: string }>;
    };
    return { address: json.results?.[0]?.formatted_address ?? "" };
  });

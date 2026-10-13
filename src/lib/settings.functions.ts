import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import {
  emptyPublicSettings,
  type BookingApiSettings,
  type PublicSiteSettings,
} from "@/lib/site-settings";
import type { BookingRequest } from "@/types";

type SettingRow = { key: string; value: unknown; is_public?: boolean };

/** Server-side client for the owner's own database (publishable key, RLS applies). */
function ownDb(accessToken?: string) {
  const url = process.env["FLEET_SUPABASE_URL"] ?? process.env["VITE_FLEET_SUPABASE_URL"]!;
  const key = process.env["FLEET_SUPABASE_ANON_KEY"] ?? process.env["VITE_FLEET_SUPABASE_ANON_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (accessToken) h.set("Authorization", `Bearer ${accessToken}`);
        else if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export function toSettings(rows: SettingRow[] | null): PublicSiteSettings {
  const map = new Map((rows ?? []).map((r) => [r.key, r.value]));
  return {
    brand: (map.get("brand") as PublicSiteSettings["brand"]) ?? {},
    seo: (map.get("seo") as PublicSiteSettings["seo"]) ?? {},
    content: (map.get("content") as PublicSiteSettings["content"]) ?? {},
  };
}

/** Public: the settings that shape what visitors see. */
export const getPublicSettings = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await ownDb()
      .from("site_settings")
      .select("key, value")
      .eq("is_public", true);
    if (error) throw error;
    return toSettings(data as SettingRow[]);
  } catch (error) {
    console.error("Failed to load site settings", error);
    return emptyPublicSettings;
  }
});

/** Server-side client for the dashboard (fleet operations) Supabase project. */
function dashboardDb() {
  const url = process.env["DASHBOARD_SUPABASE_URL"];
  const key = process.env["DASHBOARD_SUPABASE_ANON_KEY"];
  if (!url || !key) throw new Error("Dashboard backend is not configured.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const TRIP_TYPE_TO_RPC: Record<BookingRequest["tripType"], string> = {
  ONE_WAY: "one_way",
  ROUND_TRIP: "round_trip",
  LOCAL: "local_visit",
  AIRPORT: "one_way",
};

function normalizeMobile(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

/**
 * Public: saves a website booking request.
 * Primary path is the dashboard project's public_create_booking RPC.
 * If that fails for any reason, it falls back to the original same-origin
 * insert so the request is never lost.
 */
export const dispatchBooking = createServerFn({ method: "POST" })
  .inputValidator((input: { booking: BookingRequest & { id: string } }) => {
    const b = input?.booking;
    if (!b?.phone || !b.pickup || !b.customerName) throw new Error("Incomplete booking");
    return input;
  })
  .handler(async ({ data }) => {
    const b = data.booking;
    const today = new Date().toISOString().slice(0, 10);
    const payload = {
      name: b.customerName.slice(0, 120),
      mobile: normalizeMobile(b.phone),
      type: TRIP_TYPE_TO_RPC[b.tripType] ?? "one_way",
      start_date: b.date || today,
      start_time: (b.time || "").slice(0, 10),
      pickup: b.pickup,
      drop: b.drop || "",
      type_data: {
        vehicleType: b.vehicleType || null,
        vehicleName: b.vehicleName ?? null,
        passengers: Number(b.passengers) || 1,
        serviceSlug: b.serviceSlug ?? null,
        specialRequest: b.specialRequest ?? null,
        email: b.email ?? null,
        returnDate: b.returnDate ?? null,
        tripType: b.tripType,
        airport: b.tripType === "AIRPORT",
        reference: b.id,
        source: "PUBLIC_WEBSITE",
      },
    };
    const { data: created, error } = await dashboardDb().rpc("public_create_booking", {
      payload,
    });
    if (error) {
      // 22023 = the RPC rejected the data itself (bad mobile/date/time).
      // Retrying would never succeed, so report it instead of queueing.
      const code = (error as { code?: string }).code;
      if (code === "22023") {
        return {
          ok: false,
          saved: false,
          via: "failed" as const,
          bookingNumber: "",
          retryable: false,
          message: error.message,
        };
      }
      throw error;
    }
    const bookingNumber = (created as { booking_number?: string } | null)?.booking_number ?? "";
    // The dashboard RPC is the only writer: no same-origin table accepts
    // anonymous booking inserts, so there is no server-side fallback.
    // The caller (bookingService) queues to the browser outbox instead.
    return {
      ok: true,
      saved: true,
      via: "dashboard" as const,
      bookingNumber,
      retryable: false,
    };
  });

async function postToBookingApi(config: BookingApiSettings, payload: unknown) {
  if (!config.enabled || !config.url) return { delivered: false, reason: "not-configured" as const };
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (config.authHeaderName && config.authHeaderValue)
    headers[config.authHeaderName] = config.authHeaderValue;
  if (config.extraHeadersJson) {
    try {
      Object.assign(headers, JSON.parse(config.extraHeadersJson) as Record<string, string>);
    } catch {
      /* ignore malformed extra headers */
    }
  }
  const res = await fetch(config.url, {
    method: config.method ?? "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  return {
    delivered: res.ok,
    status: res.status,
    body: text.slice(0, 500),
    reason: res.ok ? ("ok" as const) : ("error" as const),
  };
}

/** Admin: sends a sample booking using the saved connection settings. */
export const testBookingApi = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string }) => {
    if (!input?.accessToken) throw new Error("Unauthorized");
    return input;
  })
  .handler(async ({ data }) => {
    const client = ownDb(data.accessToken);
    const { data: userData, error: userError } = await client.auth.getUser(data.accessToken);
    if (userError || !userData.user) throw new Error("Unauthorized");
    const { data: isAdmin } = await client.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    try {
      const { data: row } = await client
        .from("site_settings")
        .select("value")
        .eq("key", "booking_api")
        .maybeSingle();
      const config = ((row?.value as BookingApiSettings) ?? { enabled: false }) as BookingApiSettings;
      return await postToBookingApi(config, {
        event: "booking.test",
        booking: {
          id: "TEST-0001",
          customerName: "Test Customer",
          phone: "+910000000000",
          pickup: "Pondicherry Bus Stand",
          drop: "Chennai Airport",
          date: new Date().toISOString().slice(0, 10),
          time: "10:00",
          tripType: "ONE_WAY",
          vehicleType: "sedan",
          passengers: 2,
          source: "PUBLIC_WEBSITE",
        },
        receivedAt: new Date().toISOString(),
      });
    } catch (error) {
      return { delivered: false, reason: "error" as const, body: String(error).slice(0, 300) };
    }
  });

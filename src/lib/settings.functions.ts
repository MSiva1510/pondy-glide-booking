import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ADMIN_EMAIL } from "@/lib/admin-config";
import {
  emptyPublicSettings,
  type BookingApiSettings,
  type PublicSiteSettings,
} from "@/lib/site-settings";
import type { BookingRequest } from "@/types";

type SettingRow = { key: string; value: unknown; is_public?: boolean };

function serverPublicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function toSettings(rows: SettingRow[] | null): PublicSiteSettings {
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
    const supabase = serverPublicClient();
    const { data, error } = await supabase
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

async function assertAdmin(context: { supabase: ReturnType<typeof createClient>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

/** Admin: every setting, including the private booking-system connection. */
export const getAllSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { data, error } = await context.supabase.from("site_settings").select("key, value");
    if (error) throw error;
    const rows = data as SettingRow[];
    const map = new Map(rows.map((r) => [r.key, r.value]));
    return {
      public: toSettings(rows),
      bookingApi: ((map.get("booking_api") as BookingApiSettings) ?? {
        enabled: false,
      }) as BookingApiSettings,
    };
  });

export const saveSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: string; value: unknown; isPublic: boolean }) => {
    const allowed = ["brand", "seo", "content", "booking_api"];
    if (!allowed.includes(input.key)) throw new Error("Unknown setting");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase
      .from("site_settings")
      .upsert(
        { key: data.key, value: data.value as never, is_public: data.isPublic },
        { onConflict: "key" },
      );
    if (error) throw error;
    return { ok: true };
  });

/** One-time setup: creates the single admin account when none exists yet. */
export const bootstrapAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; password: string }) => {
    if (!input?.email || !input?.password || input.password.length < 8)
      throw new Error("A valid email and a password of at least 8 characters are required.");
    return input;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countError) throw countError;
    if ((count ?? 0) > 0) return { ok: false, error: "An admin account already exists." };

    if (data.email.trim().toLowerCase() !== ADMIN_EMAIL)
      return { ok: false, error: "This email address is not allowed to own the admin area." };

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: data.password,
      email_confirm: true,
    });
    if (error || !created.user) return { ok: false, error: error?.message ?? "Could not create the account." };

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: "admin" });
    if (roleError) return { ok: false, error: roleError.message };

    return { ok: true };
  });

/** Public: is the admin account set up yet? (used by the sign-in screen) */
export const adminExists = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    return { exists: (count ?? 0) > 0 };
  } catch {
    return { exists: true };
  }
});

async function loadBookingApi(): Promise<BookingApiSettings> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "booking_api")
    .maybeSingle();
  return ((data?.value as BookingApiSettings) ?? { enabled: false }) as BookingApiSettings;
}

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

/** Public: forwards a website booking request to the owner's own booking app. */
export const dispatchBooking = createServerFn({ method: "POST" })
  .inputValidator((input: { booking: BookingRequest & { id: string } }) => {
    if (!input?.booking?.phone || !input.booking.pickup) throw new Error("Incomplete booking");
    return input;
  })
  .handler(async ({ data }) => {
    try {
      const config = await loadBookingApi();
      const result = await postToBookingApi(config, {
        event: "booking.created",
        booking: data.booking,
        receivedAt: new Date().toISOString(),
      });
      return { ok: true, delivered: result.delivered };
    } catch (error) {
      console.error("Booking dispatch failed", error);
      return { ok: true, delivered: false };
    }
  });

/** Admin: sends a sample booking so the owner can verify the connection. */
export const testBookingApi = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    try {
      const config = await loadBookingApi();
      const result = await postToBookingApi(config, {
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
      return result;
    } catch (error) {
      return { delivered: false, reason: "error" as const, body: String(error).slice(0, 300) };
    }
  });

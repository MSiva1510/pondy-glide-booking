// Browser-side owner/admin actions against the owner's own database.
// Access is enforced by the database's row-level security.
import { db } from "@/integrations/fleet/client";
import { ADMIN_EMAIL } from "@/lib/admin-config";
import { toSettings, testBookingApi as testBookingApiFn } from "@/lib/settings.functions";
import type { BookingApiSettings } from "@/lib/site-settings";

type SettingRow = { key: string; value: unknown };

export async function adminExists() {
  const { data, error } = await db.rpc("admin_exists");
  if (error) return { exists: true };
  return { exists: Boolean(data) };
}

export async function bootstrapAdmin(input: { email: string; password: string }) {
  if (input.password.length < 8)
    return { ok: false, error: "Password must be at least 8 characters." };
  if (input.email.trim().toLowerCase() !== ADMIN_EMAIL)
    return { ok: false, error: "This email address is not allowed to own the admin area." };
  const { data, error } = await db.auth.signUp({
    email: ADMIN_EMAIL,
    password: input.password,
    options: { emailRedirectTo: `${window.location.origin}/auth` },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, needsConfirmation: !data.session };
}

async function assertAdmin() {
  const { data: u } = await db.auth.getUser();
  if (!u.user) throw new Error("Unauthorized");
  const { data } = await db.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export async function getAllSettings() {
  await assertAdmin();
  const { data, error } = await db.from("site_settings").select("key, value");
  if (error) throw error;
  const rows = (data ?? []) as SettingRow[];
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    public: toSettings(rows),
    bookingApi: ((map.get("booking_api") as BookingApiSettings) ?? { enabled: false }) as BookingApiSettings,
  };
}

export async function saveSetting(input: { key: string; value: unknown; isPublic: boolean }) {
  if (!["brand", "seo", "content", "booking_api"].includes(input.key)) throw new Error("Unknown setting");
  const { error } = await db
    .from("site_settings")
    .upsert({ key: input.key, value: input.value, is_public: input.isPublic }, { onConflict: "key" });
  if (error) throw error;
  return { ok: true };
}

export async function testBookingApi() {
  const { data } = await db.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Please sign in again.");
  return testBookingApiFn({ data: { accessToken: token } });
}

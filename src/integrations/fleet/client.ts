// Browser client for the owner's own database (all site data lives here).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env["VITE_FLEET_SUPABASE_URL"] as string;
const key = import.meta.env["VITE_FLEET_SUPABASE_ANON_KEY"] as string;

let client: SupabaseClient | undefined;

function getClient(): SupabaseClient {
  if (!client) {
    const isBrowser = typeof window !== "undefined";
    client = createClient(url, key, {
      auth: {
        storage: isBrowser ? window.localStorage : undefined,
        persistSession: isBrowser,
        autoRefreshToken: isBrowser,
        storageKey: "sri-jayam-owner-auth",
      },
    });
  }
  return client;
}

export const db: SupabaseClient = new Proxy({} as SupabaseClient, {
  get: (_t, prop) => Reflect.get(getClient(), prop as keyof SupabaseClient),
});

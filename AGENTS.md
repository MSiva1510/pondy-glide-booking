# Pondy Glide Booking

TanStack Start + Vite + Tailwind CSS v4 + Supabase. Package manager is bun
(`bun.lock`). Netlify deploys with `NITRO_PRESET=netlify`.

- Do not rewrite published git history (no force-push / rebase of pushed commits).
- Maps are Leaflet + OpenStreetMap, geocoding is Photon + Nominatim. No API keys,
  no billing. Respect Nominatim's 1 req/s policy (server code already throttles).
- Keep `main` in a working state.

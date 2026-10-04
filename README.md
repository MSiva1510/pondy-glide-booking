# Sri Jayam Travels — Pondicherry Cab Booking Website

Customer-facing booking website for **Sri Jayam Travels**, a Pondicherry-based
cab, taxi and car-rental service. The tagline says it all:

> Need a cab in Pondicherry? Book it quickly, travel comfortably, and let us
> handle the journey.

## What this site does

- **Online booking flow** — customers enter pickup, destination, date and trip
  details, pick a vehicle, and submit a booking request.
- **Fleet showcase** — Swift Dzire (4+1), Kia Carens (6+1) and Toyota Innova
  (7 seater) with per-km rates and features.
- **Services** — local cabs, airport transfers, round trips, outstation cabs,
  car rental and corporate travel.
- **Transparent pricing** — local packages, day rentals, airport transfers and
  outstation rates.
- **WhatsApp fallback** — every booking can also go through WhatsApp
  (+91 94423 37470) if the customer prefers.
- **Admin area** — manage site content, branding and SEO settings.

Until the backend is connected, the site runs on a clean mock service layer, so
the real integration can be added later without rebuilding the frontend.
Bookings are structured to be sent straight to the Fleet Management Web App /
API (the internal operations system — customers never see that dashboard).

## Pages

Home, Booking, Cars, Services, Pricing, About, Contact, Sign in, Privacy
Policy, Terms, plus an authenticated Admin section.

## Maps — Google Maps Platform (free tier)

- Map picker: **Maps JavaScript API**
- Address autocomplete + place details: **Places API (new)**
- Reverse geocoding: **Geocoder** (JS API)
- Contact-page embed: **Maps Embed API** (unlimited free)

Usage stays inside Google's free caps (10,000 calls/month per service). The
browser key in `.env` is locked down with HTTP-referrer and API restrictions,
so it only works from your domains.

## Tech stack

TanStack Start · React 19 · Vite · Tailwind CSS v4 · Supabase · TypeScript.
Package manager is **bun**. Deploys to **Vercel** only — see
`DEPLOY-VERCEL.md`.

## Development

```sh
git clone <this-repository-url>
cd pondy-glide-booking
bun install
bun run dev
```

(`npm i` / `npm run dev` also work.)

## Environment

Copy `.env.example` to `.env`:

| Variable | Purpose |
| --- | --- |
| `VITE_FLEET_API_URL` | Fleet Management API base URL. Leave empty to run on mock data. |
| `VITE_FLEET_SUPABASE_URL` / `VITE_FLEET_SUPABASE_PROJECT_ID` / `VITE_FLEET_SUPABASE_ANON_KEY` | Owner's backend (fleet / booking web app). |
| `VITE_GOOGLE_MAPS_BROWSER_KEY` | Google Maps browser key (Maps JS + Places + Geocoding enabled, referrer-restricted). Also set it in Vercel env vars for deploys. |
| `CRON_SECRET` | Bearer secret for scheduled cron routes. |

## Scripts

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the dev server (http://localhost:8080) |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run format` | Prettier |

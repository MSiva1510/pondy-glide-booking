# Deploying Sri Jayam Travels to Vercel

This folder is ready to deploy on Vercel. The site is a full-stack React app
(TanStack Start) — Vercel builds it with the Nitro `vercel` preset and runs
the server part as Vercel Functions automatically (output in `.vercel/output`).

## Deploy from the Vercel dashboard

1. Push this folder to a GitHub / GitLab / Bitbucket repository.
2. In Vercel: **Add New → Project** and import the repo.
3. Build settings (Vercel usually detects these; set them if it doesn't):
   - Framework Preset: **Other**
   - Install Command: `bun install` (auto-detected from `bun.lock`)
   - Build Command: `bun run build`
   - Output Directory: leave default (`.vercel/output` is picked up automatically)
4. Add the **Environment variables** below, then click **Deploy**. Done — your
   site is live on a `*.vercel.app` URL.

## Environment variables

Add every key from `.env` in **Project → Settings → Environment Variables**
(Vercel redeploys automatically when you change them):

- `VITE_GOOGLE_MAPS_BROWSER_KEY` — Google Maps browser key
- `VITE_SUPABASE_*` / `SUPABASE_*` — site database
- `VITE_FLEET_*` / `FLEET_*` — owner's fleet backend (leave empty for mock data)
- `CRON_SECRET` — bearer secret for scheduled cron routes

## Google Maps key restriction

The Google Maps browser key is restricted to specific website addresses.
After your first deploy, add your Vercel address (e.g.
`https://your-site.vercel.app/*`, plus your custom domain later) to the key's
allowed referrers in Google Cloud Console, otherwise the map picker will show
an error on the live site.

## After deploy

- Set the real website address in `/admin` → **siteUrl** (used for canonical
  links and SEO). The default is blank until then.
- The private owner sign-in lives at `/auth` and the settings dashboard at
  `/admin`. These work on Vercel exactly as they do here — they talk to the
  same cloud backend.

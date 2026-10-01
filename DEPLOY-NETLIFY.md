# Deploying Sri Jayam Travels to Netlify

This folder is ready to deploy on Netlify. The site is a full-stack React app
(TanStack Start) — Netlify builds it and runs the server part as a Netlify
Function automatically.

## Option A — Deploy from the Netlify dashboard (easiest)

1. Unzip this folder and push it to a GitHub / GitLab / Bitbucket repository
   (or drag the unzipped folder into Netlify Drop — see Option B).
2. In Netlify: **Add new site → Import an existing project** and pick the repo.
3. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `.netlify/functions-internal`
   - Node 22, `NITRO_PRESET=netlify`
4. Click **Deploy**. Done — your site is live on a `*.netlify.app` URL.

## Option B — Netlify Drop (no Git)

1. Run `npm install` then `npm run build` on your computer (needs Node 22+).
2. Drag the whole project folder onto https://app.netlify.com/drop —
   Netlify picks up `dist/` and the function from `netlify.toml`.

## Environment variables

The included `.env` file already contains the public keys the site needs
(database connection and Google Maps browser key), so the build works as-is.
If you ever rotate keys, update them in **Site settings → Environment
variables** on Netlify instead of editing the file.

## Google Maps key restriction

The Google Maps browser key is restricted to specific website addresses.
After your first deploy, add your Netlify address (e.g.
`https://your-site.netlify.app/*`) to the key's allowed referrers in
Google Cloud Console, otherwise the map picker will show an error on the
live site.

## Admin / owner area

The private owner sign-in lives at `/auth` and the settings dashboard at
`/admin`. These work on Netlify exactly as they do here — they talk to the
same cloud backend.

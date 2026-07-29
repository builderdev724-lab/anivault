# AniVault

A React + Vite app for backing up an anime watchlist (title + status) scraped from any
streaming site's page source, stored locally on-device, with a Home page, a full
searchable/filterable list page, a splash screen, and a bottom nav — packaged as an
installable PWA so it can be added to a phone home screen.

## Project structure

```
anivault-react/
├── index.html
├── vite.config.js          # includes vite-plugin-pwa for installability
├── package.json
├── public/
│   ├── icon-192.png
│   └── icon-512.png
└── src/
    ├── main.jsx             # router + mount
    ├── App.jsx               # layout: splash, routes, bottom nav
    ├── styles/theme.css       # cream / anime-inspired theme
    ├── hooks/useAnimeList.js  # state + localStorage persistence
    ├── utils/parseHTML.js     # page-source parser + CSV export
    ├── components/
    │   ├── Splash.jsx
    │   ├── BottomNav.jsx
    │   ├── StatCard.jsx
    │   └── AnimeCard.jsx
    └── pages/
        ├── Home.jsx           # stats, import box, recent preview
        └── ListPage.jsx        # full filterable/searchable list
```

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. On your phone, connect to the same Wi-Fi and open
`http://<your-computer-ip>:5173` to test on-device (Vite prints the network URL when you
run `dev` — add `-- --host` if it doesn't show automatically: `npm run dev -- --host`).

## Build for production

```bash
npm run build
```

Outputs static files to `dist/` — this is a plain static site, so it can be hosted
anywhere (Vercel, Netlify, GitHub Pages, Cloudflare Pages, or your own server). No
backend needed; all data stays in the browser's `localStorage` on whatever device opens it.

Preview the production build locally:

```bash
npm run preview
```

## Deploying (get a public URL)

Easiest option — **Vercel**, free, no config needed for a Vite app:

```bash
npm install -g vercel
cd anivault-react
vercel
```
Follow the prompts (link/create a project, accept defaults). It detects Vite automatically
and gives you a live URL like `https://anivault-yourname.vercel.app` in under a minute.
Run `vercel --prod` for the permanent production URL.

Alternatives, same idea:
- **Netlify:** `npm install -g netlify-cli` → `netlify deploy --prod` (build command `npm run build`, publish dir `dist`)
- **GitHub Pages / Cloudflare Pages:** push the repo, point the host at `npm run build` with output dir `dist`

All of these are static hosts — no backend/server needed, and all are free for a project this size.

## Installing on your phone

Once deployed:
- **iPhone (Safari):** open the URL → tap the **Share** icon → **Add to Home Screen**
- **Android (Chrome):** open the URL → tap the **⋮** menu → **Add to Home screen** / **Install app**

Because of the PWA manifest (`vite-plugin-pwa`), it installs with its own icon and opens
full-screen without browser chrome, like a native app.

## Installing on your PC (Windows/Mac/Linux)

Any Chromium-based browser (Chrome, Edge, Brave) can install PWAs as desktop apps:
1. Open the deployed URL in the browser
2. Look for the **install icon** in the address bar (a monitor with a down arrow, usually
   on the right side of the address bar) — or open the **⋮** menu → **Install AniVault...**
3. Confirm — it installs as a standalone window with its own icon in your Start Menu / Dock /
   Applications, launching without browser tabs or address bar

## Testing without deploying first

You don't have to deploy to try it out:
```bash
npm run dev -- --host
```
This prints a `Network:` URL (e.g. `http://192.168.1.42:5173`). Open that on your phone while
on the same Wi-Fi to test the real mobile layout before you deploy anywhere.

## Notes

- **Storage is per-browser, per-device.** `localStorage` doesn't sync across devices or
  browsers — use the **Download CSV** button on the list page as a portable backup.
- **HashRouter** is used (`/#/list` instead of `/list`) so routing works correctly on
  static hosts without needing server-side rewrite rules.
- The import parser (`src/utils/parseHTML.js`) works by scanning for short text nodes
  matching common status words (Watching/Planned/On-Hold/Dropped/Watched) and walking up
  the DOM to find the nearest title link — it's heuristic, so always spot-check results
  before exporting. If a particular site's markup trips it up, that function is the only
  place you'd need to tweak.

# Zakat Calculator

Independent Astro 7.4.2 static application, developed and built with Bun 1.4.4.

This version introduces the app only. The calculator is not yet available: the zakat method, its sources and the nisab options are still being verified, and nothing is calculated on the home page.

## Run

```powershell
bun install --frozen-lockfile
bun run dev
```

Local development uses http://127.0.0.1:4341.

## Verify and build

```powershell
bun run check
bun test
bun run build
bun run preview
```

## Cloudflare Pages

Use this folder as the Pages project root. Build command: `bun install --frozen-lockfile && bun run build`. Output directory: `dist`. Set `BUN_VERSION=1.4.4` in the build environment. The app has no server adapter, Functions, bindings, database, secrets or runtime API calls. It is not yet deployed; the production project is planned in the P7 plan (T7.8).

## Content

Method content, sources and the status of verification are described at `/sources/`. The checked-in state is in `src/data/provenance.json`. The app has no social card image yet.

Original application code is MIT licensed. See `/privacy/` for browser storage.

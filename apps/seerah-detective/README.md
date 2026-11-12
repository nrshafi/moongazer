# Seerah Detective

Independent Astro 7.4.2 static application, developed and built with Bun 1.4.4.

## Run

```powershell
bun install --frozen-lockfile
bun run dev
```

Local development uses http://127.0.0.1:4323.

## Verify and build

```powershell
bun run check
bun test
bun run build
bun run preview
```

## Cloudflare Pages

Use this folder as the Pages project root. Build command: `bun install --frozen-lockfile && bun run build`. Output directory: `dist`. Set `BUN_VERSION=1.4.4` in the build environment. No server adapter, Functions, bindings, database, secrets, or runtime API access are required. You can also upload the contents of `dist` with Pages Direct Upload after building locally.

The folder is self-contained. Its canonical content snapshot is checked in under `src/data`; ordinary builds do not fetch remote content. Source methodology and provenance are available at `/sources/`. The collection-level `_implementation` directory contains development-time retrieval and content-preparation tools. It is not part of the deployable site.

Local progress is optional and expires on read after 30 days. Theme and storage controls work independently of activity progress. See `/privacy/`.

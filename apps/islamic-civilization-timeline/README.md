# Civilization Timeline

Explore connected histories across regions, with dates and evidence in view.

Independent Astro 7.4.2 / Bun 1.4.4 project.

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun test
bun run build
bun run preview
```

Port 4336. Cloudflare Pages project root `apps/islamic-civilization-timeline`, output `dist`, build `bun install --frozen-lockfile && bun run build`, environment `BUN_VERSION=1.4.4`. Host at the domain root. No adapter, secrets, backend or live content API.

24 institutional-source records, regional map and filters, overlapping date bands, comparison, bookmarks and event pages.

Historical periods and monuments are selected examples, not a complete history or religious endorsement of a dynasty. Preserve date ranges and institutional attribution.

Read AGENTS.md and context/ before implementation. Sources and privacy pages explain content editions, reuse and temporary optional localStorage. Release ZIPs are produced at repository level.

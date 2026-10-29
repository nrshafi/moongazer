# Islamic Misinformation Casebook

Inspect a claim, open the evidence, and decide what the sources support.

Independent Astro 7.4.2 / Bun 1.4.4 project.

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun test
bun run build
bun run preview
```

Port 4340. Cloudflare Pages project root `apps/islamic-misinformation-casebook`, output `dist`, build `bun install --frozen-lockfile && bun run build`, environment `BUN_VERSION=1.4.4`. Host at the domain root. No adapter, secrets, backend or live content API.

12 bounded reading claims with evidence cards, classification checks, precise corrections, source links, bookmarks and citation-rich sharing.

Claims are constructed source-reading exercises, not measured viral trends or allegations against people. A report omitting a detail does not prove that no other source mentions it. No live fact-checking of arbitrary claims.

Read AGENTS.md and context/ before implementation. Sources and privacy pages explain content editions, reuse and temporary optional localStorage. Release ZIPs are produced at repository level.

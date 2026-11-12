# Places in the Quran

Read the passages, explore the geography, and see what remains uncertain.

Independent Astro 7.4.2 static app using Bun 1.4.4.

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun test
bun run build
```

Port 4331. Cloudflare Pages project root `apps/places-in-the-quran`, build command `bun install --frozen-lockfile && bun run build`, output `dist`, environment `BUN_VERSION=1.4.4`. No adapter, server, secrets, account, or runtime external API. Host at the root of its own domain or Pages project.

Each project bundles its fonts and content, light/dark themes, citations, privacy controls and 404 page. Optional localStorage expires on access after 30 days. Quran text and commentary were fetched through the official Quran MCP. See the Sources page and `src/data/provenance.json` for editions, editorial limits and media attribution. Build outputs are packaged in `release/places-in-the-quran-pages.zip` at repository level.

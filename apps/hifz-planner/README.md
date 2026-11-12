# Hifz Planner

Estimate new memorization and revision time for your week

Independent Astro 7 static app. Bun 1.4.4 is the build/runtime tool.

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun test
bun run build
```

Development: port 4326. Cloudflare Pages root: `apps/hifz-planner`; build: `bun run build`; output: `dist`. Set `BUN_VERSION=1.4.4`. No environment secrets, adapters, Functions, databases, or accounts. For direct upload use the corresponding ZIP in the repository release directory.

Content and source provenance live in `src/data`. Canonical text was fetched through the official Quran MCP at https://mcp.quran.ai. See the in-app Sources page for editions and editorial limits. Optional browser data expires on access after 30 days and can be cleared through the footer.

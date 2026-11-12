# Is It in the Quran?

Check wording against the Arabic Quran and Pickthall translation.

Independent Astro 7 static app. Bun 1.4.4 is the build/runtime tool.

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun test
bun run build
```

Development: port 4327. Cloudflare Pages root: `apps/is-it-in-the-quran`; build: `bun run build`; output: `dist`. Set `BUN_VERSION=1.4.4`. No environment secrets, adapters, Functions, databases, or accounts. For direct upload use the corresponding ZIP in the repository release directory.

Content and source provenance live in `src/data`. Canonical text was fetched through the official Quran MCP at https://mcp.quran.ai. See the in-app Sources page for editions and editorial limits. Optional browser data expires on access after 30 days and can be cleared through the footer.

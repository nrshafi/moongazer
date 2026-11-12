# Parables of the Quran agent instructions

This app also inherits the repository-level instructions when used inside the portfolio. Its local context is self-contained so the app folder can be copied independently.

## Required context

At the start of work in this scope, read these files in order. Reuse them within the same working context and reread files that change.

1. `context/project-overview.md`
2. `context/architecture.md`
3. `context/ui-context.md`
4. `DESIGN.md`
5. `context/code-standards.md`
6. `context/ai-workflow-rules.md`
7. `context/progress-tracker.md`

If a requested change alters scope, architecture, storage or standards, update the affected context before implementing the dependent change. A documentation update is not authorization to add product features.

## Documentation and API verification

- Inspect the relevant `package.json`, `bun.lock` and installed version before dependency-sensitive work. Keep current pins unless the requested task needs a change.
- Reuse matching official documentation already retrieved for the installed version. For a new or unfamiliar pattern, check the package CLI/help, then a documentation MCP such as Context7, then the official website. Resolve a library identifier before querying it when the identifier is not already verified.
- Installed types, interfaces and the checker establish what the installed package supports. Verify unfamiliar CLI flags with help instead of guessing. Read the official migration guide before a major-version migration.
- Core language built-ins do not require repetitive documentation lookups. Documentation-only edits do not require framework research when they describe inspected local files.
- If documentation is unavailable, use verified installed interfaces and existing working examples where sufficient. Do not invent an API. Record the limitation and pause only the dependent change; continue independent authorized work.
- Record the documentation URL, MCP query, CLI help command or inspected type definition when introducing a new API pattern or configuration.

## Scope and completion

- Work directly by default. Do not introduce a requirement to delegate or spawn agents. Respect the user's current authorization and applicable tool instructions.
- Resolve routine implementation details with the existing product constraints. Ask for clarification only when missing information materially blocks the work; record the decision in context.
- Keep the six context files synchronized with meaningful changes. Update `context/progress-tracker.md` with an Asia/Dhaka timestamp, actual validation, remaining work and material limitations.
- Do not hand-edit `node_modules/`, `.astro/`, `dist/` or release ZIP contents. Edit authoritative sources, then regenerate the affected output when needed. Do not modify dependency internals in place.
- Reuse verified source snapshots. Fetch missing Quran text/commentary through Quran MCP, preserve canonical quotations and edition attribution, and keep editorial exercises distinct from scholarly claims. Do not replace primary sources with personal blogs.
- Complete the authorized scope and report concrete changes and verification. Do not claim deployment, fresh tests or independent scholarly review that did not occur.

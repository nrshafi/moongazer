---
name: bun
description: "Build, configure, test, typecheck, format, or migrate projects using Bun. Use for Bun upgrades, package management, native TypeScript scripts, Bun.WebView checks, parallel tasks, and bun:test."
---

# Bun development and migration

Use Bun for runtime tooling where the installed version supports the required behavior. Verify compatibility and measure performance before replacing an existing tool.

When working with Bun, do not guess API signatures, flags, or configuration options. Use the CLI `--help` flags, installed type definitions (`node_modules/@types/bun`), or official documentation.

---

## Tooling replacements

| Instead of | Use Bun native | Discovery command or lookup |
|---|---|---|
| `npm`, `yarn`, `pnpm` | Package manager | `bun --help`, `bun add --help`, `bun pm --help` |
| `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` | `bun.lock` | Generated on `bun install` |
| `tsx`, `ts-node`, `babel-node` | TypeScript runtime | `bun run path/to/script.ts` |
| `concurrently`, `npm-run-all` | Parallel script runner | `bun run --help` (check `--parallel`) |
| `jest`, `vitest`, `ts-jest` | Native test runner | `bun test --help`, search `bun:test` types |
| `tsc --noEmit` | Native type checker | `bun check --help`; compare diagnostics with the installed TypeScript version |
| Prettier or oxfmt | Built-in formatter | `bun fmt --help`, `bun fmt --doctor`; compare output and timings on the same files |
| `dotenv`, `cross-env` | Built-in `.env` loader | Bun loads `.env` files automatically |
| `fs-extra`, `rimraf` | Native file APIs | Check `Bun.file`, `Bun.write` in `@types/bun` |
| `setTimeout` promises, `delay` | Native timer | Check `Bun.sleep` in `@types/bun` |
| `child_process.exec`, `cross-spawn` | Subprocesses | Check `Bun.spawn` in `@types/bun` |
| Heavy browser binaries for basic capture | OS Webview | Check `Bun.WebView` in `@types/bun` |
| Blanket postinstall scripts | Lifecycle security | `bun pm --help` (check `allowScripts` in `package.json`) |

---

## Verify APIs and documentation

1. Inspect `package.json`, installed versions, lockfiles, runtime pins and existing scripts. Run `<command> --help` to inspect supported flags and subcommands:
   - `bun --help` (general runtime options)
   - `bun install --help` (install and linking flags)
   - `bun add --help` (dependency options)
   - `bun test --help` (test runner flags, matchers, timeouts)
   - `bun pm --help` (package management, lockfile, cache, allowScripts)
   - `bun check --help` and `bun fmt --help` (native checking and formatting)
2. **Local Type Definitions as Ground Truth.** Check installed declarations:
   - `node_modules/@types/bun/index.d.ts` for all `Bun.*` globals and `bun:test` exports.
   - Follow re-exports into `node_modules/bun-types` when necessary.
   - Run the project's typecheck script to validate contracts.
3. **Documentation Retrieval.** When investigating advanced configurations or runtime behaviors:
   - Context7 MCP: Call `resolve-library-id` with `bun`, then `query-docs`.
   - Official Documentation: Visit `bun.sh/docs` via URL fetch or targeted web search.

---

## Native checking and formatting

`bun check` can run a package script named `check`. If that script launches `typecheck`, use `"typecheck": "bun check --no-script"` to avoid recursion. Preserve combined checks such as `"check": "bun run --parallel typecheck test"`.

The native checker follows TypeScript 7 behavior regardless of the installed TypeScript version. Compare diagnostics and project coverage before switching. Keep TypeScript when editors, declaration emit or other tooling need it. `bun test --check` checks test files and their imports, so it does not replace a whole-project check.

`bun fmt` can read existing Prettier and oxfmt configs. Use `--check` for comparison without writes and `--doctor` to inspect configuration support. Check ignore patterns, generated files and representative CSS/TSX output. Benchmark the same file set, with warm-up and repeated alternating runs, before claiming a speed improvement. Keep the existing formatter when it performs better or its output is required. `--staged` rewrites files and stages them again; use it only within an authorized commit workflow.

## Migration and upgrade workflow

1. Preserve existing lockfiles while checking Bun's supported migration path. Let Bun migrate pinned versions before removing superseded files. Do not delete `node_modules` or lockfiles as a routine first step.
2. Replace tools incrementally. Remove dependencies only after verifying equivalent behavior and checking their remaining consumers. Environment loading, test mocks and test setup need compatibility checks.
3. Add Bun types if needed and list required types explicitly in `tsconfig.json`. Inspect installed declarations before adopting newer runtime APIs.
4. Align `packageManager`, local runtime configuration and accessible CI/build configuration on the verified Bun version. A local pin does not confirm the remote builder's version.
5. Preserve the dependency lockfile for runtime-only upgrades. Verify with `bun install --frozen-lockfile`. Review lifecycle-script requirements rather than granting blanket trust.
6. Run the project's combined checks and production build. For UI/runtime changes, use Bun.WebView for console errors, rendered DOM assertions, responsive screenshots and relevant user flows. Use disposable storage for mutations.

## References

- [Bun 1.4.4 release](https://bun.sh/blog/bun-v1.4.4)
- [Native type checker](https://bun.com/docs/runtime/check)
- [Formatter](https://bun.com/docs/format)
- [Package manager](https://bun.com/docs/pm/cli/install)
- [WebView](https://bun.com/docs/runtime/webview)

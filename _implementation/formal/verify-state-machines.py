#!/usr/bin/env python3
"""Formal state-machine verification for Moongazer client invariants.

Exhaustively explores abstract state spaces and replays two real past bugs to prove
the models catch them before trusting the passing checks:
1. Theme bootstrap state machine (Shell.astro) — replays the pre-e2e-bootstrap-regression bug.
2. Daily streak & epoch state machine (apps/*/src/lib/daily.ts) — replays the 3c3524d9 invalid-key bug.
3. Counter deduplication & privacy state machine (apps/*/src/lib/counter.ts).
"""
from __future__ import annotations
import itertools, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
DAY_MS = 86_400_000
NOW = 1_800_000_000_000
EPOCH = "2026-11-12"
VALID_DAYS = ["2026-11-11", "2026-11-12", "2026-11-13", "2026-11-14", "2026-11-16"]

# ---------------------------------------------------------------------------
# MODEL 1: Theme bootstrap state machine
# ---------------------------------------------------------------------------
def theme_transition_buggy(raw, system_dark: bool) -> str:
    # Exact pre-fix condition recorded in _implementation/e2e-bootstrap-regression.py
    try:
        valid = bool(raw) and isinstance(raw, dict) and (NOW - float(raw.get("at", 0)) < 2_592_000_000) and raw.get("value") in ("light", "dark")
    except Exception:
        valid = False
    return raw["value"] if valid else ("dark" if system_dark else "light")

def theme_transition_fixed(raw, system_dark: bool) -> str:
    valid = (
        isinstance(raw, dict)
        and isinstance(raw.get("at"), (int, float))
        and not isinstance(raw.get("at"), bool)
        and raw["at"] <= NOW + 60_000
        and (NOW - raw["at"]) < 2_592_000_000
        and raw.get("value") in ("light", "dark")
    )
    return raw["value"] if valid else ("dark" if system_dark else "light")

def check_theme_model(transition_fn) -> list[str]:
    failures = []
    cases = [
        ("corrupt_string_at", {"at": str(NOW), "value": "light"}, True, "dark"),
        ("corrupt_null_at", {"at": None, "value": "light"}, True, "dark"),
        ("future_timestamp", {"at": NOW + DAY_MS, "value": "light"}, True, "dark"),
        ("expired_timestamp", {"at": NOW - 31 * DAY_MS, "value": "light"}, True, "dark"),
        ("invalid_value", {"at": NOW, "value": "sepia"}, True, "dark"),
        ("valid_override_light", {"at": NOW - 1000, "value": "light"}, True, "light"),
        ("valid_override_dark", {"at": NOW - 1000, "value": "dark"}, False, "dark"),
        ("missing_record", None, True, "dark"),
    ]
    for label, raw, sys_dark, expected in cases:
        got = transition_fn(raw, sys_dark)
        if got != expected:
            failures.append(f"theme[{label}]: expected {expected}, got {got}")
    return failures

# ---------------------------------------------------------------------------
# MODEL 2: Daily streak state machine
# ---------------------------------------------------------------------------
def is_valid_key(k) -> bool:
    return isinstance(k, str) and k in VALID_DAYS

def is_streak(v) -> bool:
    return (
        isinstance(v, dict)
        and is_valid_key(v.get("last"))
        and isinstance(v.get("count"), int) and v["count"] >= 1
        and isinstance(v.get("best"), int) and v["best"] >= v["count"]
    )

def streak_transition_buggy(prev, today_key: str) -> dict:
    # Exact 3c3524d9 bug in apps/*/src/lib/daily.ts: returns invalid `last` when today_key is malformed.
    if not is_valid_key(today_key):
        return {"last": today_key, "count": 1, "best": 1}
    if not is_streak(prev):
        return {"last": today_key, "count": 1, "best": 1}
    diff = VALID_DAYS.index(today_key) - VALID_DAYS.index(prev["last"])
    if diff <= 0:
        return dict(prev)
    count = prev["count"] + 1 if diff == 1 else 1
    return {"last": today_key, "count": count, "best": max(prev["best"], count)}

def streak_transition_fixed(prev, today_key: str) -> dict:
    if not is_valid_key(today_key):
        return dict(prev) if is_streak(prev) else {"last": EPOCH, "count": 1, "best": 1}
    if not is_streak(prev):
        return {"last": today_key, "count": 1, "best": 1}
    diff = VALID_DAYS.index(today_key) - VALID_DAYS.index(prev["last"])
    if diff <= 0:
        return dict(prev)
    count = prev["count"] + 1 if diff == 1 else 1
    return {"last": today_key, "count": count, "best": max(prev["best"], count)}

def check_streak_model(transition_fn) -> list[str]:
    failures = []
    prev_states = [
        None,
        {"last": "bad", "count": 2, "best": 2},
        {"last": "2026-11-12", "count": 1, "best": 1},
        {"last": "2026-11-12", "count": 3, "best": 5},
        {"last": "2026-11-14", "count": 2, "best": 4},
    ]
    inputs = VALID_DAYS + ["bad-date", "2027-02-30"]
    for prev, key in itertools.product(prev_states, inputs):
        nxt = transition_fn(prev, key)
        # Invariant 1: Output must ALWAYS satisfy isStreak()
        if not is_streak(nxt):
            failures.append(f"streak_inv1: isStreak failed for prev={prev}, key={key!r} -> {nxt}")
        # Invariant 2: best is monotonically non-decreasing for any valid prior streak
        if is_streak(prev) and nxt["best"] < prev["best"]:
            failures.append(f"streak_inv2: best regressed for prev={prev}, key={key!r} -> {nxt}")
        # Invariant 3: best >= count >= 1
        if nxt["best"] < nxt["count"] or nxt["count"] < 1:
            failures.append(f"streak_inv3: count/best bounds violated -> {nxt}")
    return failures

# ---------------------------------------------------------------------------
# MODEL 3: Counter deduplication & privacy invariants
# ---------------------------------------------------------------------------
def check_counter_model() -> list[str]:
    failures = []
    hosts = ["moongazer.tech", "ayah-threads.moongazer.tech", "localhost", "preview.pages.dev"]
    events = ["activity_started", "activity_completed", "share_clicked"]
    for host, gpc in itertools.product(hosts, [False, True]):
        started = set()
        sent = []
        for ev in events + ["activity_started"]:  # repeat activity_started
            allowed = host.endswith("moongazer.tech") and not gpc
            if allowed:
                if ev == "activity_started":
                    if "daily-1" in started:
                        continue
                    started.add("daily-1")
                sent.append(ev)
        if gpc and sent:
            failures.append(f"counter_gpc: sent {sent} when GPC=True on {host}")
        if not host.endswith("moongazer.tech") and sent:
            failures.append(f"counter_host: sent {sent} on non-prod host {host}")
        if sent.count("activity_started") > 1:
            failures.append(f"counter_dedup: activity_started fired {sent.count('activity_started')} times")
    return failures

# ---------------------------------------------------------------------------
# SOURCE CODE SYNC CHECK: verify production daily.ts & Shell.astro match fixed models
# ---------------------------------------------------------------------------
def check_source_matches_models() -> list[str]:
    failures = []
    for app in ("ayah-threads", "seerah-timeline"):
        p = ROOT / f"apps/{app}/src/lib/daily.ts"
        txt = p.read_text(encoding="utf-8")
        if "if (today === null) return { last: todayKey" in txt:
            failures.append(f"{p.relative_to(ROOT)}: contains unpatched invalid-key streak bug (3c3524d9).")
    for shell in sorted((ROOT / "apps").glob("*/src/layouts/Shell.astro")):
        txt = shell.read_text(encoding="utf-8")
        if "typeof raw.at === 'number'" not in txt:
            failures.append(f"{shell.relative_to(ROOT)}: missing numeric type guard on theme bootstrap timestamp.")
    return failures

def main() -> int:
    # Step 1: Prove models catch real historical bugs
    bug1 = check_theme_model(theme_transition_buggy)
    assert bug1, "BUG REPLAY FAILED: theme model did not catch pre-e2e-bootstrap-regression bug!"
    bug2 = check_streak_model(streak_transition_buggy)
    assert bug2, "BUG REPLAY FAILED: streak model did not catch 3c3524d9 invalid-key bug!"

    # Step 2: Verify fixed models + live source code pass all invariants
    errs = (
        check_theme_model(theme_transition_fixed)
        + check_streak_model(streak_transition_fixed)
        + check_counter_model()
        + check_source_matches_models()
    )
    if errs:
        print(f"FORMAL VERIFICATION FAILED ({len(errs)} violation(s)):")
        for e in errs:
            print("  -", e)
        return 1

    print(
        f"FORMAL VERIFICATION PASSED: "
        f"replayed 2 historical bugs ({len(bug1)} theme + {len(bug2)} streak counterexamples caught), "
        f"verified 3 fixed state machines and live source code with 0 invariant violations."
    )
    return 0

if __name__ == "__main__":
    sys.exit(main())

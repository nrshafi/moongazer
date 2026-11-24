#!/usr/bin/env python3
"""Structural content hygiene linter for Moongazer production JSON files.

Blocks recurring mistakes identified across R1-R7:
1. Internal build/MCP/research leaks shipped into production JSON.
2. Retired pre-R3B app names ("Quran Connections", "Quran Concept Atlas", "Timeline Challenge").
3. Methodology count drift against actual array lengths.
4. SEO catalog and learning-guide drift between deployment/ and apps/*/src/data/.
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

INTERNAL_LEAKS = [
    (r"_implementation/", "Remove internal repository path '_implementation/' from production JSON."),
    (r"\bgrounding_nonce\b", "Strip internal MCP 'grounding_nonce' metadata from production JSON."),
    (r"\bquranMcpCalls\b", "Strip internal MCP call logs ('quranMcpCalls') from production JSON."),
    (r"\bP\d+\s+T\d+\.\d+\b", "Remove internal task ID (e.g. 'P7 T7.11') from production JSON."),
    (r"\brate_limited\b", "Strip internal fetch/retry log ('rate_limited') from production JSON."),
    (r"\bverification\.json\b", "Remove internal verification-file reference from production JSON."),
    (r"\bclient code\b", "Remove developer jargon ('client code') from user-facing methodology text."),
]

RETIRED_NAMES = [
    (r"\bQuran Connections\b", "Replace retired name 'Quran Connections' with 'Ayah Threads'."),
    (r"\bQuran Concept Atlas\b", "Replace retired name 'Quran Concept Atlas' with 'Ayah Threads'."),
    (r"\bTimeline Challenge\b", "Replace retired name 'Timeline Challenge' with 'Seerah Timeline'."),
]

NUMBER_WORDS = {
    10: "ten", 12: "twelve", 14: "fourteen", 15: "fifteen",
    24: "twenty-four", 30: "thirty", 42: "forty-two",
}

def prod_json_files() -> list[Path]:
    files = []
    for p in sorted((ROOT / "homepage").glob("*.json")):
        files.append(p)
    for p in sorted((ROOT / "deployment").glob("*.json")):
        if p.name in ("seo-catalog.json", "learning-guides.json", "targets.json"):
            files.append(p)
    for app in sorted((ROOT / "apps").iterdir()):
        data_dir = app / "src/data"
        if not data_dir.is_dir():
            continue
        for p in sorted(data_dir.glob("*.json")):
            if p.name in ("provenance.json", "sources.json", "corpus.json", "page-boundaries.json", "juz-starts.json"):
                continue
            files.append(p)
    return files

def main() -> int:
    errors: list[str] = []

    for path in prod_json_files():
        rel = path.relative_to(ROOT)
        raw = path.read_text(encoding="utf-8")
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as exc:
            errors.append(f"{rel}: invalid JSON ({exc}). Fix JSON syntax.")
            continue

        for pat, fix in INTERNAL_LEAKS:
            if re.search(pat, raw):
                errors.append(f"{rel}: leaked internal metadata matching /{pat}/. Fix: {fix}")

        for pat, fix in RETIRED_NAMES:
            if re.search(pat, raw):
                errors.append(f"{rel}: stale pre-R3B app name matching /{pat}/. Fix: {fix}")

        # Count drift check on methodology
        if isinstance(data, dict) and isinstance(data.get("methodology"), str):
            meth = data["methodology"].lower()
            for key in ("packs", "events", "parables", "places", "lessons", "readings"):
                if isinstance(data.get(key), list):
                    actual = len(data[key])
                    expected_word = NUMBER_WORDS.get(actual)
                    if expected_word and expected_word not in meth and str(actual) not in meth:
                        errors.append(
                            f"{rel}: methodology does not reflect actual {key} count ({actual}). "
                            f"Fix: update methodology to state '{expected_word.capitalize()}' or '{actual}'."
                        )

    # Sync check: deployment/seo-catalog.json vs apps/*/src/data/seo.json
    seo_cat = json.loads((ROOT / "deployment/seo-catalog.json").read_text(encoding="utf-8"))
    for slug, entry in seo_cat.items():
        app_seo_p = ROOT / f"apps/{slug}/src/data/seo.json"
        if not app_seo_p.exists():
            errors.append(f"deployment/seo-catalog.json: unknown slug '{slug}'. Fix: remove slug or add apps/{slug}/src/data/seo.json.")
            continue
        app_seo = json.loads(app_seo_p.read_text(encoding="utf-8"))
        for field in ("title", "description"):
            if app_seo.get(field) != entry.get(field):
                errors.append(
                    f"apps/{slug}/src/data/seo.json: '{field}' drifted from deployment/seo-catalog.json. "
                    f"Fix: sync '{field}' between both files."
                )

    # Sync check: deployment/learning-guides.json vs apps/*/src/data/learning.json
    lg_cat = json.loads((ROOT / "deployment/learning-guides.json").read_text(encoding="utf-8"))
    for slug, entry in lg_cat.items():
        app_lg_p = ROOT / f"apps/{slug}/src/data/learning.json"
        if not app_lg_p.exists():
            continue
        app_lg = json.loads(app_lg_p.read_text(encoding="utf-8"))
        if app_lg.get("summary") != entry.get("summary"):
            errors.append(
                f"apps/{slug}/src/data/learning.json: 'summary' drifted from deployment/learning-guides.json. "
                f"Fix: sync 'summary' between both files."
            )

    if errors:
        print(f"CONTENT HYGIENE FAILED ({len(errors)} issue(s)):")
        for e in errors:
            print("  -", e)
        return 1

    print(f"CONTENT HYGIENE PASSED ({len(prod_json_files())} production JSON files checked, 0 issues).")
    return 0

if __name__ == "__main__":
    sys.exit(main())

# Zakat Calculator

## Overview

Work out your zakat step by step, with the method shown. The planned audience is a learner or family member who wants to see how each asset, debt and nisab basis enters a zakat calculation, and where scholars differ, which choice produces which result.

Portfolio app for the P7 Ramadan season. Project root `apps/zakat-calculator`, port 4341, planned production host `https://zakat-calculator.moongazer.tech/`. The app is scaffolded and not yet deployed or listed in the directory.

## Current state

The app is an empty but complete shell (P7 T7.5):

- Home: app introduction and the notice "The calculator is being prepared; its method and sources will be shown in full." No calculator, no inputs and no result.
- Sources & methodology: states that method content is pending verification and lists no sources.
- Privacy & storage, 404 and sitemap: shared pages.

No zakat ruling, nisab figure, amount, hadith or Quran text is bundled. `src/data/content.json` holds `{"method": null}`; `src/data/provenance.json` records status `pending`.

## Goals

1. Show the method first: each step of the calculation with its source, before any result is offered.
2. Apply decision D23: wherever schools differ, the visitor chooses a labelled option with a source note. No option is selected by default.
3. Show both nisab bases (gold and silver), with the visitor choosing which metal to use and seeing which one they chose.
4. Keep everything in the browser: no accounts, no live price feed, no analytics.

## Planned features (T7.6, not yet built)

- Inputs for cash and bank balances, gold and silver (by weight or value), business stock at market value, money owed to the visitor that they expect to receive, and short-term debts due now. Currency is a free label, with no conversion.
- Nisab from prices the visitor enters per gram for gold and silver. The app does not fetch prices.
- A labelled choice for each school difference in the verified method record, each with a "Learn more" link to the method page.
- A result showing whether the total reaches nisab, the zakat due on the zakatable total, a line-by-line breakdown, the choices made and a printable summary, with the limit sentence "This shows the calculation for the choices you make. It is not a fatwa; ask a scholar you trust about your situation."
- Zakat al-fitr explainer, separate from the calculator.

Each feature depends on the verified method record. The calculator is not released until every difference it shows has a verified source.

## Scope

In scope: the introduction, the sources page, the verified method once it exists, and the calculator built to the D23 rule. Out of scope: rulings or fatwas, personal advice, a currency converter, live prices, accounts, server storage and any claim of scholarly review.

## Success criteria

1. The home page and sources page are accurate about the current state, with no unverified claim.
2. `bun run check`, `bun test` and `bun run build` pass.
3. Once the calculator exists: pure tests cover the worked examples from the method record, and every difference shown has a verified source.

# Plan note: first-party counters, feedback form, and progress sync

> **Settled 11 November 2026.** The open questions in section 2 were answered in the owner's decision interview: (1) Pages Functions on the apex `moongazer` project, deployed with `wrangler pages deploy`; (2) one Cloudflare D1 database for feedback rows and aggregate counter rows; (3) no Turnstile — honeypot, minimum time-to-submit, validation, one zone rate-limiting rule on `/api/*`, everything stored as pending; (4) no email notifications — a local review script, approved corrections written to `homepage/corrections.json` and published statically at `/corrections/`; (5) accounts remain demand-triggered and need their own decision interview; (6) apps use a native form POST and `navigator.sendBeacon`, so they work and fail silently offline or when blocked. Implementation: [`plan/implementation/P4-first-party-services.md`](implementation/P4-first-party-services.md).

Created 8 November 2026 in Asia/Dhaka. This document captures the owner's settled product requirements from the Moongazer DNA session alongside the open technical architecture questions that must be resolved before building these three first-party services.

## 1. Settled product requirements

### A. Privacy-friendly interaction counters

- **Purpose.** Measure daily puzzle completion rates and actual activity usage quantitatively without third-party tracking scripts or personal identity collection.
- **Events to record.** Only three interaction events:
  - `activity_started`
  - `activity_completed`
  - `share_clicked`
- **Excluded events.** Do not record `page_view` events. Search Console and server-side Cloudflare host dashboards already cover page discovery and request volume.
- **Data shape.** Aggregate counts per `{date, app_slug, item_id, event_type}` with zero cookies, zero IP storage, and zero browser fingerprinting.
- **Disclosure.** Update the privacy notice before deployment so it states clearly that Moongazer records anonymous aggregate interaction counts for started, completed, and shared activities.

### B. In-app feedback and correction form

- **Purpose.** Because recruiting a dedicated Islamic studies reviewer is not currently possible, give learners, parents, teachers, and knowledgeable community members a direct way to report source corrections, bugs, or feature requests inside every app.
- **Placement.** Available in every app's footer and result panel, plus the directory.
- **Data shape.** `{app_slug, page_url, category, message, optional_contact}` where `category` is one of:
  - `source_or_text_correction`
  - `bug_report`
  - `feature_request`
- **Public trail.** Pair the form with a public `/corrections/` log on the directory listing verified fixes by date, page, and what changed, without publishing reporter contact details unless requested.

### C. Demand-triggered minimal user accounts

- **Prerequisite 1: Anonymous-first always.** Every app must continue to work 100% on first visit without an account using local browser storage.
- **Prerequisite 2: Zero-account backup code.** Ship a client-side export/import backup code or file first so users can transfer progress manually without any server account.
- **Trigger.** Build user accounts only after feedback-form submissions show real learner demand for cross-device progress sync.
- **Scope.** Strictly minimal progress saving across `moongazer.tech` apps: `{user_id, auth_credential, app_slug, progress_json, updated_at}`. No real names, no avatars, no social feeds, no public profiles, and no competitive leaderboards. Include a one-click account and data deletion button.

## 2. Open technical questions to plan before implementation

Before authorizing implementation of any of the three services above, run a dedicated planning session to decide:

1. **Hosting topology.** Whether to host the endpoints as Cloudflare Pages Functions on the apex `moongazer.tech` project, a standalone Cloudflare Worker on a dedicated route, or per-project endpoints.
2. **Storage backend.** Whether to use Cloudflare D1, Cloudflare KV, or Workers Analytics Engine for the aggregate counters, feedback inbox, and future progress sync tables.
3. **Abuse and spam protection.** How to rate-limit the feedback form and event counter endpoints without invasive CAPTCHAs or third-party tracking scripts.
4. **Notification workflow.** Whether new feedback and correction submissions stay in a D1 table queried by a local CLI script, or also trigger an email notification via Cloudflare Email Service.
5. **Authentication mechanism for future sync.** When the user-demand threshold is met, whether cross-subdomain progress sync uses passwordless email codes, WebAuthn passkeys, or a random server-stored sync key.
6. **Offline and static-build compatibility.** How the static Astro apps degrade silently when a visitor is offline or blocks requests to the first-party endpoint.

# MULTIPOST — Prioritized Phase Backlog (Proposed V1)

**Legend:** P0 blocker · P1 must-have · P2 later; sizes S/M/L/XL = relative complexity (not a calendar promise). `→` means depends on. This backlog is for Argon to audit and revise against actual repository and external approvals.

## Phase 0 — Product discovery & technical feasibility

- [ ] **MP-001 · P0 · M** — Repository inventory: inspect code/routes/packages, tests, schema, env *names*, deployment; evidence paths and status classification. **Gate:** verified audit without guesses.
- [ ] **MP-002 · P0 · M** — Product persona/market validation: internal-only vs creator-facing SaaS, top 3 user jobs, first pilot users. **Gate:** launch intent documented; TikTok eligibility implications acknowledged.
- [ ] **MP-003 · P0 · XL** — TikTok policy/app-approval spike: app registration, scopes, creator info, public visibility/audit, intended use, allowed alternatives. **Gate:** go/blocked/conditional with official sources; no unsupported publish claims.
- [ ] **MP-004 · P0 · M** — YouTube app/quota feasibility: OAuth consent, uploads, resumable, 2026 quota and review. **Gate:** test-channel plan and actual allocation identified.
- [ ] **MP-005 · P0 · S** — Infrastructure and cost inventory: hosting, Docker, Postgres, object storage, egress, certificates, worker suitability. **Gate:** validated constraints and projected usage assumptions.
- [ ] **MP-006 · P0 · M** — Stitch-to-code gap inventory: screens vs routes vs implemented features, screenshot references, usability issues. **Gate:** no design-only feature misreported as shipped.

## Phase 1 — Product & architecture contracts

- [ ] **MP-010 · P1 · M · →001,002,003,004** — Freeze MVP / non-goals / launch gates. **Test:** acceptance criteria for first working publish slice written.
- [ ] **MP-011 · P1 · M · →006,010** — S01–S20 sitemap, flows, screen state matrix and route mapping. **Test:** all core screens and edge states mapped.
- [ ] **MP-012 · P1 · M · →001,005** — ADR: modular monolith boundary, repo layout, auth and stack fit. **Test:** alternative/trade-off captured.
- [ ] **MP-013 · P1 · M · →012** — ADR: durable job queue/worker (Postgres jobs vs Redis/BullMQ), retries, scheduling and operations. **Test:** crash/restart and at-least-once model designed.
- [ ] **MP-014 · P1 · M · →012** — ERD/migration draft including Workspace, Content, Media, Editions, Batch, Job, Attempt, Events. **Test:** unique constraints and tenant scope explicit.
- [ ] **MP-015 · P1 · M · →003,004,014** — Provider capability and OAuth scope matrix. **Test:** UI fields correspond to actual provider/account capabilities.
- [ ] **MP-016 · P1 · L · →013,014** — Publish state machine and idempotency/reconciliation specification. **Test:** double-submit + remote-success-timeout cases formally described.
- [ ] **MP-017 · P1 · M · →014,015** — Threat model and data-handling policy: storage, OAuth, webhook, RBAC, logs. **Test:** cross-tenant and token leak threats mitigated.

## Phase 2 — UX/UI Dream Press Foundation

- [ ] **MP-020 · P1 · M · →011** — Finalize semantic tokens, type roles, layout, focus and responsive rules based on Stitch references. **Test:** contrast/focus/density on representative screens.
- [ ] **MP-021 · P1 · L · →020** — Reusable AppShell/sidebar/masthead/buttons/forms/status/platform indicators. **Test:** variant/state coverage and keyboard support.
- [ ] **MP-022 · P1 · M · →021** — Content Library design-to-code, content rows/filter/search/empty/loading. **Test:** 1440/1280/1024 and long title behavior.
- [ ] **MP-023 · P1 · M · →021** — Dashboard design-to-code using real data contracts, not fictitious analytics. **Test:** urgent status priority and health sections.
- [ ] **MP-024 · P1 · L · →021,011,015** — Create Post composer UX: media/distribution/shared/editions/schedule/review, sticky summary rail. **Test:** efficient keyboard flow, invalid destination visible inline.
- [ ] **MP-025 · P1 · M · →022,023,024** — Visual/accessibility regression and story fixtures; de-duplicate style tokens. **Test:** screenshots and a11y checklist pass.

## Phase 3 — Secure application and worker foundation

- [ ] **MP-030 · P1 · L · →012,014,017** — Auth/workspace/membership and server authorization. **Test:** IDOR and unauthorized requests blocked.
- [ ] **MP-031 · P1 · M · →014,030** — DB migrations/ORM/repository with unique constraints. **Test:** rollback strategy/migration dry run and tenant filtering.
- [ ] **MP-032 · P1 · L · →005,017** — Private object storage + signed upload service and quotas. **Test:** cross-tenant object access denied.
- [ ] **MP-033 · P1 · L · →013,016,031** — Queue, worker, DB outbox/inbox or justified alternative. **Test:** same job not dispatched twice after restart and concurrency race.
- [ ] **MP-034 · P1 · M · →030,033** — Observability baseline: safe logs/tracing/health/alerts. **Test:** trace a job through web, worker, DB.
- [ ] **MP-035 · P1 · M · →005,030,033** — Docker/dev/staging/CI scaffolding; secrets separation. **Test:** reproducible clean setup and smoke checks.

## Phase 4 — Media, Library, Draft, Composer end-to-end

- [ ] **MP-040 · P1 · L · →032,033** — Large upload/resume path and verified completion. **Test:** invalid MIME/oversize/network interruption handled.
- [ ] **MP-041 · P1 · M · →040** — Probe video duration/codecs/aspect/resolution + generate poster. **Test:** corrupt and invalid files rejected; worker timeouts bounded.
- [ ] **MP-042 · P1 · M · →031,041** — Content Library persisted media and content CRUD. **Test:** content visible only to owning workspace.
- [ ] **MP-043 · P1 · L · →014,024,042** — Draft composer/shared metadata/platform overrides and persistence. **Test:** autosave/manual save, reset override, reload, no data loss.
- [ ] **MP-044 · P1 · M · →015,043** — Dynamic account-aware validation and final review consent. **Test:** blocked account/unsupported privacy field has helpful UX.

## Phase 5 — YouTube publishing production vertical slice

- [ ] **MP-050 · P1 · L · →004,030,031** — Google OAuth connection, encrypted token lifecycle, correct channel identity. **Test:** revoke/expire/connect again.
- [ ] **MP-051 · P1 · L · →016,033,040,050** — YouTube provider resumable upload and metadata mapping. **Test:** test-channel upload and interrupted transfer recovery.
- [ ] **MP-052 · P1 · L · →033,044,051** — Freeze publish payload; batch+job creation; YouTube job transitions. **Test:** repeated publish request does not create duplicate post.
- [ ] **MP-053 · P1 · M · →051,052** — Provider reconciliation, publishing URL and quota/error mapping. **Test:** async processing state + 429/quota, remote-timeout uncertainty.
- [ ] **MP-054 · P1 · M · →053,023** — Operational queue UI, job detail timeline, dashboard real data wiring. **Test:** status matches server, not local invented values.

## Phase 6 — TikTok approval-gated integration

- [ ] **MP-060 · P0 gate · XL · →003,015** — TikTok public Direct Post eligibility decision; approved scope/creator consent/product intent. **Test:** developer portal evidence (sanitized); otherwise mark blocked.
- [ ] **MP-061 · P1 conditional · L · →060,030** — TikTok OAuth credential/creator info/privacy capability implementation. **Test:** display nickname and current account-specific allowed values.
- [ ] **MP-062 · P1 conditional · XL · →061,033,040** — TikTok Direct Post flow with verified URL requirements or suitable upload mechanism. **Test:** real approved account flow; no claiming public post prematurely.
- [ ] **MP-063 · P1 conditional · L · →062** — Fetch-status / webhook reconciliation + moderation; rate-limit aware polling. **Test:** delayed public ID, duplicates, final rejection.
- [ ] **MP-064 · P1 conditional · M · →063,054** — Partial success UX for YouTube vs TikTok, platform-level retry. **Test:** one succeeds, one fails, no batch-wide false failure.
- [ ] **MP-065 · P1 conditional · M · →060** — If blocked, implement only policy-compliant separately approved user-assisted draft workflow OR remove TikTok from autopublish promise. **Test:** user sees actual manual completion requirement.

## Phase 7 — Scheduling, safe retry and reliability

- [ ] **MP-070 · P1 · L · →016,033,052** — Timezone-aware future schedules, due-job dispatcher and persisted scheduling. **Test:** DST, past time, restart/missed tick.
- [ ] **MP-071 · P1 · L · →070,053,063-if-approved** — Retry/backoff with classification, reconciliation-first on uncertain remote state. **Test:** transient/permanent/rate limit and retry boundaries.
- [ ] **MP-072 · P1 · M · →070** — Schedule edit/cancel semantics and UI. **Test:** safe cancellation before dispatch, explain after remote start.
- [ ] **MP-073 · P1 · M · →071** — Idempotency fault injection: double click, worker crash, webhook repeated, network timeout after submission. **Test:** no unintended duplicate publish in supported cases.
- [ ] **MP-074 · P1 · M · →070,054** — Calendar week/month view; open event to content/job. **Test:** timezone and filter consistency.

## Phase 8 — Hardening, beta and operational readiness

- [ ] **MP-080 · P1 · M · →050,060/065,074** — Connected Account health + reconnect UX. **Test:** expired/removed scope reflected correctly.
- [ ] **MP-081 · P1 · L · →073,080** — End-to-end cross-workspace/performance/security/accessibility battery. **Test:** critical scenarios pass; no high severity issues.
- [ ] **MP-082 · P1 · M · →081** — Pilot usability (3–5 relevant creator/team users); baseline manual workflow timing. **Test:** documented friction and changes.
- [ ] **MP-083 · P1 · M · →034,081** — Runbooks for token outage, provider outage, stuck queue, storage failure, rollback, restore, quota. **Test:** dry-run recovery drill.
- [ ] **MP-084 · P1 · M · →083** — Launch approval checklist, backups, staging, monitoring, billing usage thresholds. **Test:** observability+rollback readiness.

## Phase 9 — Production launch and validation

- [ ] **MP-090 · P1 · M · →084** — Safe production deploy and smoke test with opt-in approved accounts. **Test:** verify link/status end-to-end without leaking content.
- [ ] **MP-091 · P1 · S · →090** — Monitor first pilot jobs, incident log, product funnel/time-saved indicators. **Test:** live metrics + issue triage.
- [ ] **MP-092 · P1 · M · →091** — Prioritize improvements by frequency, severity and user value; avoid new feature debt. **Test:** decision report linked to feedback.

## Phase 10 — Future expansion (not V1 commitments)

- [ ] **MP-100 · P2 · L** — Instagram/Meta API eligibility, permissions and integration spike before promise.
- [ ] **MP-101 · P2 · L** — Per-platform analytics raw/normalized data with freshness indicators.
- [ ] **MP-102 · P2 · M** — Activity/notifications and digest options.
- [ ] **MP-103 · P2 · L** — Team invites/roles, approvals only if pilot demand warrants.
- [ ] **MP-104 · P2 · L** — AI assistant as separate optional bounded-cost service, with human review before publish.
- [ ] **MP-105 · P2 · L** — Workspace quotas, pricing experiment, monetization after willingness-to-pay validation.
- [ ] **MP-106 · P2 · XL** — LinkedIn/X research and permission/cost spike, conditional on actual audience demand.

---

## First shippable vertical slice recommended

**V0:** one authorized workspace → upload one supported video → edit Shared Story → connect YouTube sandbox/test channel → confirm account and privacy → click publish → durable server job → resumable API upload → show processing/published/failed state → store permalink → reproduce error/duplicate protection in tests.  

Do **not** start by creating all 20 routes with mocked data and no actual publishing core. TikTok eligibility research runs **in parallel** and may change the public MVP release gate.

## Open decisions Argon must close

- Real launch audience and TikTok policy eligibility.
- Existing repo/stack and reusable code; standalone project or shared infrastructure.
- Real OAuth/app approvals and actual YouTube quota.
- Queue/storage/deployment economic trade-offs.
- Launch promise if a provider is blocked: honest scope, user-assisted fallback or revised timeline.

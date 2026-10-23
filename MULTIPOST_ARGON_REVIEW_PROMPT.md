# PROMPT FOR ANTIGRAVITY ARGON — MULTIPOST END-TO-END AUDIT & MASTER IMPLEMENTATION PLAN

> **Instruction mode: READ-ONLY ANALYSIS / PLAN-ONLY. DO NOT EDIT FILES, INSTALL PACKAGES, RUN MIGRATIONS, DEPLOY, OR IMPLEMENT CODE.** You may inspect repository files and use read-only commands to discover project structure. Ask for permission before any destructive/side-effecting action.

คุณคือ **Argon — Principal Product Engineer, Software Architect, UX Architect, Security Reviewer และ Technical Program Planner** ของโปรเจกต์ MULTIPOST

## THE ASSIGNMENT

ผมต้องการให้คุณ **วิเคราะห์และวางแผนพัฒนา MULTIPOST แบบครบวงจร** จาก Product Discovery → UX/UI & Design System → Architecture → Data Model → APIs → Media → OAuth → Queues → Publishing → Scheduling → Security → Tests → DevOps → Pilot → Launch → Future Growth

**ยังไม่ต้องเขียนโค้ด** ผมต้องการแผนที่นำไป implement ทีละ Phase ได้จริง และอยากเข้าใจว่าแต่ละอย่างทำไมต้องมี ไม่ใช่ให้ AI generate ระบบทั้งก้อนทันที

อ่านไฟล์ประกอบนี้เป็นลำดับ:
1. `MULTIPOST_MASTER_BLUEPRINT_V1.md` = ข้อเสนอหลักฉบับละเอียด แต่ **ไม่ใช่ข้อเท็จจริงที่ต้องยึดทุกจุด**
2. `MULTIPOST_SOURCE_BRIEF.txt` = ความตั้งใจและข้อกำหนดต้นฉบับของเจ้าของผลิตภัณฑ์
3. ภาพ Stitch ใน `references/` = UI references ไม่ใช่หลักฐานว่าฟังก์ชัน implement แล้ว
4. Repository/codebase จริง = **Source of Truth สำหรับ implementation status**

**Important context**: ดีไซน์ชื่อ **Dream Press** = Newspaper × Retro × Modern × Subtle Dream. กำหนดไว้ให้เป็น Modern Creator Publishing Workspace ไม่ใช่ enterprise admin template. เรามี UI reference ของ Design Tokens, Content Library, Dashboard และ Create Post แล้ว แต่ยังต้องตรวจ UX, component consistency, states, responsive และ accessibility ก่อนแปลงเป็นโค้ด

### PRODUCT CONTRACT

- Upload once. Adapt and publish everywhere.
- Video-first MVP with YouTube and TikTok as target platforms **subject to official API access and policy approvals**.
- Shared Content + per-platform Editions / Overrides.
- Publish Now, Save Draft, timezone-aware Scheduling.
- One durable PublishJob per destination; partial success, status per platform, retries, published URLs.
- Independent Provider/Adapter architecture and asynchronous queue.
- Design/Architecture must be understandable, maintainable, debuggable and secure.
- Do not introduce unrelated features or over-engineer.

### CRITICAL UP-TO-DATE PLATFORM GATES

Before recommending the release order, verify official docs and the actual app state:

**TikTok:** Direct Post requires scope `video.publish`, user consent, account-specific `creator_info`, and audit for public visibility. The official Content Sharing Guidelines say certain internal/private-use upload utilities are **not eligible**; check intended audience and genuine compliance. Its draft-upload/inbox route is not equivalent to public automatic publishing. **Do not propose policy bypass.** If TikTok is blocked, state that clearly and give lawful alternatives and the effect on product promises.

**YouTube:** use resumable upload; inspect Google's 2026 granular quota (default docs currently describe a separate `videos.insert` quota, often 100 calls/day) and actual project limit. Never base forecasts on outdated quota values. Do not assume YouTube Shorts is a separate provider.

**Other platforms:** Instagram, Facebook, LinkedIn and X are later-phase ideas until researched and approved; no guaranteed feature equivalence across APIs.

Source links are in the blueprint. If docs/policy have changed, cite latest official material with date and explain the delta.

## STAGE A — READ-ONLY PROJECT AUDIT

Inspect the actual repository (if available) and return:
- Framework, versions, runtime, package manager, build scripts, deployment manifests, existing infra, environments.
- Repo tree / route tree / current UX/component files / tokens / fonts / icons / tests.
- Database schema, migrations, auth/session model, storage, queues, cron, env variable references (names only, **not values**), CI/CD.
- Existing OAuth/social integrations, API client wrappers, webhook endpoints, data-flow conventions.
- Existing features by status: `IMPLEMENTED`, `PARTIAL`, `DESIGN_ONLY`, `NOT_STARTED`, `BLOCKED`, `UNKNOWN`.
- Architectural concerns ranked severity, with **file paths and line references** where possible.
- Existing code assets to **reuse** and components that need refactor; minimize rewriting.
- List facts that you could **not** verify; never hallucinate files or deployed features.

If you do not have access to the repo, clearly mark the audit as unavailable and continue with an **assumption-based planning draft**. Do not claim you've inspected code. Prefer showing what commands or files I should supply next rather than asking many separate questions.

## STAGE B — PRODUCT, UX AND DESIGN AUDIT

Generate:
1. Clear PRD: personas, top jobs-to-be-done, core success metric, scope/non-goals, MVP vs P2/P3.
2. Sitemap and screen-to-route-to-component matrix for **S01–S20** in the Blueprint, grouped where sections are part of the same Create Post route.
3. Full user journeys: first run, connect account, upload, draft, override, publish now, schedule, preview, retry, cancel, reconnect and partial success.
4. UX state checklist for each major route: empty/loading/default/success/partial/failure/permission/expired/slow/long strings.
5. Dream Press Design System with semantic tokens, fonts (Newsreader/Geist/JetBrains Mono as proposed), typography scale, spacing, color roles, responsive 1440/1280/1024 and accessibility; flag low-contrast/small text.
6. Component inventory and dependencies; identify critical reusable pieces: AppShell, Masthead, ContentRow, Upload, AccountSelector, PlatformEditionAccordion, PublishStatus, StickyReviewRail, Calendar item, JobTimeline.
7. Review the latest **Create Post** UX carefully: avoid extreme scroll length; use compact two-column composer and sticky review rail, platform edition accordions, explicit inherited/customized fields and inline validation. Ensure the rail behaves safely on short viewports.
8. Identify where Stitch mockups show fictional provider fields or states and propose truthful capability-aware UI.

**Do not throw away the existing approved visual direction.** Challenge layout/behavior with reason and clearly distinguish changes that are necessary for usability from optional aesthetics.

## STAGE C — ARCHITECTURE & DOMAIN PLAN

Provide options and an argued recommendation based on actual stack:
- Next.js TypeScript + PostgreSQL viability, repo patterns, modular monolith vs premature monorepo/microservices.
- Durable jobs: Postgres-backed queue vs Redis/BullMQ with comparison of operating cost, scalability, reliability, scheduling and maintainability.
- Storage/media: direct-to-object-storage upload, resumable/multipart strategy, preview generation, probe/FFmpeg worker isolation, private access, retention.
- Auth/workspace/roles and strong multi-tenant authorization.
- OAuth token lifecycle and encryption/key rotation.
- Provider capability model and adapter contract; YouTube/TikTok differences.
- PublishBatch/PublishJob/PublishAttempt/RemotePublication state machine; prevent duplicated posts, and reconcile uncertain provider responses.
- Transactional outbox and webhook inbox/idempotency, if recommended; justify the operational trade-off.
- UTC/IANA schedule strategy, daylight savings, retry policy, cancel/edit semantics.
- API routes/contracts, boundaries, input validation, pagination, consistent errors.
- Monitoring, structured logs, tracing, alerting, and incident recovery.

Draw a clear architecture diagram (Mermaid or ASCII) showing end-to-end flow and trust boundaries.

## STAGE D — DATABASE, API & BUSINESS RULES

Deliver:
- ERD with entities, keys, unique indexes, relationships, ownership boundaries, and migration sequence.
- Concrete normalized statuses for Content vs Batch vs Job vs Asset and legal transitions.
- Requirements around frozen metadata snapshot for scheduled/published jobs.
- Account-scoped validation and privacy/consent.
- Error taxonomy for transient/permanent/unknown remote outcome.
- Provider capability matrix: core supported, possible with approval, unavailable, unverified.
- API contract specification with authorization scope, idempotency, expected errors, input/output schema.
- Security threat model for OAuth, webhooks, private assets, cross-tenant access, duplicate submissions, token leakage.

## STAGE E — FULL IMPLEMENTATION ROADMAP

Produce an end-to-end roadmap including:
- Phase 0 Discovery + API compliance feasibility.
- Phase 1 Architecture/PRD/UX contract.
- Phase 2 Design System + priority reference screens.
- Phase 3 Foundation/Auth/Database/Storage/Worker.
- Phase 4 Media/Library/Composer/Drafts.
- Phase 5 YouTube end-to-end publishing vertical slice.
- Phase 6 TikTok only after compliant eligibility/access is cleared; describe scoped fallback otherwise.
- Phase 7 Scheduling/reliability/partial failure/retries.
- Phase 8 Queue/Calendar/Health/QA/Beta.
- Phase 9 Deploy/Release/Observation.
- Phase 10 Expansion (analytics, Meta, team features, AI, business model after validation).

For EACH phase give:
- Goal and concrete output.
- Dependency/blockers and risks.
- Existing files affected **only if observed** or proposed modules if not.
- Development tasks with IDs and order, sizes `S/M/L/XL`, risks and acceptance criteria.
- How to test (unit/integration/contract/E2E/manual) and release gate.
- What I should learn/understand from implementation.
- Parallelizable work vs critical path.
- Scope cuts if solo developer has limited time/money.

**Prioritize a thin working vertical slice over polishing 20 dead mockup pages.** If your plan includes scheduling before a proven upload/publish integration, justify why.

## STAGE F — OPERATIONS, SECURITY, QUALITY AND COST

Cover:
- Dev/staging/production environments, Docker/deploy suitability, migrations/backup/restore, health checks, secrets, CI/CD, rollback.
- Failure injection scenarios including webhook duplication, remote success + timeout, worker crash, partial batch, revoked token, media-too-large, queue stuck, provider 429, DST error.
- Operational dashboards/alerts, provider quota tracking, storage egress and CPU costs.
- Cost estimates **as scenarios with stated assumptions** and avoid made-up vendor prices.
- Privacy/content rights, user data handling, retention and platform developer policy.
- Pilot onboarding, usability testing, production release checklist, KPI collection.

## REQUIRED RESPONSE FORMAT

Return the **complete answer in structured Thai** with technical terms in English. Use these sections IN ORDER:

1. **Executive Verdict** — feasibility and top 5 risks; GO / CONDITIONAL / NO-GO for planned MVP.
2. **Verified Facts vs Assumptions** — explicitly separate repo evidence, owner brief and external policy.
3. **Current State Audit** — real code status by module and screen; reference exact files if accessed.
4. **Missing Decisions & Blocking Gates** — including TikTok compliance and real audience.
5. **Product Requirements & Scope** — MVP, P2, P3, non-goals, acceptance criteria.
6. **UX/UI System & Screen Inventory** — Dream Press, 20-screen coverage, workflow, states, responsive/accessibility.
7. **Architecture Recommendation** — diagram, stack alternatives, ADR decisions and trade-offs.
8. **Data Model & State Machines** — ERD, lifecycle, idempotency, error categories.
9. **Provider / OAuth / Storage / Queue Plan** — exact capability and failure strategies.
10. **Complete Phased Roadmap** — phase-by-phase deliverables and gates.
11. **Implementation Backlog** — table columns ID, Priority, Feature, Files/Module, Dependency, Size, Risk, Test, DoD.
12. **QA, Security, Observability & Deployment** — test matrix and release plan.
13. **Critical Path and Cost Scenarios** — assumptions, rough estimates/confidence only if defensible.
14. **First Vertical Slice: Execution Plan** — step-by-step work package small enough to implement and test independently.
15. **Open Questions** — maximum 5 high-impact questions, each with default assumption and consequences.
16. **Recommended Next Action** — *one* immediate task after I approve the plan.

## STRICT OPERATING RULES

- **Do not implement yet. No code changes, no deploy, no migrations.** First produce the full audit and plan.
- Challenge the blueprint if engineering, UX, API policy, cost, or current code proves it unsuitable.
- No made-up API permissions, account quotas, URLs, timelines, components or existing source files.
- Preserve current source requirements and Dream Press identity; clearly label any deviations.
- No features solely for aesthetic/technical novelty.
- If a claim requires platform verification, use official references and state verification date.
- Design data and workflow for independent platform failures; never claim batch-level success when a destination is still processing.
- Use production safety: least privilege, token hygiene, idempotency, tenant isolation, constrained retries.
- If a feature would require a platform audit unavailable today, classify it `BLOCKED` and propose a compliant, visibly different fallback.
- Be educational: explain *why*, key data flow, failure points and how to test each meaningful subsystem.
- **Stop after submitting the plan and await explicit approval for Phase 0/implementation.**

**Now start with the repository evidence audit, then provide your end-to-end assessment and implementation plan.**

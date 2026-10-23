# MULTIPOST — Master Product, UX/UI & Engineering Blueprint (Draft V1.0)

**Prepared:** 22 October 2026 · **Status:** DRAFT FOR ARGON REVIEW — not an approved implementation spec  
**Product identity:** MULTIPOST / Dream Press  
**Guiding proposition:** Upload once. Adapt and publish everywhere.  
**Primary implementation target:** Desktop-first web application; mobile-responsive essentials only until validation.  
**Evidence basis:** MULTIPOST Product & Growth Builder brief provided by the project owner, our Stitch design review, official YouTube/TikTok API references checked 22 Oct 2026.  
**Critical rule:** Do not equate Stitch screens with implemented code. No repository, OAuth client, deployment or API approvals have been verified.

---

## 0. How to use this document

1. Give this entire document, `MULTIPOST_ARGON_REVIEW_PROMPT.md`, and the attached screenshots/reference material to Argon alongside the **real existing repository** if available.
2. Ask Argon to **audit and plan first**. It must produce evidence-backed findings, ADRs, a realistic phased implementation backlog, risks, and test criteria, **without writing or changing application code** in the first pass.
3. Lock the architecture and refined UX design contract only after assessing the actual code and platform policy gates.
4. Implement vertical slices with measurable acceptance criteria and feedback loops. This is both a shipping project and a software-engineering learning project.

**Evidence notation:** `SOURCE` = owner-provided brief/design conversation; `PROPOSAL` = recommended but not yet approved; `VERIFY` = actual code/vendor/API account status unknown; `GATE` = milestone must pass before committing to later work.

## 1. Product thesis and decision framework

### 1.1 Problem
Creators and small social teams repeatedly upload the same asset, re-enter titles/captions/hashtags, adapt metadata, manage scheduling, chase errors, and check multiple platforms to confirm success. MULTIPOST should reduce that repeated operational effort while retaining platform-specific control.

### 1.2 Product outcome
`Connect → Import/upload → Edit master content → Choose accounts → Apply platform editions → Validate → Publish now/schedule → Observe per-platform jobs → Recover failures → Open live posts → Eventually analyze performance`.

### 1.3 Users and JTBD
- Solo creator: prepare one video and publish it to multiple owned channels efficiently.
- Social media manager: schedule and troubleshoot multiple accounts reliably.
- Small marketing/real-estate team: prepare cross-platform posts without losing auditability or accidentally publishing to the wrong account.
- Agency/team (later): separate workspaces, permissions, approvals, and reporting.

### 1.4 Product principles (source-derived)
- Modular platform provider/adapter; never tightly couple the core app to a social API.
- Each destination gets its own asynchronous PublishJob with independent status, retries, IDs and URLs.
- Shared Content and per-platform Overrides; users should not duplicate entry.
- Publishing Engine keeps working if AI Content Engine is unavailable.
- UX presents actionable failures and partial success, never a single misleading global FAILED status.
- Priorities: working core → reliability → UX → automation → AI → analytics → monetization.
- AI-assisted development, not AI-dependent development; explain decisions, affected files, flow, trade-offs, debugging.

### 1.5 What success looks like (targets proposed; validate with pilots)
- **Publish success rate:** successful destinations / attempted destinations, broken down by platform and failure reason. Do not game results by omitting failures.
- **Time-to-publish:** median time from prepared content to job acceptance; separate preparation time from remote processing time.
- **Recovery:** percentage of retryable failures recovered without manually rebuilding the post.
- **Time saved:** median creator minutes saved against manual baseline in a pilot study.
- **Confusion:** wrong-account publish incidents = 0 in tests; users understand what will be posted and where.
- **Delivery quality:** audit log, supportable errors, no known duplicate publishing in supported test cases.

## 2. Decisions, assumptions and external gates

| ID | Decision / Assumption | Current stance | Evidence or gate |
|---|---|---|---|
| D01 | Starting target | Creator / small team pilot, broader market possible | **VERIFY** actual launch intent; TikTok policy strongly affects viability |
| D02 | Core platform sequence | YouTube production slice first, TikTok parallel feasibility spike; target YouTube+TikTok MVP | **GATE:** TikTok app/scope/audit pathway verified |
| D03 | Content | Video-first; photos and carousels deferred | Source brief MVP is video upload |
| D04 | Tech stack | Next.js + TypeScript + PostgreSQL proposed, not proven repo state | **VERIFY** repo and deployment |
| D05 | Queue | Durable worker, not browser or edge request | Independent retry/scheduling requires durable jobs |
| D06 | Storage | Object storage with signed upload, separate CDN/access path | **VERIFY** budget, region, size limits |
| D07 | Visual direction | Dream Press (editorial newspaper + modern creator SaaS) | Design screenshots, approved direction in conversation |
| D08 | Existing screens | Design references, not automatically code | **VERIFY** components, routes and completeness |
| D09 | Analytics | Basic job-level operational counters first; cross-platform metrics later | External schemas and metrics differ |
| D10 | Team approvals | Not MVP unless existing code/product requires it | avoid scope expansion |

### 2.1 Important TikTok compliance GATE
Official content-sharing guidelines describe disallowed use cases, including tools restricted to only the accounts the developer or internal team manages, and emphasize authentic creator-facing applications for a wider audience. Direct public post requires app/scope approval and audit. **Argon must evaluate the actual intended users, product behavior, consent UI and approval prospects before promising TikTok Direct Post.** Do not advise bypassing policy. If approval is not available, treat the integration as blocked for public autopublish and redesign the release scope transparently; a supported user-completed inbox/draft workflow may be a separate, honestly labeled alternative if the API approval permits it.

### 2.2 YouTube 2026 quota GATE
Google's June 2026 granular quota changes mean `videos.insert` has its own bucket; the current default documentation lists **100 upload calls/day** for new API projects, subject to actual console allocation and future changes. Design quota visibility and backpressure; do not calculate using outdated hardcoded upload cost/limits.

### 2.3 Scope boundaries
Do **not** build in V1: AI generated captions/transcription, team approval chains, subscriptions/billing, eight provider implementations, cross-platform normalized engagement league tables, social listening, deep video editor, automated repost spam, or a customizable workflow builder. Document extension points only.

## 3. MVP product definition

### 3.1 Required vertical outcomes
1. A user signs in, accesses an authorized workspace, and can view current integrations.
2. User securely connects a supported platform account, sees the exact account and its connection health.
3. User uploads/selects a supported video; the app stores an asset and derives metadata/preview.
4. User edits shared title/caption/description/hashtags and chooses platform destinations.
5. User customizes each destination's supported metadata and sees applicable validation, with explicit publisher consent.
6. User saves draft, chooses Publish Now or a correct timezone-aware schedule, and reviews final destinations/actions.
7. App creates one PublishBatch and one PublishJob per destination, reliably without duplicate dispatch.
8. Workers upload/publish, persist provider IDs and results, and reconcile unknown states via polling/webhooks.
9. App shows each job independently, informs users what failed/why/what next, and retries **only when safe**.
10. Published URLs open correctly; user can view history; minimal operational monitoring works.

### 3.2 Minimum acceptance of MVP
- E2E one-file → one YouTube publish with correct account, metadata, durable state and result URL.
- E2E one-file → two approved destinations, both successes, and one success / one failure without corrupting aggregate status.
- Schedule survives process restart and DST/timezone conversion; no early unintended publish.
- A repeated click/webhook/worker restart cannot create unintended duplicate live posts in demonstrated scenarios.
- Expired/revoked token visibly blocks/requires reconnect without exposing secrets.
- User cannot see or publish another workspace's content, assets or accounts.
- Draft inputs survive navigation and refresh (under explicitly specified persistence semantics).

## 4. Information architecture and screen inventory

> Stitch's screen frames are design references. Screen ≠ route; several states can live on one route. Argon must create a screen-to-route/component/state traceability matrix.

### 4.1 Primary navigation
- Home: Dashboard
- Content: Library, Create Post, Content Detail
- Publishing: Queue, Calendar, Publish Job Detail
- Insights: Analytics (later)
- Workspace: Connected Accounts, Settings
- Activity / Notifications through header or dedicated view if justified

### 4.2 UX route proposal (adjust to existing app)

| ID | Screen / State | Route proposal | Scope | Core UX contract |
|---|---|---|---|---|
| S01 | Onboarding / authentication | `/sign-in`, `/onboarding` | MVP | short, secure path to first connection |
| S02 | Dashboard / Dispatch Desk | `/dashboard` | MVP | urgent errors → active jobs → next scheduled → connection health → results |
| S03 | Content Library / Archive | `/content` | MVP | media thumbnail, search, filters, account/status, drafts, actions |
| S04 | Content Detail | `/content/[id]` | MVP | master content, history, per-destination results |
| S05 | Create Post — Media | `/create` section | MVP | upload/select, preview, media validation |
| S06 | Create Post — Distribution | `/create` section | MVP | clear account selection and connection state |
| S07 | Create Post — Shared Story | `/create` section | MVP | editable defaults and auto-save/draft behavior |
| S08 | Create Post — Platform Editions | `/create` section | MVP | one active accordion at a time; inherited/custom values |
| S09 | Create Post — Publishing | `/create` section | MVP | now / schedule, explicit timezone |
| S10 | Create Post — Review | `/create` section or dialog | MVP | exact assets, accounts, metadata, timing, warnings, consent |
| S11 | Publishing Queue | `/publishing/queue` | MVP | all jobs, filters, attempts, retryable states |
| S12 | Job Detail / Attempts | `/publishing/jobs/[id]` | MVP | timeline, sanitized errors, external IDs, safe retry |
| S13 | Calendar | `/calendar` | MVP-basic | week/month, publication time and destination |
| S14 | Connected Accounts | `/accounts` | MVP | platform, account, health, permissions, reconnect |
| S15 | Connect Account Flow | `/accounts/connect/[platform]` or modal | MVP | server-controlled OAuth, consent, return states |
| S16 | Analytics Overview | `/analytics` | P2 | coherent per-platform metrics, timeframe, data freshness |
| S17 | Content Analytics | `/analytics/content/[id]` | P2 | metrics per post/provider, never false normalization |
| S18 | Settings | `/settings` | MVP minimal | workspace, profile, notifications and defaults later |
| S19 | Activity / Notifications | `/activity` or drawer | P2 | important changes only; no noisy spam |
| S20 | Global edge states | component stories | MVP | empty, loading, permission, offline, expired, partial, error, confirmation |

### 4.3 Screen coverage states, per relevant screen
For each route: default, no data, loading, optimistic/pending, success, partial, failure, access denied, narrow desktop, keyboard focus, and long/translated text. Create no-data and error patterns as reusable components, not 20 visually unrelated frames.

### 4.4 Create Post critical UX flow
`Media → Distribution → Shared Story → Platform Editions → Publishing → Review` in **one coherent composer**:
- Main column: 6 numbered editorial sections; compact, no pointless vertical gaps.
- Sticky secondary rail: media/selected destinations/validation summary/schedule/primary CTA; must remain usable at 1024px (collapse into summary drawer or dedicated top banner when needed).
- Platform Editions: accordion; inherited fields clearly marked; override only supported fields; reset override action.
- Autosave semantics defined before coding: save draft explicitly + debounce if reliable; display unsaved/saved/error status; never silently drop inputs.
- Platform-aware validation: provider capabilities and latest permission/account settings, not fabricated universal rules.
- Review: exact account identity, visibility/privacy, expected behavior, any approval/manual-step requirement, number of destinations, and final consent.
- Publish CTA remains disabled only when necessary; explain blocking destination and allow supported selective actions.

## 5. Dream Press Design System contract

### 5.1 Concept
**Newspaper architecture + retro print character + modern productivity UX + light dream atmosphere.** Feels like an editorial publishing desk, not an old-fashioned newspaper site or generic navy admin UI. Preserve operational clarity above decoration.

### 5.2 Tokens (proposals, require design QA)

| Token | Draft value | Purpose |
|---|---|---|
| `surface.canvas` | `#F3F0E8` | warm paper |
| `surface.raised` | `#FBFAF6` | writing, forms, dialogs |
| `text.primary` | `#1A1A18` | ink |
| `text.muted` | `#565650` | secondary metadata |
| `brand.indigo` | `#3F3B78` | active selection and primary CTA |
| `accent.terracotta` | `#A94C39` | occasional editorial accent, **not automatically error** |
| `accent.ochre` | `#C88B2B` | editorial annotation only |
| `border.rule` | `#D8D1C4` | horizontal separator |
| `semantic.success/warning/error/info` | **TBD accessible shades** | strictly separate from editorial accent roles |

Existing Stitch design-system screenshot also shows alternative navy `#364165`, red `#A24836`, ochre `#C98836`, charcoal `#1A1A18`. **Do not pretend these are locked production tokens**; Argon/design QA should reconcile to one token file and verify contrast.

**Typography:** `Newsreader` (editorial display), `Geist` (product/body/UI), `JetBrains Mono` (timestamps, labels, IDs; use sparingly). Fallback web-safe stacks required. Load fonts efficiently without blocking the main UI.

**Scale proposed:** 4/8 spacing rhythm; 24–32px page headings depending on layout, 16–20px subheads, 14–16px body, 12–13px metadata only if contrast/zoom testing passes. Border radii 6–10px utility and 8–12px dialogs. Avoid heavy shadows, card-in-card nesting, massive pills and chaotic accent usage.

### 5.3 Visual primitives and patterns
- App shell: persistent desktop sidebar, workspace switcher, global search later, compact identity and active indigo marker.
- Editorial masthead: section numbering, serif title, single action hierarchy, thin rule.
- Surface hierarchy: paper canvas; elevated writing area; table/list rows separated by whitespace/rules, not endless rounded cards.
- Content row: thumbnail → title → destination(s) → status → schedule/date → primary action; secondary data via detail/overflow.
- Queue row: destination, current state, attempt count, error summary and safe retry.
- Account tile: identity, scopes/capability, connection health, reconnect action.
- Form controls: contemporary accessible controls; newspaper styling mostly in heading/content presentation, not inputs.
- Utilities: drawers for contextual detail; modals for destructive/explicit confirmations; toast for noncritical feedback.
- Atmosphere: halftone/grain, ghosted type, registration marks **under ~10%** of visual hierarchy; no text-overlay readability loss.

### 5.4 Component catalog
`AppShell, Sidebar, WorkspaceSwitcher, Masthead, SectionHeading, EditorialRule, Button, IconButton, Input, Textarea, Search, Select, Checkbox, Toggle, Combobox, DatePicker, TimePicker, TimezonePicker, Tabs, Tooltip, Popover, Menu, Dialog, Drawer, Toast, Skeleton, Pagination, EmptyState, ErrorState, ContentThumbnail, ContentRow, PlatformIcon, AccountSelectorCard, ProviderCapabilityNote, StatusTag, PublishProgress, VideoDropzone, VideoPreview, MetadataPanel, PlatformEditionAccordion, OverrideField, ScheduleControl, ReviewSummary, JobTimeline, RetryAction, FilterBar, DataTable, CalendarEvent, KPIStat, ChartShell, ConnectionHealth`.

Component requirements: states/default-hover-active-disabled-loading-focus; keyboard/screen-reader; long strings; responsive constraints; accessible status labels. Establish Storybook or equivalent component examples if justified by stack; do not build a massive documentation app before feature slices.

### 5.5 Accessibility & performance
Aim WCAG 2.2 AA where applicable: text contrast at least 4.5:1 for normal text, visible keyboard focus, labels/errors announced, no color-only state, reduced-motion support, 200% zoom checks, targets sized for reliable interaction, responsive 1440→1280→1024, mobile essentials later. Keep textures out of content text regions; avoid shipping high-res paper backgrounds on every route.

### 5.6 Design-to-code handoff
- Screen matrix S01–S20 with reference screenshot and acceptance checklist.
- Tokens in CSS variables/Tailwind theme; no repeated raw hex values inside components.
- Reusable component specs with accessibility/behavior.
- Explicit fixtures for no-data/slow/error/partial/no authorization/long title.
- Stitch output is a **design concept**, not architecture truth or bug-free source code.
- Snapshot/visual-regression checks on Dashboard, Library, Create Post, Queue and Account connection.

## 6. System architecture

### 6.1 Logical diagram

```text
Browser / Desktop UI
  |  HTTPS, Authenticated
  v
Next.js Web & API/BFF (PROPOSAL)
  |-- Workspace/Auth/RBAC/CSRF
  |-- Content/Media/Shared Metadata/Platform Overrides
  |-- OAuth callback/connection health
  |-- PublishBatch creation + transactional outbox
  |-- Read models for dashboard/library/queue
  |
  +--> PostgreSQL (source of truth, normalized relational data)
  +--> Object Storage (source videos / previews; signed access)
  +--> Queue / Outbox -> Durable Worker(s)
                           |-- Publish dispatcher / scheduler
                           |-- Provider adapters
                           |     |-- YouTubeProvider
                           |     +-- TikTokProvider
                           |-- Poll status / reconcile uncertain results
                           |-- Thumbnail/media probe, optional transcoding
                           +--> provider APIs
  ^
  +-- Webhook endpoints -> verify/dedupe/persist -> queue -> reconcile

Metrics/Logs/Traces + Alerts + Audit Events across boundaries
```

### 6.2 Key architectural choices to compare
**Option A (lean):** Next.js + Postgres + Postgres-backed jobs (e.g. pg-boss or equivalent) + S3-compatible storage + separate worker; easier if already operating Postgres.  
**Option B (scaling):** Next.js + Postgres + Redis/BullMQ + storage + workers; stronger queue ecosystem, but more operations.  
**Decision:** Argon must inspect deployment, existing tech, scheduler/worker needs, expected volumes, migrations and cost; do not choose a library by fashion. In either case publishing cannot depend on a live browser tab or a short-lived serverless request.

**Deployment:** isolated web, worker and database services; object store separate; TLS; environment-separated secrets; health checks and safe shutdown. If using Plesk/Docker, verify current hosting and outbound egress first; do not assume CRM infrastructure is shared with MULTIPOST.

### 6.3 Bounded contexts / modules
`auth`, `workspace`, `connections`, `media`, `content`, `composer`, `publishing`, `scheduler`, `providers`, `webhooks`, `activity`, `analytics (later)`, `admin/observability`, `design-system`.

Each module should own API/service/domain validation and cross-module contracts. UI never calls social-provider secrets directly.

## 7. Data model and invariants

| Entity | Core fields / responsibility | Integrity rules |
|---|---|---|
| User | id, identity, profile | PII minimization, auth provider owned |
| Workspace | id, name, owner | tenant isolation root |
| Membership | userId, workspaceId, role | unique pair; authorize every resource access |
| SocialConnection | workspaceId, platform, external identity, encrypted credentials, expiry, state | encrypt+rotate; no secret in logs |
| PlatformAccount | connectionId, provider accountId, handle, displayName, capabilities | unique provider + account within isolation model |
| MediaAsset | workspaceId, key, MIME, bytes, checksum, duration, dimensions, processing state | validate content and ownership |
| Content | workspaceId, mainAssetId, draft title, metadata, revision | optimistic concurrency or version |
| ContentEdition | contentId, platform/account target, override fields, validation snapshot | explicit inherited vs overridden semantics |
| PublishBatch | contentId, requestedBy, mode, requestedAt, aggregate status | derives status from all jobs |
| PublishJob | batchId, destination/accountId, snapshot version, schedule UTC, state, remote refs, attempt counters | unique dispatch key; frozen payload on submission |
| PublishAttempt | jobId, attempt #, started/finished, classified error, request correlation | append-only attempt history |
| PlatformPublication | jobId, remote postId, permalink, remote processing state | unique remote ID/account if known |
| WebhookEvent | provider, event key, received, verified, processed | dedupe; durable inbox |
| OutboxEvent | aggregate/target/payload/status | transactions with business mutation |
| AuditEvent | actor, workspace, resource, action, timestamp | tamper-resistant enough for operational needs |
| MetricsSnapshot | publicationId, metric schema, provider raw + normalized, time | later; preserve metric definitions |

**Relationships:** Workspace 1:N accounts/media/content; Content 1:N editions/batches; Batch 1:N jobs; Job 1:N attempts; Job 0..1 remote publication until confirmed. Design constraints/indexes after repository review. Secrets should be stored separate from public account profile where practicable.

### 7.1 Non-negotiable invariants
- Never make an already-published job go back to queued merely because another destination fails.
- Frozen publish payload includes media version + selected destination + final metadata + timezone interpretation; subsequent draft edits do not silently rewrite an active batch.
- Per-platform idempotency/deduping policy is explicit and tested.
- `workspaceId` is checked on every query, object URL generation, job and webhook/account mapping.
- Revoked connection cannot be used for new attempts; platform permission changes invalidate capabilities.
- User-visible count of destinations equals number of intentionally created jobs.

## 8. Publishing state machine, partial failure and idempotency

### 8.1 Separate state dimensions
- **Content**: `DRAFT`, `READY`, `ARCHIVED` (proposed; does **not** represent remote publishing).
- **Batch aggregate**: `PENDING`, `IN_PROGRESS`, `PUBLISHED`, `PARTIALLY_PUBLISHED`, `FAILED`, `CANCELLED` (derived, not independently mutable without rules).
- **Job**: `QUEUED`, `SCHEDULED`, `UPLOADING`, `PROCESSING`, `PUBLISHED`, `FAILED_RETRYABLE`, `FAILED_FINAL`, `CANCELLED`, `UNKNOWN_RECONCILE` (proposed; map to public labels).
- **Asset**: `UPLOADING`, `VALIDATING`, `READY`, `REJECTED`, `PROCESSING`.

Source brief lists statuses `DRAFT / READY / QUEUED / SCHEDULED / UPLOADING / PROCESSING / PUBLISHED / PARTIALLY_PUBLISHED / FAILED / CANCELLED`. The decomposition above is a **proposal** to prevent conflating content, batch and job lifecycle; Argon should review and reconcile nomenclature.

### 8.2 Transition guard example
`SCHEDULED → QUEUED (due + enabled + valid account) → UPLOADING → PROCESSING → PUBLISHED`. On failure, classify recoverable vs final; unknown response goes to reconciliation, **not automatic fresh publish**. `PARTIALLY_PUBLISHED` arises only when completed destination set is mixed with failures or unfinished jobs under carefully documented rules.

### 8.3 Duplicate-publish prevention
- Frontend disables repeated submission but backend is authoritative.
- API `Idempotency-Key` per publish request + unique DB constraint + transactional create of batch/jobs/outbox.
- Workers claim jobs using distributed-safe lease/lock; control lease expiry and fencing/ownership.
- Store remote request/session IDs and provider post IDs; reconcile uncertain timeouts before retry.
- Distinguish repeatable `upload chunk` from non-idempotent `create remote post`.
- For provider APIs without robust idempotent create, document irreducible ambiguity and require reconciliation/manual review instead of blindly claiming exactly-once delivery.
- Webhook events are at-least-once; verify, dedupe and apply monotonic state transitions.

### 8.4 Retry policy
- Retry network transient, some `5xx`, rate limit with provider-specific `Retry-After`, exponential backoff + jitter, upper bound and dead-letter/manual review.
- Do not auto-retry permission revoked, bad content, invalid metadata, policy moderation denial, fraud/spam decisions, unsupported privacy settings.
- UI states whether retry is available and whether a new remote post could accidentally be created.

### 8.5 Scheduling semantics
- Store user-entered wall-clock time + chosen IANA timezone; compute and store UTC execution instant and original timezone.
- Explicitly handle past timestamps, DST ambiguity, edits, cancellation and scheduler downtime.
- For providers supporting native scheduling, evaluate a provider-specific strategy; do not assume all platforms do.
- Queue should survive restarts and recover missed execution without unsafe bursts.
- Separate **scheduled launch time**, **upload start time**, and **public availability time**; never promise an exact public publish second if provider processing/moderation is variable.

## 9. Provider adapter and capability matrix

### 9.1 Provider contract (shape for planning; adapt to code)

```ts
interface PublishingProvider {
  platform: 'youtube' | 'tiktok';
  getCapabilities(account: PlatformAccount): Promise<ProviderCapabilities>;
  connect(/* server-side OAuth context */): Promise<ConnectionResult>;
  refreshCredentials(connection: SocialConnection): Promise<void>;
  validate(input: FrozenPublishPayload): Promise<ValidationIssue[]>;
  createOrResumePublish(job: PublishJobContext): Promise<ProviderSubmission>;
  reconcileStatus(job: PublishJobContext): Promise<ProviderStatus>;
  normalizeError(error: unknown): ClassifiedPublishError;
  handleWebhook?(verifiedEvent: unknown): Promise<ProviderEventResult>;
  deleteRemotePost?(ref: RemotePublicationRef): Promise<ProviderActionResult>;
}
```

Define capability flags: videos/photos; formats/durations; caption length; thumbnail; privacy settings; drafts; direct publish; scheduling; status mechanism; analytics; supported ownership/account types; scope verification. `deleteRemotePost()` is **optional**, never assume permitted everywhere.

### 9.2 YouTube integration plan
- Google app/OAuth consent/screens/scopes (least privilege, generally upload scope where possible); test app/user quotas and verification state.
- Resumable video uploads (persist session and resume strategy; do not buffer entire file in app memory).
- Metadata includes title, description, tags, privacy; validate within documented API rules.
- Investigate YouTube Shorts behavior as a **format** within YouTube, not separate provider unless justified by API; avoid promises of Shorts classification.
- Verify final video ID/permalink and processing/publish state, separate upload succeeded from public viewing available.
- Implement quota budgeting and exhausted-quota UX; current official upload quota is granular, not the older default assumptions.

### 9.3 TikTok integration feasibility and behavior
- **GATE first:** app registration, approved scope (`video.publish` for Direct Post, `video.upload` for Upload-to-inbox if permitted), developer app audit, product eligibility, verified domain/prefix for `PULL_FROM_URL` where applicable.
- Call latest `creator_info/query` when composing/exporting; display correct creator nickname and allowed privacy options; validate returned maximum duration and account-specific restrictions.
- Require editable text, user consent and honest indication of moderation/processing delay.
- Direct Post flow: fetch creator info → prepare confirmed settings → initialize publish → transfer/pull file → poll/fetch or webhook → display final state.
- Published URL/ID may be unavailable until moderation or depending on visibility; use truthful PROCESSING/visibility labels.
- Upload-to-inbox is **not** auto-publish. If supported and used, label `Sent to TikTok inbox — creator must finish`, never `Published`.
- Implement rate limits from official docs per endpoint and bounded polling; explicit provider error taxonomy and handling of spam/policy errors without uncontrolled retries.

### 9.4 Future integrations
Instagram/Meta: evaluate professional account requirements, login flow, permissions, media container/publish/processing and eligible account types before committing. Facebook Pages, LinkedIn and X get separate discovery spikes and go/no-go policies, pricing and scopes; don't put them in MVP code paths merely because nav icons exist.

### 9.5 Capability-aware UX
The `Platform Editions` form must **render only supported controls** for the selected account and explain when a feature is unavailable. Do not normalize TikTok's privacy/cover/publish consent fields into fictional YouTube equivalents. Never assume status and analytics metrics are universally comparable.

## 10. Media ingestion and processing

1. Client requests signed upload; backend validates workspace, declared file type and limits.
2. Browser uploads directly to object storage using multipart/resumable strategy appropriate to size and provider; never pipe huge payloads through ordinary Next.js API unless architecture justifies it.
3. Backend verifies object existence, actual type/signature, size, checksum when practicable, and ownership.
4. Media worker probes container/codec/duration/resolution/aspect ratio; rejects unsupported/corrupt assets clearly.
5. Generate preview poster/thumbnail; treat FFmpeg as an isolated worker with resource/time limits and safe file handling.
6. Mark READY; store immutable asset/version reference for publish jobs.
7. Short-lived signed download URLs or restricted CDN delivery; TikTok `PULL_FROM_URL` requires verified and reachable URL pattern—assess trade-offs/security rather than exposing all uploaded videos publicly.
8. Retention/deletion policy for unposted draft assets, published assets, temp files and failed transcodes; no unbounded storage growth.

**Video policy matrix:** for each provider, version source/API limits and allow account-specific constraints. Never assert a permanent universal file-size/duration rule without verification.

## 11. API contract proposals

These are candidates, not a directive to overwrite existing routes.

| Use | Endpoint example | Notes |
|---|---|---|
| list content | `GET /api/contents?cursor=...` | workspace scoped; pagination |
| create draft | `POST /api/contents` | creator/workspace permission |
| update draft | `PATCH /api/contents/:id` | optimistic version |
| generate upload | `POST /api/media/uploads` | signed session; filename untrusted |
| finish upload | `POST /api/media/:id/complete` | server-side verified metadata |
| account connect | `GET /api/connections/:provider/start` | PKCE/state where applicable |
| OAuth callback | `GET /api/connections/:provider/callback` | server-side state/nonce/identity checks |
| account health | `GET /api/accounts` | expose safe profile, never secrets |
| create batch | `POST /api/publish-batches` | idempotency key + frozen payload |
| batch status | `GET /api/publish-batches/:id` | aggregate and per-job data |
| queue | `GET /api/publish-jobs` | filters/pagination |
| retry | `POST /api/publish-jobs/:id/retry` | permission + safe retry state |
| calendar | `GET /api/schedule` | timezone-aware window |
| webhook | `POST /api/webhooks/:provider` | signature verify and durable inbox |

Use consistent auth, error envelopes (stable `code`, safe message, retryability, correlation ID), schemas, payload size guards, cursor paging where appropriate, and documented boundary contracts.

## 12. Security, privacy, compliance and tenancy

**Critical baseline:**
- Protect secrets and OAuth tokens with encryption at rest + rotation procedures; never in frontend bundles, logs, traces or analytics.
- OAuth CSRF state, PKCE where supported/required, exact redirect URIs, constrained scopes and verified callback identity.
- User authorization at **resource and queue worker level**; membership checks; prevent IDOR/cross-tenant object access.
- Object storage validation: MIME + magic bytes, size, malware or policy scanning by risk, signed URL expiry, private bucket, no unlimited upload.
- Webhooks: raw-body signature validation/secret management, replay protection, event idempotency, fast 2xx ack after durable persistence.
- Apply rate limiting at API and account/provider levels, and backpressure for publishing.
- Audit connect/disconnect, schedule/publish, delete, retry, token reauthorization and administrator actions.
- User-owned content and platform terms: upload rights, copyright, consent, privacy notice, retention and delete/data export processes.
- Secure cookies/session, CSRF where relevant, CSP, security headers, dependency scanning, least-privilege DB/storage roles.
- Workspace roles proposed: `OWNER`, `ADMIN`, `EDITOR`, `VIEWER`; MVP may ship owner-only first if solo use is confirmed, while retaining tenant boundaries.
- No secrets, production tokens or real user data in screenshots, prompts, issue trackers or Argon outputs.

## 13. Analytics, observability and operational UX

### 13.1 Operational measurements (MVP)
Publish job counts by status/provider, retry counts, last error class, token health, scheduler delay, queue age, provider API latency/error rate, asset processing failures, orphan uploads, storage usage, and audit trail.

### 13.2 Creator performance analytics (P2)
Store provider raw metrics and internally normalized metrics separately; normalize only defensible concepts, preserve denominator/time window/freshness and source-platform differences. Display missing values as unavailable, never zero. Consider API eligibility and per-provider costs.

### 13.3 Logging and tracing
Structured redacted logs, request ID / batch ID / job ID / attempt ID / provider correlation ID; classify retryability; trace workflow from user action → outbox → worker → provider → webhook/poll → UI. Alert on stuck queue, excess failures, credential refresh loop, worker death, storage errors, webhook verification failures and scheduler slippage.

### 13.4 User-facing activity
Provide readable timeline: “Scheduled”, “Upload started”, “Processing at TikTok”, “Published on YouTube”, “TikTok needs reconnection”, and explicit suggested next action. Raw errors for developer/support behind sanitized expandable view only.

## 14. Repository / code structure (illustrative, not prescriptive)

```text
apps/
  web/
    app/(auth)/
    app/(workspace)/dashboard/
    app/(workspace)/content/
    app/(workspace)/create/
    app/(workspace)/publishing/
    app/(workspace)/calendar/
    app/(workspace)/accounts/
    app/(workspace)/settings/
    app/api/...
  worker/
    src/jobs/
    src/scheduler/
    src/media/
packages/
  ui/                     # Dream Press tokens/components
  domain/                 # types + transitions + invariants
  db/                     # migrations, schema, repository interfaces
  providers/
    core/
    youtube/
    tiktok/
  validation/
  observability/
  config/
infra/
  docker/
  deploy/
  monitoring/
docs/
  decisions/              # ADRs
  specs/                  # screen matrix, UX states, API mapping
  runbooks/
tests/
  fixtures/
  e2e/
```

**Argon should only recommend monorepo extraction if warranted by the actual existing repository**. Simpler feature folders under one Next.js app may be a better starting point if the app is early-stage; avoid unnecessary packages and premature microservices.

## 15. Quality strategy / test matrix

### Unit tests
- Provider capability/metadata validation; status reducers; batch aggregate; timezones; auth boundaries; retry classifier; payload freezing; signed URL guards.

### Integration tests
- Database transactions/outbox; job claiming and lease expiry; OAuth callback/state; credential encryption and refresh; object storage upload completion; provider mock adapters; webhook verification/dedupe; queue draining after restart.

### Contract tests
- YouTube/TikTok request/response fixtures; pagination, rate limits, changed scopes, moderation delay, missing remote post IDs, event delivery duplication; provider API drift checks.

### E2E product tests
- First-run connect account.
- Upload invalid/corrupt media → clear accessible error.
- Upload supported media → preview and metadata.
- Save draft → reload → edit without data loss.
- Shared Story → modify YouTube override → reset it → TikTok untouched.
- Select disconnected account → guided reconnect, cannot mistakenly publish.
- Publish to two mock providers → both succeeded → correct URLs.
- One succeeds/one fails → partial batch + individual retry.
- Slow provider processing → UI shows processing, not published.
- Network timeout after remote create → reconcile, not duplicate.
- Double submit/click → one batch.
- Worker restart and queue lease recovery.
- Timezone/DST boundary, edit scheduled post, cancel before dispatch, missed schedule.
- Expired access token, revoked scopes, creator max duration changed.
- Multi-tenant IDOR negative tests; keyboard-only Create Post.
- Manual smoke after production deploy; rollback and data migration dry-run.

### Design QA
1440/1280/1024; different browser font rendering; 200% zoom; long titles/handles; contrast; focus; sticky rail vs low viewport; production data density; errors in-context; print-grain performance and legibility.

### Delivery gates
No phase accepted for “page exists” alone. Pass observable behavior, automated tests, UX states, docs, rollback and monitoring as appropriate. A platform demo with stub success responses is **not** proof of API production publishing.

## 16. Implementation roadmap with exit gates

| Phase | Workstream | Primary deliverables | Exit gate |
|---|---|---|---|
| P0 | Discovery / feasibility | repo audit, exact API access status, audience/market constraints, deployment audit, baseline screenshot catalog, ADR candidates | product+API go/no-go documented |
| P1 | Product contracts | PRD, flows, screen matrix S01–S20, provider capability matrix, state transitions, threat model, schema ERD, architecture ADRs | ambiguity/risk signed off |
| P2 | Dream Press foundation | tokens, app shell, forms, status, Content Library, Dashboard, Create Post UX prototypes | design QA + accessibility + data-density check |
| P3 | Backend foundation | auth/workspace/RBAC, Postgres migrations, storage, secure connection model, background worker/queue/observability | staging app stable, service checks pass |
| P4 | Content/composer vertical slice | video upload/probe/preview, library, draft persistence, metadata overrides, validation, review | E2E draft journey with mock provider |
| P5 | YouTube production slice | OAuth, resumable upload, publish job, status reconciliation, URL, quota/error UX | verified sandbox/test-channel publish + restart/duplicate tests |
| P6 | TikTok approval and integration | approval decision; creator info, Direct Post or compliant fallback, webhook/poll, moderation, consent UX | account-specific public publish **only if approved**, otherwise explicit scope reset |
| P7 | Scheduling + resilience | UTC/IANA schedule, outbox, idempotent dispatch, retries, retry UI, cancellations, job timeline | fault-injection and partial-failure pass |
| P8 | Operations / beta | dashboard, queue, calendar, account health, security/performance/load/UAT, runbooks and alerts | pilot users complete critical flows reliably |
| P9 | Release / iterate | staging→production, backup, rollback, monitoring, pilot KPIs, post-launch bug triage | go-live decision based on evidence |
| P10 | Expansion | Meta, analytics, notifications, team workflow, AI, billing when validated | one capability at a time, with new API/policy gates |

**Ordering note:** P2 UX can run parallel to P0/P1; TikTok feasibility should begin during P0, not wait until P6, because approval could block the intended MVP definition.

## 17. Critical path and risk register

| Risk | Impact | Mitigation / owner question |
|---|---|---|
| TikTok Direct Post policy/audit fails | **Critical** | policy spike + intended-market confirmation; no false public-auto-post promise |
| No codebase or unclear existing implementation | High | repository audit first; mark proposed architecture rather than assuming it exists |
| Accidental duplicate live posts | Critical | idempotency + reconciliation + conservative retry |
| Cross-workspace publish/data leak | Critical | security model + API/worker-level permission tests |
| Auth/token scope or expiry | High | token vault, refresh strategy, health checks, reconnect UX |
| Scheduling inaccurate | High | UTC/IANA + provider latency caveats + DST tests |
| Large videos exhaust memory/storage | High | direct object upload + streaming workers + retention |
| Provider API changes/rate limit | High | adapter layer, capability matrix, contract tests, alerts |
| UX too dense/newspaper style hurts productivity | Medium-high | content-first hierarchy, accessible font size, design QA |
| Building 20 pages with no working publishing core | High | vertical slices and phase gates |
| Infrastructure cost/reliability | Medium-high | monitor storage/egress/worker/Redis/object transcode bills |
| Analytics misrepresents performance | Medium | raw/provider metrics, explicit freshness and metric semantics |

## 18. Estimated effort and resource logic

**No fixed dates or budget commitments before Argon audits the repository and confirms API access.** Use relative effort and dependency-based prioritization. The suggested backlog uses `S` (isolated), `M` (multi-component), `L` (substantial), `XL` (integration uncertainty). Complexity/risk may change sharply under provider audit requirements.

Cost model to estimate after discovery:
`Monthly operational cost = web hosting + database + queue/Redis (if used) + object storage GB-month + object egress + media CPU/transcode + logs/monitoring + domains/email + provider API charges (if any) + AI (P3 only)`.

Before paying for infrastructure, test with one developer, two accounts and realistic video assets; forecast 10 / 100 / 1,000 uploads/month scenarios, median and maximum video size, egress per destination, expected worker concurrency and data retention.

## 19. Definition of Done / merge/release protocol

For each task/PR:
- Requirement and acceptance criteria linked to ID and screen/state/route as applicable.
- Code diff reviewed for tenancy, token leakage, validation, retries, duplicate publishing.
- Unit/integration/E2E tests added appropriately; existing tests pass.
- Error/loading/empty/partial states designed and tested.
- No new dependency without rationale/cost/maintenance assessment.
- Migrations forward/backward deployment plan reviewed.
- Environment variables documented, secrets not committed.
- Logs and operational observability sufficient for debugging.
- Accessibility + responsive quick review for UI changes.
- Code owner explains affected files, data flow, risks and how to debug.

**Branch policy proposal:** small feature branches → CI → reviewed PR → staging smoke → safe merge → production deployment with backup/rollback. Avoid deploying by blindly pasting Stitch-generated code.

## 20. Argon required output, in order

1. **Executive assessment**: Can we realistically build the proposed product as described? What is the true critical path?
2. **Evidence inventory**: verified repository structure, modules, stack, schema, tests, environment; `UNKNOWN` where access missing.
3. **Gap analysis**: design references vs implemented features vs source brief; screen matrix S01–S20.
4. **Platform policy feasibility**: YouTube current quota/auth/verification and TikTok app/audit/audience limits; alternative/compliant path if blocked.
5. **Recommended architecture**: data flow, subsystem boundaries, chosen queue/storage, auth and tenancy, ADRs with alternatives/trade-offs.
6. **UX system plan**: Dream Press tokens, component matrix, Create Post user flow and all state coverage.
7. **Data model and contract**: ERD, constraints, migration strategy, job state machine, validation and API contracts.
8. **Detailed backlog**: IDs, phases, workstream, prerequisites, risk, relative size, precise completion criteria, tests.
9. **First shippable vertical slice**: step-by-step plan, exact files likely affected (only if repo inspected), demo script.
10. **QA/security/operations**: comprehensive test strategy, monitoring, backup/recovery, rollout, incident plan.
11. **Open decisions**: rank questions by impact, propose default where risk permits, don't ask trivial follow-ups.
12. **NO CODE IMPLEMENTATION in first pass**. Produce an actionable, reviewable plan and a readiness verdict.

## 21. Official documentation to verify (as of 22 Oct 2026)

- YouTube Data API resumable upload: https://developers.google.com/youtube/data/guides/using_resumable_upload_protocol
- YouTube quota / granular 2026 changes: https://developers.google.com/youtube/data/revision_history and https://developers.google.com/youtube/data/guides/quota_and_compliance_audits
- YouTube videos.insert: https://developers.google.com/youtube/data/reference/rest/v3/videos/insert
- TikTok Direct Post prerequisites: https://developers.tiktok.com/docs/en/content-posting-api-get-started
- TikTok Direct Post API: https://developers.tiktok.com/docs/en/content-posting-api-reference-direct-post
- TikTok creator information: https://developers.tiktok.com/docs/en/content-posting-api-reference-query-creator-info
- TikTok post status and webhooks: https://developers.tiktok.com/docs/en/content-posting-api-reference-get-video-status
- TikTok content sharing guidelines (especially intended use): https://developers.tiktok.com/docs/en/content-sharing-guidelines
- TikTok Upload to inbox: https://developers.tiktok.com/docs/en/content-posting-api-get-started-upload-content
- Instagram official API collection (for future phase): https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api

These URLs provide references, **not** proof of this project's actual app approval, scopes, quota or eligibility.

## 22. Handoff checklist

- [ ] Source MULTIPOST agent brief attached
- [ ] Existing repo attached or Argon has read-only inspection access
- [ ] Dream Press design system screenshot attached
- [ ] Content Library screenshot attached
- [ ] Latest Dashboard screenshot attached
- [ ] Latest Create Post screenshot attached
- [ ] Confirm intended real audience and whether SaaS/public creators or internal tool
- [ ] Confirm Google Cloud project and TikTok Developer app/scope/audit state **without sharing secrets**
- [ ] Confirm budget / deployment constraints / existing storage
- [ ] Argon delivers audit & planning report before implementing any change

---

*This blueprint represents a proposed system architecture and product roadmap. It deliberately distinguishes user-provided feature/design requirements from external vendor constraints and unverified repository assumptions.*

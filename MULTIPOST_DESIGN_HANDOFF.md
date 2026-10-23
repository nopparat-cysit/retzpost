# MULTIPOST Dream Press — Stitch Design Handoff & UI Audit Checklist

**Reference snapshot:** 22 October 2026. All attached images are concept captures from Stitch, NOT evidence of implemented software.

## 1. Visual direction that should be preserved

- Identity: **Dream Press / Newspaper × Retro × Modern × Subtle Dream**.
- Product feeling: editorial publishing studio with modern utility controls; content-first, focused, premium, not an old newspaper simulation.
- Color hierarchy: warm paper canvas and soft near-white surfaces; dark ink; indigo for product primary action/navigation; terracotta/ochre as restrained editorial supporting accents; semantic error/warning/success separate from brand colors.
- Type: **Newsreader** for headlines/selected large numerals; **Geist** for app UI/forms/tables/long body; **JetBrains Mono** for short technical metadata/section labels.
- Shapes: compact border radius, no excessive cards, thin editorial horizontal rules, numbered sections, editorial mastheads, thumbnail prominence.
- Dream elements: subtle ghost text/halftone/print grain only, never obscure controls or content.

## 2. Image index, in the order of visual authority

1. `references/01_design_system_board.png`: initial generated token/UI board. **Exploratory**, not the definitive token source.
2. `references/02_content_library_reference.png`: editorial Content Library visual draft. Review typography density, thumbnail hierarchy, filters, hidden actions; may not reflect subsequent prompt revisions.
3. `references/03_dashboard_reference_latest.png`: latest seen Dashboard V2. Visual direction treated as approved; still requires actual accessibility/use-case validation.
4. `references/04_create_post_reference_latest.png`: latest seen Create Post V2. **Requires layout refinement** to reduce vertical scroll, improve sticky review rail, and collapse platform editions.
5. `references/05_old_ui_context.png`: original enterprise-looking Stitch design with many screens. **Functional/sitemap reference only**; do not use its blue/white theme as final brand reference.

## 3. UX rules for each key screen

### Dashboard / Publishing Dispatch Desk
- Priority order: urgent actionable publishing issue; active publishing jobs; upcoming schedules; connected account health; performance later.
- Avoid displaying mock performance numbers as if real when backend not implemented.
- Allow `Review in Queue` / `Reconnect` / `Retry` only when state permits.
- Keep data readable without tiny labels, especially on 1280 / 1024 desktop widths.

### Content Library / Archive
- Each row: thumbnail → title → platform & job status → date/time → one metric if available → single contextual action.
- Search/filter by status, platform, type, date, account, with useful empty/no result state.
- Options such as view/duplicate/delete appear contextually; confirmation for destructive delete.
- Long video names, thumbnails missing, no metadata and partial multi-platform result are explicit states.

### Create Post / Editorial Composer (highest UX priority)
- Six connected sections: Media → Distribution → Shared Story → Platform Editions → Publishing → Review.
- Two-column on desktop, sticky but bounded right summary rail. Account for narrow viewport/short screen; avoid inaccessible CTA below fold.
- **Media**: preview, filename, format/ratio/duration/size validation.
- **Distribution**: platform cards show platform + exact target account + connected/reconnect state; don't use tiny checkbox alone.
- **Shared Story**: title, caption, description, tags, CTA as appropriately mapped (not every platform supports every field).
- **Platform Editions**: accordion one open at a time, show inherited/customized/resets; never suggest a setting exists if current provider/account can't apply it.
- **Publishing**: Now vs Schedule; date, time and timezone only for schedule.
- **Review**: summarize exact assets, accounts, privacy settings and each provider's behavior; warnings/consent; specific CTA (Publish to 2 Accounts).
- Preserve entered data across section changes and supported refresh/draft lifecycle.
- Trim excessive helper text and vertical whitespace. The existing capture is much too tall to serve as a final day-to-day composer.

### Publishing Queue / Job Detail
- Table/list is fine (function before retro effect); status per platform; show attempts and sanitized error.
- Differentiate transient retryable vs permanent failures and unknown remote state.
- Account for `YouTube Published + TikTok Failed` as partial batch with independent recovery.

### Calendar
- Editorial date numerals can add identity; scheduling actions and timezone must remain clear.
- Filter platforms/accounts; don't imply provider can guarantee exact public availability time.

### Connected Accounts
- Platform icon + verified nickname/channel handle, scopes or usable capabilities, connection health.
- Reconnect flows with action; no tokens/secrets exposed in DOM or screenshots.

### Analytics (later)
- Separate platform metrics; show last updated/freshness, avoid fake comparability of views/engagement.

## 4. Component acceptance rules

For Button / Input / Search / Status / Platform selector / Media Preview / Accordion / Publishing summary / Job row / Dialog / Toast / Sidebar, document:
- Rest, hover, focus, active, disabled, loading, invalid and success states where relevant.
- Keyboard and screen-reader patterns.
- Long-title truncation/disclosure.
- Data loss prevention and confirmation semantics.
- Background/foreground contrast (WCAG 2.2 AA target) and visible focus.
- Mobile/narrow desktop overflow and status non-color dependence.

## 5. Visual consistency checklist for Stitch → implementation

- [ ] Same sidebar width, header rhythm, accent use, active navigation, whitespace.
- [ ] Same fonts/weight system and visible contrast on all major routes.
- [ ] Same source of truth tokens, without magic hex values scattered in JSX.
- [ ] Same CTA priority, button variants, input states, status wording.
- [ ] Same platform icon/connection conventions and only provider-supported features.
- [ ] Same error states and retryability language.
- [ ] Large preview + readable content title; utility metadata quieter.
- [ ] Distinguish *Design-only* vs *Implemented/Connected* vs *Validated with real API*.
- [ ] Use actual account/video fixtures, sanitized data and accessible labels for handoff demos.

**Practical rule:** Do not mass-generate every screen after changing typography/color. Validate Dashboard, Content Library and Create Post first, then apply shared tokens/components to Queue, Calendar, Accounts, Settings, edge states and later Analytics.

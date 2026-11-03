---
name: retzpost-i18n
description: >-
  Standard guide, typography rules, and translation architecture for RETZPOST
  bilingual (Thai & English) development. Use whenever adding or editing UI strings,
  pages, components, prices, typography, fonts, or numeral formatting in RetzPost.
---

# RETZPOST Bilingual (TH / ENG) & Typography Skill

This skill governs the internationalization (i18n), localized formatting, font selection, and numeral rendering standards for **RETZPOST** — the automated multi-platform editorial publishing desk.

---

## 1. Core Architecture

The RETZPOST i18n system is modular, fully type-safe, and client/server reactive. It resides in `src/modules/i18n/`:

```
src/modules/i18n/
├── i18n-types.ts          # Schema types for Locale ('th' | 'en') and translation keys
├── i18n-context.tsx        # LanguageProvider, useTranslation() hook, <LanguageToggle />
├── i18n-formatters.ts     # formatCurrencyThb, formatTokenCount, formatLocalizedDate
├── i18n.test.ts           # Automated test enforcing 100% key parity
└── translations/
    ├── th.ts              # Complete Thai dictionary (Editorial Broadsheet tone)
    └── en.ts              # Complete English dictionary (Global Newsroom tone)
```

### Persistence & Sync
- **Active Locale**: `'th'` (default) or `'en'`.
- Stored in `localStorage.getItem('retzpost_language')`.
- Broadcasted via `retzpost:language-change` event.
- Synchronized to `document.documentElement.lang`.

---

## 2. Typography & Numeral Standards (CRITICAL RULE)

> [!IMPORTANT]
> **Numeral Lining & Tabular Figures Requirement (`lnum` + `tnum`)**:
> - Traditional editorial serif fonts (such as *Newsreader*) default to **Old-Style Figures** (lowercase numerals where numbers 3, 4, 5, 7, 9 drop below the baseline).
> - In financial, pricing, and SaaS dashboard contexts (e.g. `฿79`, `฿199`, `150 🪙`, `99.98% SLA`), old-style numbers look uneven, misaligned, or strange.
> - **Mandatory CSS Rule**: All typography, prices, tokens, tables, and metrics MUST enforce **Lining Numerals** and **Tabular Figures**:
>   ```css
>   font-variant-numeric: tabular-nums lining-nums;
>   -webkit-font-feature-settings: "lnum" 1, "tnum" 1;
>   font-feature-settings: "lnum" 1, "tnum" 1;
>   ```
> - **Primary Thai & Latin UI Font**: Use **`IBM Plex Sans Thai`** paired with **`Plus Jakarta Sans`** for all body, card, button, and interface text.
> - **Editorial Serif Display (`font-display` / `Newsreader`)**: Reserved EXCLUSIVELY for broadsheet masthead hero titles.
>
> **STRICT FONT CLASS USAGE RULES**:
> 1. **DO NOT use `font-serif` on UI components**: Account cards, channel titles ("Facebook", "No boring Station"), buttons, inputs, modal dialogs, and table rows must NEVER use `font-serif`. Use `font-sans font-bold` or `font-semibold`.
> 2. **DO NOT use `font-mono` on Thai text, buttons, or status pills**: Monospace fonts (JetBrains Mono) contain NO Thai glyphs. Placing `font-mono` on Thai strings like "+ เพิ่มเพจ Facebook" or "พร้อมใช้งาน" triggers ugly Windows typewriter / Angsana serif fallbacks.
> 3. **`font-mono` is strictly for technical IDs**: Only use `font-mono` for pure alphanumeric IDs (e.g. `ID: facebook_409689`), hashes, API keys, or code snippets, combined with `tabular-nums`.
> 4. **Tailwind Fallback Invariant**: `tailwind.config.ts` must maintain `'"IBM Plex Sans Thai"'` across `sans`, `serif`, and `mono` font stacks so no glyph ever falls back to legacy Windows serif.

---

## 3. Developer / Agent Workflow for Adding New Strings

Whenever creating a new page, modal, or component:

### Step 1: Update the Schema in `i18n-types.ts`
Add the new key under the appropriate module namespace (e.g., `common`, `dashboard`, `settings`, `pricing`, etc.):

```typescript
export interface CommonTranslations {
  // ... existing keys
  myNewAction: string;
}
```

### Step 2: Add the Translation to BOTH `th.ts` and `en.ts`
Never add a key to only one language. Both dictionaries must have identical key paths:

```typescript
// in th.ts
myNewAction: 'การกระทำใหม่',

// in en.ts
myNewAction: 'My New Action',
```

### Step 3: Consume via `useTranslation()`
In your React component (`'use client'`):

```tsx
import { useTranslation } from '@/modules/i18n/i18n-context';

export function MyComponent() {
  const { t, locale } = useTranslation();

  return (
    <div>
      <h3>{t('common.myNewAction')}</h3>
      {/* For dynamic interpolation: */}
      <p>{t('pricing.billingVat', { rate: 7 })}</p>
    </div>
  );
}
```

### Step 4: Formatting Currency, Tokens & Dates
Use dedicated helpers from `src/modules/i18n/i18n-formatters.ts`:

```typescript
import { formatCurrencyThb, formatTokenCount, formatLocalizedDate } from '@/modules/i18n/i18n-formatters';

// Currency: renders "฿199" in 'th', "฿199 THB" in 'en'
formatCurrencyThb(199, locale);

// Tokens: renders "150 🪙"
formatTokenCount(150, locale);

// Date: localized day/month/year
formatLocalizedDate(new Date(), locale);
```

---

## 4. Navigation & Route Separation Rules

1. **Root (`/`) is the Landing Page**:
   - Visitors arriving at `/` see the broadsheet Landing Page.
   - **Auto-Redirect Rule**: If `getCurrentUser()` is truthy on client mount, the user MUST be immediately redirected to `/desk` (the workspace).
2. **`/desk` is the Operations Desk Dashboard**:
   - Holds the queue, telemetry sync, KPI engine, and AI diagnosis.
   - Has the full AppShell sidebar.
   - Route `/dashboard` redirects to `/desk`.
3. **Docs & Legal Decoupling**:
   - Public Landing Page header (`PublicHeader`) contains ONLY:
     - Dream Press Desk (`/`)
     - Pricing (`/pricing`)
     - Docs (`/docs`)
     - Language Switcher (`<LanguageToggle />`)
     - Profile or Login/Register CTA
   - Links for **Privacy Policy (`/privacy`)** and **Terms of Service (`/terms`)** are nested inside the **Docs & Legal Sub-Navigation (`<DocsSubNav />`)** within `/docs`, `/privacy`, and `/terms`.

---

## 5. Verification Checklist

Before finishing any task touching strings, UI, or typography:

```bash
# 1. Run the i18n test suite (enforces 100% key parity)
npm test src/modules/i18n/i18n.test.ts -- --run

# 2. Run the entire test suite
npm test -- --run

# 3. Check TypeScript types
npx tsc --noEmit

# 4. Check production build
npm run build
```

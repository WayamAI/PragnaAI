# PragnaAI: Chronus redesign audit (Step 1)

Accelerator: PragnaAI (FMEA Intelligence, by Wayam AI). Repo: `D:\PragnaAI-main`. Reference: `D:\BOM_synchronization-main`.
Read first: `CHRONUS_DESIGN_SYSTEM.md` (in repo root), `BOM_SYNC_REFERENCE.md` (in repo root), and BOM Sync's `REDESIGN_REPORT.md`.
This step made **no edits** to any existing file. The only file created is this one.

## Headlines

1. **This repo is not a clone of the BOM Sync stack.** It is TanStack Start (SSR, Nitro) with **Tailwind v4**, not Vite + React Router + Tailwind 3. Chronus is also Tailwind v4, so tokens map natively with `@theme inline`. BOM Sync's `tailwind.config.ts` and `index.css` do not carry over, but its token file, primitives and chart theme mostly do.
2. **There is no test suite and no git repo.** `npm test` does not exist; no test files, no runner. The folder has no `.git`, so "one commit per step" and the commit hash are not possible until you decide how to handle it (Decision 1).
3. **Almost no shared UI is in use.** Of 45 shadcn files in `components/ui/`, the app imports exactly one (`sonner.tsx`). Every page hand-writes its Tailwind classes. The redesign is therefore mostly page-by-page class rewriting plus new primitives, not "restyle the shadcn kit".
4. **The shell is a different shape from Chronus.** Fixed 240px dark-navy sidebar, 64/72px sticky header, page title is an `h1` inside every page (`PageContainer`), no rail, no nav groups, no theme toggle. The `.dark` token block exists but nothing ever sets the class.
5. **Lint fails at baseline** (517 prettier errors + 8 warnings), so "npm run lint passes" can never be a gate. We compare against the baseline numbers instead.

---

## 0. Baseline

Run in a **scratch copy** (`npm ci` from the lockfile, in a temp folder), so the repo itself got no `node_modules`, `.output`, or lockfile changes.

| Check | Result |
|---|---|
| Git commit | **n/a, the folder is not a git repository** (no `.git`) |
| `npx tsc --noEmit` | **Pass** (exit 0, no errors) |
| `npm test` | **Not available.** `npm error Missing script: "test"`. No test files, no vitest/jest config. 0 tests |
| `npm run build` (SSR, Nitro `cloudflare-module`) | **Pass** (exit 0, built in about 2.8s). One warning: `inlineDynamicImports` option ignored because `codeSplitting` is set |
| `npm run lint` | **Fail** (exit 1): **525 problems = 517 errors, 8 warnings** |
| `npm ci` side note | 5 high-severity vulnerabilities reported by npm audit (not investigated, not fixed) |
| `npm run build:gh-pages` | Not run in this step (separate SPA build path). Will be added to the later checks |
| Browser console check | Not run (audit step) |

Lint breakdown:
- **517 errors are all `prettier/prettier`** (formatting: indentation, line wrapping, missing newlines). None are CRLF issues. Worst files: `AppSidebar.tsx` 98, `data/hierarchy.ts` 66, `routes/overview.tsx` 53, `data/misc.ts` 38, `routes/reports.tsx` 32, `data/dfmea.ts` 31, `routes/workspace.tsx` 27, `TopHeader.tsx` 22, `routes/hierarchy.tsx` 21. Also in `vite.config.ts`, `vite.gh-pages.config.ts`, `login.tsx`, `__root.tsx`, `ai-analysis.tsx`, `risk-register.tsx` and others.
- **8 warnings:** 7 × `react-refresh/only-export-components` (`shared/RiskBadge.tsx`, shadcn `ui/badge`, `button`, `form`, `navigation-menu`, `sidebar`, `toggle`), 1 × `react-hooks/exhaustive-deps` (`__root.tsx:147`, missing dependency `router`).
- Implication: do **not** run `prettier --write .` as part of the redesign (it would rewrite logic files and data). New and rewritten files should be prettier-clean; the lint total should go down or stay equal, never up.

---

## 1. Folder tree and backend boundary

```
PragnaAI-main/
├─ .github/                      CI + README screenshots     [BACKEND/CI: DO NOT TOUCH workflows/]
│  ├─ assets/                    overview-screenshot.png, risk-register-screenshot.png (README only)
│  └─ workflows/gh-pages.yml     GitHub Pages deploy
├─ public/                       [FRONTEND assets]
│  ├─ favicon.svg
│  └─ brand/ wayam-logo-light.svg, wayam-logo-dark.svg
├─ src/                          [FRONTEND]
│  ├─ routes/                    13 files (file-based routes)
│  ├─ components/
│  │  ├─ layout/                 AppSidebar, TopHeader, AIAssistantPanel
│  │  ├─ shared/                 EngineerAvatar, PageContainer (+Card), RiskBadge, StatusBadge
│  │  └─ ui/                     45 shadcn/Radix files (only sonner.tsx is used)
│  ├─ data/                      6 static mock-data files (no backend)
│  ├─ hooks/use-mobile.tsx
│  ├─ lib/                       utils (cn), auth (demo localStorage), error-* (SSR error wrapper)
│  ├─ styles.css                 single global stylesheet (Tailwind v4 + tokens)
│  ├─ router.tsx, routeTree.gen.ts (generated), entry-spa.tsx   [ROUTER/BOOT: logic]
│  └─ server.ts, start.ts        [SERVER ENTRY: DO NOT TOUCH]
├─ gh-pages.html                 SPA entry for the GitHub Pages build
├─ vite.config.ts, vite.gh-pages.config.ts, tsconfig.json, eslint.config.js,
│  .prettierrc, .prettierignore, bunfig.toml, components.json,
│  package.json, package-lock.json, .gitignore, README.md
└─ CHRONUS_DESIGN_SYSTEM.md, BOM_SYNC_REFERENCE.md   (reference docs, read-only)
```

There is **no backend in this repo**: data is static mock data in `src/data/`. Authentication is a fake localStorage session. No `.env*` files exist at the root. The only server-side code is the SSR wrapper.

**DO-NOT-TOUCH list (explicit):**
- `src/server.ts`, `src/start.ts` (SSR entry and error middleware)
- `src/lib/error-capture.ts`, `src/lib/error-page.ts`, `src/lib/error-reporting.ts` (SSR error handling; `error-page.ts` also has inline hard-coded colours in an HTML string, see Risks)
- `src/router.tsx`, `src/routeTree.gen.ts` (generated; never edit), `src/entry-spa.tsx` (see note in Section 2: only its CSS/font imports would change, with approval)
- `vite.config.ts`, `vite.gh-pages.config.ts`, `gh-pages.html`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `bunfig.toml`, `components.json`
- `package.json`, `package-lock.json` (no new deps without approval)
- `.github/workflows/gh-pages.yml` (CI), `.gitignore`
- Any `.env*` and service config (none present; Nitro/wrangler config is generated at build)
- Logic files: `src/lib/auth.ts`, `src/lib/utils.ts`, `src/hooks/use-mobile.tsx`, all of `src/data/*` except wording/format edits that are explicitly approved (see Section 6, Wording)

---

## 2. Frontend stack (versions from package.json)

| Concern | Value |
|---|---|
| Framework / bundler | React `^19.2.0`, **TanStack Start** `^1.168.26` (SSR) on **Vite `^8.0.16`**, Nitro `3.0.260603-beta` (preset `cloudflare-module`, or `vercel` when `VERCEL` is set), `@vitejs/plugin-react ^5.2.0`, lightningcss transformer |
| Static build | Separate SPA build for GitHub Pages: `vite.gh-pages.config.ts` + `gh-pages.html` + `src/entry-spa.tsx`, `base: "/FMEA/"`, `basepath: import.meta.env.BASE_URL` |
| Router | `@tanstack/react-router ^1.170.16`, file-based, `scrollRestoration: true`. `/` redirects to `/overview` |
| Styling | **Tailwind CSS `^4.2.1`** via `@tailwindcss/vite`. CSS-first: **no `tailwind.config`**. One CSS file `src/styles.css` (`@import "tailwindcss" source(none); @source "../src"; @import "tw-animate-css"`). Design tokens are **oklch** variables in `:root` and `.dark`, mapped by `@theme inline` |
| UI libraries | shadcn/ui "new-york" (`components.json`, base colour slate) over 24 Radix packages, `cmdk`, `vaul`, `sonner`, `embla-carousel-react`, `react-day-picker`, `input-otp`, `react-resizable-panels`. **Only `sonner` is actually used** |
| `cn()` | `src/lib/utils.ts` = `twMerge(clsx(...))`, `tailwind-merge ^3.5.0`. **Used only inside `components/ui/*`.** Pages build class strings with template literals |
| Icons | `lucide-react ^0.575.0` (Chronus uses `^1.34.0`; stroke width is not globally set, lucide default 2) |
| Charts | `recharts ^3.9.0` (only on `/overview`: one bar chart, six donut rings). The risk matrix and traceability matrix are hand-built tables/divs |
| Tables | Hand-written `<table>` elements, 7 of them. No table library |
| Forms / validation | `react-hook-form ^7.71.2`, `@hookform/resolvers`, `zod ^3.24.2` are installed but **unused**. The only real form is login (plain controlled inputs + a manual empty check) |
| State / data | `@tanstack/react-query ^5.101.1` (provider only; **no queries anywhere**). Local `useState` throughout. Static mock data from `src/data/*` |
| Fonts | `@fontsource/inter` 400/500/600, `@fontsource/ibm-plex-sans` 500/600, `@fontsource/ibm-plex-mono` 400. Imported as side-effect CSS in `routes/__root.tsx` **and** `entry-spa.tsx`. `--font-sans` Inter, `--font-display` IBM Plex Sans, `--font-mono` IBM Plex Mono |
| Theme mechanism | `@custom-variant dark (&:is(.dark *))`. `.dark` token block defined, **but nothing in the app ever sets the class**: no provider, no toggle, no storage key. Effectively light-only |
| Test runner | **None** |
| Scripts | `dev` (vite dev), `build` (vite build), `build:dev` (vite build --mode development), `build:gh-pages`, `preview`, `lint` (eslint .), `format` (prettier --write .) |
| Other | `date-fns`, `class-variance-authority`, `clsx`, `tw-animate-css`, `vite-tsconfig-paths`; `bunfig.toml` sets a 24h minimum release age |

**Stack comparison with BOM Sync:** BOM Sync is React 18 + Vite 5 + `react-router-dom` 6 + **Tailwind 3.4** (`tailwind.config.ts`) + `next-themes` + vitest + `tailwind-merge ^2.6` + `lucide ^0.462` + `recharts 2.15`. Only React, Recharts, shadcn and lucide match in kind.

**Tailwind version decision:** the "stay on 3" lesson does not apply. The repo is already on v4, which is what Chronus uses. Stay on v4, copy the Chronus `@theme inline` pattern from the design system doc §6.3.

---

## 3. Pages and routes

Routing is file-based under `src/routes/`. Auth gating is in `__root.tsx` (not per route): when not authenticated and the path is not `/login`, it renders `null` and navigates to `/login`.

| Path | File | Purpose | Main components | User actions |
|---|---|---|---|---|
| `/` | `routes/index.tsx` | Redirect to `/overview` | none | none |
| `/login` | `routes/login.tsx` | Demo sign-in (any non-empty email and password) | gradient background, logo, card, 2 inputs | type email (`#email`), password (`#password`), submit; toast on empty or success; navigates to `/overview` |
| `/overview` | `routes/overview.tsx` (17.6KB) | Dashboard: KPIs, risk matrix, completion rings, RPN histogram, activity, AI agent cards | `PageContainer`, `Card`, Recharts `PieChart` ×6 and `BarChart`, hand-built S×O matrix table, `IntegrationsPopup` modal | open data-source modal (banner button, auto-opens once per session), close modal, "Manage integrations" link, "Open AI Analysis" link |
| `/hierarchy` | `routes/hierarchy.tsx` | Product tree with per-node DFMEA status | `TreeNode` (recursive), `StatusDot`, `StatusBadge`, `RiskBadge`, `RpnCell`, one table | select node, expand/collapse, "Open DFMEA Workspace" link, "AI: Analyze This Component" (toast), search input (not wired) |
| `/workspace` | `routes/workspace.tsx` | Failure-mode working table | filter bar, 13-column table, right detail drawer, `Field` | search, risk select (filters), 3 inert selects, "Add Failure Mode", "AI: Suggest…", "Export", "Approve All Reviewed" (all toasts), row click opens drawer, drawer close |
| `/ai-analysis` | `routes/ai-analysis.tsx` | Review AI-suggested failure modes | KPI cards, 5 inert selects, suggestion cards | per card: Accept, Edit & Accept, Reject, Flag for Team (all toasts) |
| `/risk-register` | `routes/risk-register.tsx` | Portfolio risk table | KPI cards, filter bar, 13-column table | "Show Residual RPN" checkbox (highlights header only), search and 3 selects (inert) |
| `/traceability` | `routes/traceability.tsx` | Requirement to verification coverage | view switch, matrix of coloured cells, chain boxes, `Legend` | switch Matrix View / Chain View, failure-mode select (inert) |
| `/knowledge-base` | `routes/knowledge-base.tsx` | Search organisational knowledge | search input, suggestion chips, source chips, result cards, index card | type query, Enter to search (toast), click suggestion chip, click source chip, "Use in DFMEA Workspace", "View Full Record" (toasts) |
| `/documents` | `routes/documents.tsx` | Document list + upload dropzone | dashed dropzone, 9-column table | drag-and-drop (toast only), "Browse" (toast), per row "View" and "Re-extract" (toasts) |
| `/integrations` | `routes/integrations.tsx` | Connected systems | summary strip, flow chips, 6 system cards, `StatusPill` | "Sync all" (toast) |
| `/reports` | `routes/reports.tsx` | Configure and generate exports | radio list, scope radios, option checkboxes, "Recent Reports" table | pick report type (state), scope/option inputs (uncontrolled), "Generate Report" (toast) |
| **404** | `__root.tsx` `NotFoundComponent` | Not found | centred card | "Go home" link |
| **Error boundary** | `__root.tsx` `ErrorComponent` | Route error | centred card | "Try again" (invalidate + reset), "Go home" |

**Global overlays (inside the authed shell):**
- `AppSidebar`: Settings modal (3 toggles; Cancel, Save changes) and Help & Standards modal (5 standard buttons, Contact support, Got it).
- `TopHeader`: notifications dropdown (3 items + "Mark all as read"), help dropdown (4 links + "Open documentation"), "Switch project" pill (toast), user chip, log-out button.
- `AIAssistantPanel`: floating button, **Ctrl/Cmd+K** toggles a right-hand chat drawer (canned replies after a 1.3s timeout, 3 suggestion chips, free text input, Clear).

---

## 4. Shared components

| Component | File | Used by |
|---|---|---|
| `PageContainer` (title/subtitle/actions wrapper, `h1`) | `shared/PageContainer.tsx` | all 10 app pages (not login) |
| `Card` (`rounded-lg border bg-card p-5`) | `shared/PageContainer.tsx` | overview, workspace, hierarchy, ai-analysis, risk-register, traceability, knowledge-base, documents, integrations, reports |
| `RiskBadge`, `RpnCell`, `badgeForRpn` | `shared/RiskBadge.tsx` | workspace, hierarchy, ai-analysis, risk-register |
| `StatusBadge`, `StatusDot` | `shared/StatusBadge.tsx` | `StatusBadge`: workspace, hierarchy, risk-register, documents. `StatusDot`: hierarchy |
| `EngineerAvatar` | `shared/EngineerAvatar.tsx` | workspace, risk-register, documents, reports, TopHeader |
| `AppSidebar`, `TopHeader`, `AIAssistantPanel` | `layout/*` | `__root.tsx` |
| `Toaster` | `ui/sonner.tsx` | `__root.tsx` (2 places) |
| Local-only: `TreeNode`, `Field`, `Legend`, `StatusPill`, `IntegrationsPopup`, `ModalShell`, `Toggle`, `SettingsModal`, `HelpModal`, `Dropdown` | inside their route/layout files | their own file only (note `StatusPill` in integrations and the two inline pills in overview's popup duplicate each other) |

**Unused (flag):**
- `components/ui/*`: **44 of 45 files have no import from app code** (accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, switch, table, tabs, textarea, toggle-group, toggle, tooltip). Some import each other (dialog→command, button→calendar/pagination/carousel, etc.).
- `hooks/use-mobile.tsx` is used only by the unused `ui/sidebar.tsx`. `lib/utils.ts` (`cn`) is used only by `ui/*`.
- Installed but unused packages: `react-hook-form`, `@hookform/resolvers`, `zod`, `cmdk`, `vaul`, `embla-carousel-react`, `react-day-picker`, `input-otp`, `react-resizable-panels`, `date-fns`, most Radix packages.
- Unused exports: `data/misc.ts` `STANDARDS`; `data/dfmea.ts` `rpn`, `riskLevel` (note `riskLevel` differs from `badgeForRpn` and is dead).
- Unused logic: `lib/auth.ts` `getSession` is used only internally.

---

## 5. Logic boundary map

Legend: **STYLE-SAFE** = markup/classes only. **MIXED** = markup and logic in one file (logic regions listed). **LOGIC-ONLY** = do not touch.

| File | Class | Notes (logic regions) |
|---|---|---|
| `styles.css` | STYLE-SAFE | main target |
| `components/shared/PageContainer.tsx` | STYLE-SAFE | props are the contract (`title`, `subtitle`, `actions`, `children`, `className`) |
| `components/shared/EngineerAvatar.tsx` | STYLE-SAFE | reads `TEAM[name]` (keep lookup) |
| `components/shared/StatusBadge.tsx` | STYLE-SAFE | status string to class map; keep keys |
| `components/shared/RiskBadge.tsx` | MIXED | **logic: `badgeForRpn` (lines 11–16)**, RPN→level thresholds; `RpnCell` level→colour at 25–28 is style |
| `components/layout/AppSidebar.tsx` | MIXED | logic: `isActive` (31), `modal` state (32), `Toggle` state (138–152), `console.log` calls (100, 145, 215), toast calls (183, 215, 226). Nav `items` (11–22) and `STANDARDS_HELP` (190–196) are content |
| `components/layout/TopHeader.tsx` | MIXED | logic: panel state and `toggle` (25–30), `handleLogout` (31–34), toast calls and `console.log`. Content: `NOTIFICATIONS`, `HELP_LINKS` arrays |
| `components/layout/AIAssistantPanel.tsx` | MIXED | logic: whole component up to the return (`CANNED`, Ctrl/Cmd+K listener 20–29, `send` 31–44, timeout). Markup 46–106 is style |
| `routes/__root.tsx` | MIXED | logic: head/meta config (87–112), auth gate and `useEffect`s (128–162), `ErrorComponent` effects. Style: `NotFoundComponent` (27–47), `ErrorComponent` markup, shell markup (164–178) |
| `routes/index.tsx` | LOGIC-ONLY | redirect |
| `routes/login.tsx` | MIXED | logic: `handleSubmit`, state, `login()`, navigate (11–29). Markup 31–111 style |
| `routes/overview.tsx` | MIXED | logic: `riskZone` colours/thresholds (28–35, **bg/text hex returned from logic**), `useEffect` + sessionStorage (62–68), `connected`, `highCount` reduce (69–73). Data consts `KPI`, `HEATMAP`, `RINGS`, `RPN_BUCKETS` (**contain hex `fill` and Tailwind tone classes**), `AGENTS`. Rest is markup |
| `routes/workspace.tsx` | MIXED | logic: filter state and `useMemo` (14–23), handlers in `actions`. Rest markup |
| `routes/hierarchy.tsx` | MIXED | logic: `TreeNode` open state (14–16), select, toast. Rest markup |
| `routes/ai-analysis.tsx` | MIXED | logic: toast handlers only |
| `routes/risk-register.tsx` | MIXED | logic: sort (13), `showResidual` state, `critical = s >= 9` |
| `routes/traceability.tsx` | MIXED | logic: `cellState` pseudo-random matrix (18–24), `view` state, `COLOR` map (25), **dynamic class names `border-${tone}-300 bg-${tone}-50` (99)** |
| `routes/knowledge-base.tsx` | MIXED | logic: query/source state, `runSearch`, Enter key handler |
| `routes/documents.tsx` | MIXED | logic: drag/drop handlers, toasts |
| `routes/integrations.tsx` | MIXED | logic: `connected` count, toast |
| `routes/reports.tsx` | MIXED | logic: `type` state, toast. Uncontrolled radios/checkboxes |
| `components/ui/sonner.tsx` | STYLE-SAFE | the only used shadcn file |
| other 44 `components/ui/*` | STYLE-SAFE (unused) | `sidebar.tsx`, `carousel.tsx`, `form.tsx` contain hook logic but are not imported |
| `data/team.ts` | MIXED | content + **Tailwind colour classes per person** (`color` field) |
| `data/dfmea.ts`, `hierarchy.ts`, `ai-suggestions.ts`, `misc.ts`, `integrations.ts` | LOGIC-ONLY (data) | `integrations.ts` references lucide icon components. Wording or date-format edits possible only with approval |
| `lib/auth.ts`, `lib/utils.ts`, `lib/error-*.ts`, `hooks/use-mobile.tsx`, `router.tsx`, `server.ts`, `start.ts`, `entry-spa.tsx`, `routeTree.gen.ts` | LOGIC-ONLY | |

### Things to preserve

**Element ids:** `#email`, `#password` (`login.tsx:59,73`, matched by `htmlFor`). Recharts gradient ids `ringGradient-0…5` (`overview.tsx:175`, internal SVG ids). That is all. There are no `data-testid` or `data-*` attributes in app code.

**Strings asserted by tests:** none (no tests exist). Treat the following as the de-facto contract and keep them unless you approve a change: the login labels "Email" and "Password", the heading and button "Sign in", the empty-field message "Enter any email and password to continue.", the `<title>` "PragnaAI", and the Ctrl/Cmd+K shortcut.

**Storage keys:**
- `localStorage` `pragnaai_auth` (`lib/auth.ts:10`)
- `sessionStorage` `rl-integrations-popup-seen` (`overview.tsx:64,66`)
- No cookies. A theme key will be added in Step 1b (proposal: `pragnaai-theme`).

**Routes:** `/`, `/login`, `/overview`, `/hierarchy`, `/workspace`, `/ai-analysis`, `/risk-register`, `/traceability`, `/knowledge-base`, `/documents`, `/integrations`, `/reports`. `/` redirects to `/overview`; `AppSidebar` also treats `/` as active for Overview. Static base path `/FMEA/` for the GitHub Pages build; asset URLs use `import.meta.env.BASE_URL` (`brand/wayam-logo-light.svg`). **No query params are used anywhere.** The two sidebar items `Settings` and `Help & Standards` have `url: "#"` but render as buttons that open modals.

**Form field names (`name` attributes):** reports radios `name="rtype"` (29) and `name="scope"` (40–43). No other form uses names. The `Settings` toggles have no names.

**Other code-visible hooks:** `aria-label` values ("Open menu", "Close menu", "Notifications", "Help", "Log out", "Close", "Open AI Assistant (Cmd+K)"), the `title="Log out"`, the `console.log("[Component] …")` calls (19 of them; leave them), and all `toast(...)` message strings (29 calls; user-facing wording but behaviour-adjacent, see Section 6).

---

## 6. Gap analysis: current → target (Chronus)

### 6.1 Colours
Current: orange brand primary (`--primary` oklch ≈ #FB923C) with a peach-to-orange **gradient** forced onto every `.bg-primary` / `.bg-sidebar-primary` (`styles.css:171–174`); dark-navy sidebar (`--sidebar`); violet "AI" accent (`--ai-accent`, `--ai-bg`, **28 uses**); Tailwind palette colours hard-coded in pages (≈ 90 uses of emerald/amber/red/sky/slate/yellow/orange); `bg-white` / `text-white` / `bg-black/40` literals.
Target: greyscale first, near-black primary, colour for status only, tokens only, no gradients, no glow.

Hard-coded colour inventory (all must move to tokens):
- `routes/overview.tsx:32–34` risk-zone hex pairs `#FEE2E2/#B91C1C`, `#FEF3C7/#B45309`, `#DCFCE7/#15803D`; `:47–51` RPN bucket fills `#16A34A #CA8A04 #D97706 #F97316 #DC2626`; `:160–162` legend swatches; `:182` ring track `#E5E7EB`; `:199–201` axis `#6B7280`, cursor `#F3F4F6`; `:176–177` ring gradient via `--primary-gradient-*`; KPI tones `text-red-600`, `text-amber-600`, `text-emerald-600`, `text-primary`, `text-[color:var(--ai-accent)]`; agent status pills `bg-emerald-100`, `bg-primary/15`, `bg-slate-100`.
- `shared/RiskBadge.tsx:4–7` red/amber/yellow/emerald pastel pills; `:30–32` RPN text colours. `shared/StatusBadge.tsx:4–11,32–36` slate/amber/sky/emerald/red pills and dots.
- `data/team.ts:11–16` avatar colours as Tailwind classes (`bg-blue-600`, `bg-amber-600`, `bg-emerald-600`, `bg-slate-600`, `--ai-accent`, `--primary`).
- `routes/traceability.tsx:25` `bg-emerald-500 / amber-400 / red-500 / slate-100`; `:44–48`; `:99` dynamic `border-${tone}-300 bg-${tone}-50`.
- `routes/integrations.tsx:12,18,52` amber/emerald pills; `:41,63` violet strip.
- `components/layout/TopHeader.tsx:12–14` `text-red-600`, `--ai-accent`, `text-emerald-600`; bell badge `bg-red-500`.
- `components/layout/AppSidebar.tsx:44–45` `bg-white/95`, `shadow-sm ring-black/5`; badge tones `bg-red-500`, `--ai-accent`, `bg-white/10`; text `slate-900/500`.
- `routes/login.tsx:31` `from-orange-50 via-background to-orange-100` gradient.
- `lib/error-page.ts` inline CSS hex (`#fafafa #111 #4b5563 #d1d5db`): **server file, do not touch** (see Risks).
- `knowledge-base.tsx:78` `bg-emerald-50 text-emerald-800`; `documents.tsx` dashed `border-primary/40 bg-accent/40`.
- Hover tint `hover:bg-sky-50/60` on table rows (workspace, risk-register, documents).

### 6.2 Typography
| Current | Target | Where |
|---|---|---|
| Inter body, IBM Plex Sans "display" (`font-display`, weights 500/600), IBM Plex Mono for IDs/numbers (39 `font-mono` uses) | **Geist** (UI, 400/500/600) + **Michroma** (400 only) for page titles, KPI values, drawer titles; no mono (Geist + `tabular`) | `styles.css:70–72`, `__root.tsx:15–20`, `entry-spa.tsx` |
| Ad-hoc sizes, 54 arbitrary `text-[10px]/[11px]` | role classes: caption/eyebrow 12, label-sm 12, body-sm 12, body-md 14, display-lg/xl/2xl | all pages |
| `font-semibold` everywhere | Geist 400/500/600 per role, Michroma 400 | all |
| Eyebrow labels mixed (`text-[11px] uppercase tracking-wide`, `tracking-[0.18em]`, `tracking-[0.22em]`) | one eyebrow: 12px/500/+0.08em/uppercase/quaternary | cards, table headers, sidebar, header |
| `h1` inside every page at `text-2xl font-display font-semibold`; panels use `h2 text-base font-display font-semibold` | Page title Michroma `display-lg sm:display-xl` in `PageHeader`; panel titles are eyebrow style | `PageContainer.tsx`, all pages |
| Body default colour `foreground`, no tabular numbers | body 14/20 `-0.01em`, default colour text-secondary; `tabular` on all figures | `styles.css`, tables, KPIs |

### 6.3 App shell (sidebar, top bar, breadcrumbs)
| Current | Target |
|---|---|
| `AppSidebar`: fixed 240px (`w-60`), dark navy, orange-gradient active row with white left bar, flat list of 10 items with static count badges (280, 23, 14, 6), Settings/Help buttons under a divider, close X below md | 68px rail expanding to 252px, `bg-container`, `border-r border-muted`; `size-9` circular pucks (active = solid primary circle, inverted icon); label flyout when collapsed; off-canvas drawer below `lg`; footer with collapse toggle, theme toggle, Settings (Help can stay in the footer) |
| Logo row 64px with white tile + wordmark text + "FMEA Intelligence" eyebrow | Collapsed: mark only (~32px). Expanded: mark + wordmark with "PragnaAI" eyebrow underneath (never lose the app name) |
| `TopHeader`: sticky, blurred translucent `bg-card/95`, 64/72px, eyebrow "PragnaAI control room", project switcher pill, bell, help, user chip, tenant tag "MediCore Systems", log out | `h-14`, `border-b border-muted`, `bg-page`, group eyebrow + sr-only `h1` (title stays in `PageHeader`), search pill optional, pill/icon buttons `size-8` rounded-full |
| `AIAssistantPanel` floating violet FAB at bottom-right | keep behaviour (Ctrl/Cmd+K); restyle FAB as neutral/primary pill or icon button; drawer follows Chronus drawer (`w-[420px] border-l border-default bg-container`, Michroma title, eyebrow kicker) |
| Layout: `md:pl-60` offset, document scrolls, `PageContainer` `p-4 sm:p-6` | Fixed viewport shell: `flex h-screen overflow-hidden bg-page`, `<main>` scrolls, page body `p-4 sm:p-5`, section gap `gap-4`; no breadcrumbs |
| Breadcrumb-style subtitles with `›`, e.g. workspace "CardioGuard 3000 › Power Management System › Battery Pack · 18 items" | Chronus has no breadcrumbs; keep as plain description text with `·` separators |

### 6.4 Page header and body
`PageContainer` becomes `PageHeader` + `PageBody` (shrink-0 header with `border-b border-muted`, Michroma title, one-line `text-tertiary` description with optional `InfoPopover` for long help text, right-aligned actions). Current subtitles are long (e.g. risk-register, integrations); some should move into an info popover (needs a small new component, no new dependency).

### 6.5 Cards and KPIs
| Current | Target |
|---|---|
| `Card`: `rounded-lg border bg-card p-5` | `Panel` (`rounded-lg border-muted bg-container`, `h-11` header with eyebrow title, optional action, `padded` flag) |
| KPI cards hand-built three ways (overview 6-up with tone classes; ai-analysis 5-up centred; risk-register 4-up; hierarchy mini-stats with `bg-muted/40`) | one `KpiTile`: eyebrow label, Michroma tabular value, signed delta/hint; grid `grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3` |
| Tone on KPI values (red/amber/violet/emerald/orange) | tone only on delta/hint text, value stays primary; or `valueClassName` for a single warning tile |
| Banner buttons / summary strips tinted violet (`overview.tsx:78`, `integrations.tsx:41`) | neutral `Panel` / raised callout; live dot becomes quiet status |
| AI suggestion cards with violet wash | `insight-card` pattern (Chronus 4.3): `rounded-lg border-muted bg-container p-4`; eyebrow sections; primary + secondary pills |

### 6.6 Tables
Seven tables (workspace, risk-register, hierarchy, documents, reports, overview matrix, traceability matrix), all hand-rolled: `text-xs`, `bg-muted/50` header with `uppercase text-[11px]`, `border-t` rows, `hover:bg-sky-50/60`.
Target (restyle only, **no sorting/pagination/column controls added**): eyebrow headers on `bg-container` (sticky where already scrollable), hairline `border-b border-muted` rows, no zebra, `hover:bg-raised`, `px-3 py-2 text-body-sm text-secondary`, numeric columns right-aligned `tabular`, empty row "No … match this filter" for the filterable workspace table. A shared `DataTable` is **not** appropriate (it brings sort/pagination/search = new behaviour); create a small presentational table style helper instead. Risk-register's critical row marker `border-l-2 border-l-red-400` carries data (S≥9): keep as a quiet `error`-tone marker. Sticky first column in traceability stays. Clickable `tr` in workspace has no keyboard path (a11y gap; cannot fix without a new handler, see STOP list).

### 6.7 Buttons and controls
Current: `rounded-md` (76 uses), `bg-primary text-primary-foreground` orange-gradient fills, `border hover:bg-muted` outlines, violet AI buttons, `px-3 py-1.5 text-sm font-semibold`, inline `text-primary hover:underline` links. No `focus-visible` ring on most.
Target: `rounded-full` pills; primary = solid near-black; secondary = `border-muted bg-action`; ghost/text; icon buttons `size-8` round; toolbar pill `h-8`; chips (`aria-pressed`) for the knowledge-base source/suggestion chips and the traceability Matrix/Chain switch (segmented chip control); focus ring `ring-2 ring-active`; disabled `opacity-40`. Only one solid primary per view. Create a single `Button` variant helper (class-string constants or a tiny component) so variants are defined once (Chronus has none; BOM Sync restyled shadcn `button.tsx`, which is not used here).

### 6.8 Forms and inputs
Login inputs: `rounded-md border-input px-3 py-2` → `h-11 rounded-full border-muted bg-action px-4 text-body-md` with eyebrow labels (labels stay "Email"/"Password"; `htmlFor`/`id` unchanged). Search/filter inputs and 13 native `<select>`s → `h-8` pill styles (Chronus `Select` primitive pattern with `ChevronDown`); radios/checkboxes in reports and risk-register → Chronus checkbox (custom 4px-radius box) is a **visual wrapper only** if it can keep the native `<input>` (`name`, `checked`, `onChange`); otherwise leave native with `accent-color` token (decision). The Settings `Toggle` switch → Chronus recommended switch (pill track, `bg-action-primary` on). Inline error pattern: login uses a toast, Chronus uses inline text; **keep the toast** (changing it is logic).

### 6.9 Modals, drawers, popovers, dropdowns
| Current | Target |
|---|---|
| `ModalShell` in AppSidebar (`rounded-xl border bg-card shadow-2xl`, `bg-black/40` scrim) and `IntegrationsPopup` in overview | `rounded-xl border-default bg-container`, **no shadow**, scrim `bg-page/70`, header `px-5 py-4 border-b border-muted` with Michroma title, footer Secondary then Primary pill. Merge the two into one shared shell **only if** it stays a presentational wrapper |
| Workspace detail drawer (`w-[480px] shadow-2xl`) | `w-[420px] border-l border-default bg-container`, eyebrow kicker, Michroma title, `size-7` close circle, `Field` = eyebrow label + `text-body-md text-primary` |
| TopHeader dropdown (`w-80 shadow-2xl`, `bg-muted/40` header) | `rounded-lg border-muted bg-container shadow-lg` (flyout rule) or notification-tray pattern (`w-[360px] border-default`, no shadow); eyebrow title; rows `px-4 py-3 border-b border-muted hover:bg-raised` with `StatusDot` |
| AI chat drawer (`shadow-2xl`, violet header) | see 6.3 |
| `animate-in slide-in-from-right` (tw-animate-css) on chat | Chronus has no custom keyframes; slide is allowed as `transition` 200ms (decision on keeping) |

### 6.10 Badges and status
Current: pastel bordered pills for risk level (Critical/High/Medium/Low, uppercase) and status (Not Started … Approved … Failed, Extracted, Parsing, Queued), `StatusDot` 8px, coloured count badges. Target:
- Severity mapping **critical → error, high → warning, medium → info, low → neutral**. Note this changes Medium from yellow to blue and Low from green to neutral grey (see Decisions).
- **Quiet-status rule:** normal states (Approved, Extracted, Connected, Linked, Complete, Active, Current) become quiet text (+ optional dot); solid badges only for attention states (Critical, High, Failed, Syncing?, Overdue, Gap, Under Review is `info`).
- Before removing any dot/column/badge, check data: the `StatusDot` in the hierarchy tree is the only per-node status indicator in the tree (node status appears in the detail card only for the *selected* node), so it must stay (quiet dot, tone by status).
- Sidebar count badges (280, 23, 14, 6) are duplicated as KPI numbers on `/overview` and `/integrations`, so they can become quiet text in the expanded sidebar and be dropped from the collapsed rail without losing data.
- `RiskBadge` text is uppercase through `uppercase` classes; Chronus status values are stored lowercase words rendered as-is. The strings "Critical/High/Medium/Low" are in data/types (`RiskLevel`) and stay; case is CSS.

### 6.11 Charts
| Current (`overview.tsx`) | Target |
|---|---|
| Bar chart: per-bar hex fills (green to red), `XAxis/YAxis stroke="#6B7280"`, visible axis lines, default tooltip | `chartTheme.ts`: series tokens, `axisLine={false} tickLine={false}`, 11px quaternary ticks, no grid (none now), `radius [4,4,4,4]`, tooltip in container + muted border + 8px radius, `isAnimationActive={false}`. Bucket colours: severity ramp is meaningful (low→critical), so use neutral for the low buckets and status tokens (info/warning/error) for the rest, or monochrome bars with the 200+ bar in error |
| Six donut rings with gradient fill + `#E5E7EB` track, `ResponsiveContainer` | flat: fill `var(--text-primary)`/series-1, track `raised-2`, no gradient. Percent in Geist next to Michroma value (`Unit`) |
| Risk matrix: coloured cells via inline `style` from `riskZone()` hex | cells use tint backgrounds and content colour from tokens (`success/warning/error` surface + content); the legend swatches use the same tokens. `riskZone` returns hex today, so it returns class names or token vars instead (a JS edit to presentation values only, thresholds untouched) |
| Traceability matrix | cells: Linked = success, Partial = warning, Gap = error, empty = `raised-2` |
| Recharts animation default on | off |

### 6.12 Icons
Current: lucide default stroke 2, ad-hoc sizes `h-3`…`h-5`, coloured icons (violet sparkles, red alert, emerald file), integration icons in `bg-primary/10` squares (`overview.tsx:82,256,275`, `integrations.tsx:42,79`). Target: stroke 1.75 (global `svg.lucide`), sizes by role (17/16/14/13/12/11), greyscale in nav/rows/buttons, `aria-hidden` on decorative icons, one icon = one meaning (Sparkles = AI only; Plug = integrations; Bell = notifications). Entity marks (BOM Sync's PNG pack) exist only for BOM concepts; none exist for DFMEA (Step 7, decision 13).

### 6.13 Spacing and radius
Controls `rounded-md` (6px) → `rounded-full`; cards `rounded-lg` (8px) stay; modals `rounded-xl`; `--radius: 0.5rem` stays. Page padding `p-4 sm:p-6` → `p-4 sm:p-5`; section gap mixed `mt-6/gap-4/mb-6` → `gap-4`; KPI gap `gap-3`; panel header `h-11`; table cell `px-3 py-2`.

### 6.14 Shadows and motion
Current: `shadow-2xl` ×5 (modals, drawers, dropdown), `shadow-lg` ×2 (login card, FAB), `shadow-sm` ×3, `hover:scale-105` on the FAB, `transition` (default 150ms) everywhere, `animate-in slide-in-from-right`, `animate-spin` on syncing icon (×3), `animate-bounce` typing dots. Target: no shadow on cards/modals/drawers; `shadow-lg` only on dropdown menus and the collapsed-rail flyout; `transition-colors duration-[180ms] ease-out`; no scale; skeleton uses `animate-pulse`. Animations to keep or drop are a decision (the spinning sync icon and bouncing dots carry state meaning).

### 6.15 Wording
Rule: Panel/page/nav names Title Case; buttons, placeholders and messages sentence case; no trailing full stop on short labels; `·` between metadata; ellipsis character `…`. "Same meaning" only. Strings with a de-facto contract (login) are KEEP.

| Where | Current | Suggested | Note |
|---|---|---|---|
| TopHeader eyebrow | "PragnaAI control room" | "PragnaAI" (group eyebrow in shell) | becomes nav group name |
| Sidebar eyebrow | "FMEA Intelligence" | keep, as eyebrow under wordmark | shows under "PragnaAI" |
| workspace button | "Add Failure Mode" | "Add failure mode" | |
| workspace button | "AI: Suggest for This Component" | "Suggest for this component" (Sparkles icon carries "AI") | decision: keep "AI:" prefix? |
| workspace button | "Approve All Reviewed" | "Approve all reviewed" | |
| workspace | "Search failure modes..." | "Search failure modes" | `...` to none; placeholders have no full stop |
| workspace selects | "Risk: All", "Status: All", "Owner: All", "Source: All" | keep as option text; labels may become eyebrows | the `<option value="">` is logic-adjacent |
| hierarchy | "AI: Analyze This Component" | "Analyze this component" | |
| hierarchy | "Open DFMEA Workspace" | "Open DFMEA workspace" | link/button |
| hierarchy | "Identified Functions", "Failure Modes (first 6 of 18)" | Panel titles keep Title Case: "Identified Functions", "Failure Modes · First 6 of 18" | |
| hierarchy | "Search components..." | "Search components" | |
| ai-analysis | "Edit & Accept", "Flag for Team" | "Edit and accept", "Flag for team" | |
| ai-analysis | "AI Analysis Queue" | keep (page title) | |
| ai-analysis | "Severity ≥ any", "Confidence ≥ any", "Show: Pending Only" | "Severity: any", "Confidence: any", "Show: Pending only" | |
| risk-register | "Show Residual RPN" | "Show residual RPN" | checkbox label |
| risk-register | "Search risks..." | "Search risks" | |
| risk-register | KPI labels "Critical (S≥9 or RPN≥200)", "High (RPN 100-199)" | keep meaning; "High (RPN 100–199)" en dash | |
| traceability | "Matrix View", "Chain View" | "Matrix view", "Chain view" | |
| traceability | "Select Failure Mode to Trace:" | "Select a failure mode to trace" | |
| knowledge-base | "Use in DFMEA Workspace", "View Full Record" | "Use in DFMEA workspace", "View full record" | |
| knowledge-base | placeholder "Search failure modes, standards, recalls, lessons learned..." | "Search failure modes, standards, recalls and lessons learned" | |
| knowledge-base | "Similarity: 92%" | keep | |
| documents | "Drag and drop engineering documents here, or Browse" | "Drag and drop engineering documents here, or browse" | |
| documents | "Uploaded By" | "Uploaded by" (header text, CSS uppercases) | |
| documents | "Re-extract" | keep | |
| integrations | "Sync all" | keep | |
| integrations | "How your DFMEA is assembled" | "How Your DFMEA Is Assembled" (panel title) | |
| integrations | "Data pulled in", "Feeds the DFMEA", "Last sync:" | keep (eyebrow labels in source casing) | |
| reports | "Generate Report" | "Generate report" | button |
| reports | "Generate Report" (card title) | "Generate Report" | panel title keeps Title Case |
| reports | "Full device — all levels" | "Full device · all levels" (no em dash) | |
| reports | "Include AI confidence scores" etc. | keep | |
| overview | "View integrations →", "Open AI Analysis →" | "View integrations", "Open AI analysis" + chevron icon | arrows become icons |
| overview | "Critical Risks (S≥9)", "Total DFMEA Items", … | KPI labels keep Title Case in source; CSS uppercases | |
| overview | "Risk Distribution Matrix (Initial RPN)", "Completion by Level", "Failure Mode Distribution by RPN Range", "Recent Activity", "AI Agent Activity" | keep, Title Case | panel titles |
| overview | status pills "COMPLETE", "ACTIVE", "IDLE", "SYNCING", "CONNECTED", "LIVE" (typed in caps in source) | "Complete", "Active", "Idle", "Syncing", "Connected", "Live" | source should not be typed in caps; CSS handles case |
| overview | "Auto-open data-source popup" | no wording change (behaviour) | |
| login | "Demo mode — any email and password will work." | "Demo mode. Any email and password will work." | em dash |
| login | "This is a demo environment. Any credentials will sign you in — no account is created or verified." | "… will sign you in. No account is created or verified." | em dash |
| login | "Sign in", "Email", "Password", "you@example.com", "••••••••" | **KEEP** (contract) | |
| login toast | "Enter any email and password to continue." | **KEEP** | |
| Settings modal | "Save changes", "Cancel", subtitle "Preferences for PragnaAI (saved locally in this demo)" | keep; subtitle fine | |
| Settings toggles | "Email me when a mitigation is overdue", … | keep | |
| Help modal | "Contact support", "Got it", "Standards referenced" | "Standards Referenced" (eyebrow, Title Case in source) | |
| Help modal bullets | `Add a failure mode: DFMEA Workspace → "Add Failure Mode".` | `… → "Add failure mode".` (must follow the button's new label) | two places must stay in sync |
| TopHeader | "Mark all as read", "Open documentation", "Notifications", "Help & Standards" | "Mark all read" (Chronus), others keep | |
| TopHeader | "Project: CardioGuard 3000 | Rev B | DFMEA-2025-001" | "Project · CardioGuard 3000 · Rev B · DFMEA-2025-001" | `|` to `·` |
| AI panel | "Ask a question...", "Hi R. Sharma — ask me anything…" | "Ask a question", "Hi R. Sharma. Ask me anything…" | `CANNED` replies are content: leave |
| 404 | "Page not found", "The page you're looking for doesn't exist or has been moved.", "Go home" | keep text; restyle | |
| Error | "This page didn't load", "Try again" | keep | |
| Toasts (29) | e.g. "New failure mode form would open here.", "Exporting 18 failure modes to Excel…", "Re-syncing all connected systems…" | keep unless a button label they echo changes, e.g. `Opening: ${h.title}` | they are runtime strings in handlers; edit only if approved |

### 6.16 Number, date and currency formats
- No currency anywhere. Percentages: `67%` (integers, matches). Chronus uses `82.0%` for computed percents; the values here are mock literals (`"67%"`, `"43%"`, `Confidence 87%`), leave as written unless approved. `%` next to a Michroma number renders in Geist (`Unit`).
- Dates in data are mixed: ISO `2025-02-01` (documents, due dates, recent reports), `"Today 11:42"`, `"Today 09:15"`, `"Last updated: 2025-05-14 09:00 UTC"`, plain times `"14:31"`, `"just now"`, `"2h ago"` (already Chronus relative style). These live in `data/*` and in header constants. Chronus absolute = ISO; they are already close. No change needed except mock strings noted.
- `toFixed(1)` for Avg D (matches `0.0`). Counts such as `1,284 indexed`, `1,204 matched reports` already use grouping.
- Empty cell is `—` (em dash) in risk-register/documents: matches Chronus.
- Ranges: `RPN 100-199`, `0-49`: Chronus aging buckets use hyphen (`0-30`), fine; keep.
- Locale: no `toLocaleString` calls, so nothing to pin yet.

---

## 7. BOM Sync reuse

| File (BOM Sync) | Verdict | What / why |
|---|---|---|
| `src/styles/tokens.css` | **(a) as-is** | Plain CSS variables, framework-agnostic. Identical to the design-system token file. Import from `styles.css` |
| `src/components/ui/primitives.tsx` (`Panel`, `KpiTile`, `StatusDot`, `QuietStatus`, `Unit`, `EmptyState`) | **(b) adapt** | Uses `cn`, `Badge`, `EntityMark`, `type-*`, `border-hairline`, `text-foreground`. Drop `LifecycleStatus` (BOM lifecycle) and the `EntityMark` import until Step 7; replace with PragnaAI states (`QuietStatus` for Approved/Extracted/Connected, `RiskBadge`/`StatusBadge` rebuilt on `Tone`); swap the `Badge` import for a new badge (shadcn `badge.tsx` here is unused and still shadcn-styled); tailwind-merge v3 vs v2 fine |
| `src/components/dashboard/chartTheme.ts` | **(a) as-is** | Pure constants using CSS variables. Works with Recharts 3 (props are the same) |
| `src/components/layout/nav.ts` | **(b) adapt** | Content differs (BOM groups, pinned items, tree). Reuse the shape (groups → items with icon, to, label) with PragnaAI's 10 items and new groups (Decision 4) |
| `AppShell.tsx` | **(b) adapt** | Uses `react-router-dom` `Outlet/useLocation` and `ProgramProvider`. Port to TanStack: children from `Outlet`, `useRouterState` for the pathname (already used in `__root.tsx`), remove program context, remove `PipelineBar` |
| `Sidebar.tsx` | **(b) adapt** | Rail/expanded/flyout/off-canvas logic is reusable. Remove EBOM tree, "Pinned"; swap `NavLink` for TanStack `Link` with `activeProps`; add the existing Settings/Help buttons in the footer; sidebar logo block reused |
| `TopNav.tsx` | **(b) adapt** | Reuse layout; reconnect notification/help dropdowns, user chip, project pill and log-out from the current `TopHeader` (keep their state and handlers verbatim) |
| `PageHeader.tsx` | **(a/b)** | Tiny; mark prop deferred to Step 7; Router-agnostic |
| `ThemeProvider.tsx` / `ThemeToggle.tsx` | **(c) doesn't fit as-is** | Uses `next-themes` (not installed; adding it is a new dependency, and it flashes on SSR without a head script). Options in Decision 5 |
| `tailwind.config.ts` | **(c) doesn't fit** | Tailwind 3 config. Replace by an `@theme inline` block in `styles.css` (design system doc §6.3), which also renames colours to avoid collisions (below) |
| `src/index.css` | **(b) adapt** | Take only the `type-*` role utilities (convert to v4 `@utility type-caption { … }`), `svg.lucide { stroke-width: 1.75 }`, base body rules, scrollbar utility. Skip the shadcn HSL variable block, legacy gradient/shadow stubs, `@tailwind` directives |
| `components/icons/iconMap.ts`, `EntityIcon`, `public/icons/*.png`, `scripts/cut-icons.py` | **(c) doesn't fit (Step 7)** | BOM-specific entities (EBOM, ECN, fru…). Pattern (single id→{lucide, mark} map) is reusable; PNGs are not |
| `src/assets/brand/wayam-mark-*.svg`, `wayam-wordmark-*.svg` | **(a) as-is** | Shared Wayam brand; PragnaAI's `public/brand/wayam-logo-*.svg` is byte-identical to BOM's and `favicon.svg` is identical |
| Fonts (`index.html` Google Fonts link for Geist + Michroma) | **(c) doesn't fit** | There is no `index.html` here (TanStack Start renders the document shell in `__root.tsx`). Options in Decision 6 |
| Chart/page-level edits (`HealthArc`, `SankeyFlow`, …) | **(c)** | BOM-specific |
| Lessons (type-* naming, quiet status, severity map, one visible title, rail logo rule) | **(a) apply** | See Section 9 |

**Class-name collisions to plan for (Tailwind v4 `@theme`):** the current theme defines `--color-primary`, `--color-secondary`, `--color-muted`, `--color-accent`, `--color-border`, `--color-destructive`, `--color-card` etc. as shadcn names, and pages rely on them (`bg-primary`, `text-muted-foreground`, `bg-muted`, plain `border`). The Chronus doc re-uses `primary/secondary/muted` for **text and stroke** tokens, which would silently change every unconverted page. Follow BOM Sync: keep the shadcn names but remap their values to Chronus tokens (so unconverted pages degrade gracefully), add only non-colliding Chronus names (`page`, `container`, `raised`, `raised-2`, `action`, `tertiary`, `quaternary`, `on-color`, `success/info/warning/error/neutral` + `-badge/-surface`, `series-1…6`), and use `text-foreground` for Chronus `text-primary`, `border-hairline`/`border-strong` for `border-muted`/`border-default`, `ring-active`. This is a deliberate deviation from the doc's names (same one BOM made).

---

## 8. Risks and blockers

**Colours hard-coded in JS/TS:** `overview.tsx` (`riskZone` returns hex; `RPN_BUCKETS` fills; Recharts `stroke`, `fill`, `cursor` props; inline `style={{ background }}`); `data/team.ts` (Tailwind classes in data); `shared/RiskBadge.tsx`, `StatusBadge.tsx` (class maps); `traceability.tsx` (class map + dynamic names); `lib/error-page.ts` (**server file, hex in an HTML string; leave it, it is outside the themed app and shown on SSR failure**).

**Dynamic Tailwind class bug (pre-existing, to verify in browser):** `traceability.tsx:99` builds `border-${tone}-300 bg-${tone}-50`. Tailwind v4's scanner cannot see these names, so the Chain View boxes probably render with no border/background colour. Record only; the redesign replaces them with a tone map.

**Third-party components that cannot be themed by tokens alone:**
- Recharts (SVG props): handled via `chartTheme.ts` and prop edits; default tooltip/cursor styles need `contentStyle`/`cursor` props.
- Sonner toasts: `ui/sonner.tsx` uses shadcn class names (`bg-background`, `border-border`); needs token-based classNames and `theme` handling; `position`/callers untouched.
- `tw-animate-css` classes (`animate-in slide-in-from-right`) on the chat drawer.
- Native `<select>`, radios, checkboxes: pill/box styling is limited; custom look needs a wrapper (see 6.8).

**Streaming/chat UI:** `AIAssistantPanel` is a canned-reply chat (no streaming, no markdown renderer). Messages use `whitespace-pre-wrap font-mono` to preserve column-aligned tables in replies (e.g. `FM-0032  Thermal runaway…  RPN 36`). Switching `font-mono` to Geist would **break the column alignment of those replies**. Keep a monospace-like treatment for assistant messages (a tabular/`ui-monospace` stack for this one block) or accept the loss of alignment: decision. Entangled with content, not with streaming logic.

**STOP list: cannot be done as pure restyle (needs your decision/approval):**
1. **Theme provider + toggle** (light default, `data-theme`, storage key): new state/logic and, on this SSR stack, an inline head script to avoid a flash (touches the document head config in `__root.tsx`). BOM Sync did this with `next-themes` (a new dependency). Needs approval and a method choice (Decision 5).
2. **Sidebar nav groups and group eyebrow in the top bar**: requires moving the `items` array to a shared `nav.ts` and deriving the group from the pathname (small new derived logic).
3. **Collapse/expand rail and mobile drawer state**: `__root.tsx` already owns `sidebarOpen`; a new `expanded` boolean is new UI state (same as BOM's AppShell). Layout state only, but not purely markup.
4. **Keyboard operability of clickable rows** (workspace `tr onClick`, hierarchy `TreeNode` is a `button` so fine): needs `tabIndex`, `onKeyDown`, i.e. new handlers. Record only, unless approved.
5. **`riskZone()` hex return values and `RPN_BUCKETS.fill`, `TEAM.color`, class maps in RiskBadge/StatusBadge**: changing these to tokens edits logic-adjacent constants. Thresholds and keys will not change; values only. Flagged so you approve touching the files.
6. **`data/*` wording/date edits** (e.g. "Today 11:42") if you want the format normalised: data files are logic-only by the rules.
7. **Fonts**: Geist and Michroma are not installed; loading them requires either `@fontsource/geist` + `@fontsource/michroma` (new dependencies) or Google Fonts `<link>` tags added through `__root.tsx` `head.links` (config edit, runtime dependency on Google, may be blocked on the offline/Cloudflare target). Needs approval.
8. **Unwired controls** (hierarchy search, risk-register search/selects, workspace Status/Owner/Source selects, ai-analysis selects, traceability select): restyle only; do not add behaviour.

**Pre-existing bugs and quality notes (record, don't fix):**
1. Lint: 517 prettier errors + 8 warnings (Section 0), including `__root.tsx:147` missing `router` dependency.
2. `routes/__root.tsx`: `useEffect` auth check has an unused `router` dep; SSR renders `null` until mount (first paint is blank for authed users).
3. `traceability.tsx` dynamic class names (above) and `cellState()` is a deterministic pseudo-random fill, not real data.
4. Several controls are inert (item 8 above), plus `Settings`/`Help` sidebar entries have `url: "#"` (dead URLs, buttons override them).
5. Sidebar badge counts (280/23/14/6) and notification count 3 are static literals.
6. `risk-register.tsx` "Show Residual RPN" only highlights a header; the data columns stay visible.
7. `riskLevel` in `data/dfmea.ts` (`s >= 9` → "Medium" in both branches) is unused and inconsistent with `badgeForRpn`.
8. `data/misc.ts` `STANDARDS` unused; 44 unused shadcn files; 10+ unused dependencies.
9. `package.json` name is `tanstack_start_ts`; nitro worker name `tanstack-start-ts` (Cloudflare). Not a frontend matter.
10. `npm audit`: 5 high vulnerabilities at install time.
11. Build warning: `inlineDynamicImports ignored because codeSplitting is set` (config, not ours).
12. `document` scroll model: `html, body { overflow-x: hidden }` plus iOS font-size rule (`input, select, textarea { font-size: 16px }` under 768px, `styles.css:199–205`) is a deliberate mobile-zoom fix; **keep** (a11y/usability), and note the Chronus 12px input size would otherwise cause iOS focus-zoom.
13. `entry-spa.tsx` and `__root.tsx` both import the same fonts (intentional, two build paths).
14. The README screenshots in `.github/assets/` will be stale after the redesign (documentation, optional update).

**Accessibility gaps (baseline):**
- Icon-only controls without labels: workspace drawer close button (`aria-label` missing), AI-panel Send button (no label), TopHeader dropdown close (has label).
- Native `<label>` wrapping on radios/checkboxes is fine; filter inputs and selects have **no labels** (placeholder or option text only).
- No `:focus-visible` styles on most buttons/links (only login inputs and chat input have a ring).
- Modals are plain `div`s: no `role="dialog"`, `aria-modal`, focus trap, Escape handling; same for the workspace drawer and dropdowns (click-outside overlay only).
- Colour is the only carrier of meaning in traceability cells and the risk matrix (no text/alt); the matrix cells have `title` tooltips and numbers, traceability cells have neither.
- Clickable `tr` has no keyboard path (STOP item 4).
- Contrast: Chronus `text-quaternary` (~3.4:1 on white) is below WCAG AA for small text (the same note BOM Sync recorded); `text-[10px]/[11px]` sizes today are smaller than Chronus' 12px minimum.
- `h1` is duplicated risk: the top bar must carry an sr-only `h1` and `PageHeader` the title in the visible `h2`, per lessons (one visible title). On `/login` there is a single `h1` ("Sign in"); keep it.

---

## 9. Ordered plan (one commit per step)

Prerequisite: pick a commit mechanism (Decision 1). Each step ends with `npx tsc --noEmit`, `npm run build`, `npm run lint` (compare to baseline 525/517/8), `npm test` **only if** Decision 2 adds a test file (otherwise reported as "no test script"), plus a headless-browser load of every changed route checking console errors. I'll state clearly if a headless browser is unavailable (none is installed in the repo; I'd use the Claude browser tooling or Playwright via npx, to confirm).

| Step | What | Files touched | Risk | Effort |
|---|---|---|---|---|
| **0** | Baseline (this audit). Optional: add a smoke test file to protect `#email`, `#password`, "Sign in" and routes (new test file only, needs vitest = new devDependency: Decision 2) | `AUDIT.md` | low | S |
| **1** Tokens + fonts | Add `src/styles/tokens.css` (copy), restructure `styles.css`: `@theme inline` mapping (shadcn names remapped + Chronus names), `type-*` utilities as `@utility`, `svg.lucide` stroke, base body (Geist 14/20, `-0.01em`), scrollbar, `@custom-variant dark (&:is([data-theme="dark"] *))`, remove gradient override on `.bg-primary` and the sidebar-navy tokens. Load Geist + Michroma (Decision 6) in `__root.tsx` head and `entry-spa.tsx` | `styles.css`, `styles/tokens.css` (new), `__root.tsx` (head/imports only), `entry-spa.tsx` (imports only), maybe `package.json` | **med** (every page changes appearance at once; shadcn names remapped to keep pages readable) | M |
| **1b** Theme | Light default; `data-theme` + `class` on `<html>`; storage key `pragnaai-theme`; no-flash inline script; toggle component (after approval) | `__root.tsx`, new `ThemeProvider`/`ThemeToggle` (own implementation, or `next-themes` if approved), `styles.css` | **med-high** (SSR hydration, head script) | M |
| **2** App shell | New `AppShell`, `Sidebar` (rail 68/252, pucks, flyout, off-canvas, footer with collapse/theme/Settings/Help), `TopBar` (`h-14`, group eyebrow, sr-only `h1`, bell/help/user/project/log-out with handlers unchanged), `PageHeader`/`PageBody`, `nav.ts` with groups, logo mark/wordmark rule; keep Settings/Help modals and `AIAssistantPanel` working (restyle only). Copy wordmark/mark SVGs from BOM Sync | `__root.tsx` (shell markup only), `layout/*`, `shared/PageContainer.tsx` (becomes `PageHeader`+`PageBody` shim so pages keep compiling), new `layout/nav.ts`, `public/brand/*` (new files) | **high** (touches the auth-gate component, sidebar modals, state lifting) | L |
| **3a** Primitives | `ui/primitives.tsx` (`Panel`, `KpiTile`, `StatusDot`, `QuietStatus`, `Unit`, `EmptyState`, `Tone`), button/chip/input/select class constants, restyle `RiskBadge`/`StatusBadge`/`EngineerAvatar`, retheme `ui/sonner.tsx` | `ui/primitives.tsx` (new), `shared/*`, `ui/sonner.tsx`, `data/team.ts` colours (needs approval) | **med** | M |
| **3b** Tables | Shared table class helper (header, rows, numeric cells); apply to the 7 tables **during page steps** (no logic, no new features) | new helper, then per page | low | S |
| **3c** Charts | `dashboard/chartTheme.ts` (copy), flat rings, bar chart, matrix cell tokens, legend | new file, `routes/overview.tsx` chart parts | **med** (`riskZone` hex → tokens, in the riskiest page) | M |
| **4** Pages (one commit each, in this order): 4a `/login` · 4b `/overview` (**riskiest**: 18KB, Recharts, matrix logic, popup + sessionStorage, 5 hard-coded palettes) · 4c `/hierarchy` · 4d `/workspace` (**second riskiest**: filter state, drawer, 13-col table) · 4e `/ai-analysis` · 4f `/risk-register` · 4g `/traceability` (dynamic-class cleanup) · 4h `/knowledge-base` · 4i `/documents` · 4j `/integrations` · 4k `/reports` · 4l `__root` 404 + error pages | the corresponding route file; 4l: `__root.tsx` | login low · overview **high** · workspace **med-high** · others low-med | 4a S, 4b L, 4c M, 4d M, 4e S, 4f S, 4g M, 4h S, 4i S, 4j S, 4k S, 4l S |
| **5** Wording, formats, a11y | Sentence/Title Case pass (table in 6.15), em dashes and `...` removal, focus rings, `aria-label` additions, `aria-hidden` icons, `aria-pressed` chips, `htmlFor` where missing, empty states; modal roles only if approved | all pages, `layout/*` | low-med | M |
| **6** Final QA | Full checks, light/dark, 1440px and 390px, every route, single `h1` per route, no horizontal overflow, console errors; write `REDESIGN_REPORT.md` | `REDESIGN_REPORT.md` (new) | low | M |
| **7** Icons | Single `iconMap.ts` (id → lucide), page-header icon = sidebar icon, 1.75 stroke, greyscale, one icon = one meaning; marks only if new art is supplied | `components/icons/iconMap.ts` (new), `PageHeader`, nav | low | S–M |

---

## 10. Decisions I need from you (with recommendations)

1. **Version control.** There is no `.git`. Recommend: run `git init` and commit the current state as the baseline before Step 1 (so each step is one commit and diffs are reviewable), or tell me to work without commits and checkpoint with folder copies. *(Needs your go-ahead; I won't run it unprompted.)*
2. **Tests.** There are no tests and no runner. Recommend: add `vitest` as a devDependency (new dependency, so needs approval) and one new test file covering login ids/labels, route list, and the severity→tone mapping; otherwise accept "no test script" as the permanent baseline.
3. **App display name under the wordmark.** Recommend: **"PragnaAI"** as the eyebrow (collapsed rail = mark only). Alternative: "PragnaAI · FMEA Intelligence" (longer, truncates in 252px). Also confirm the shared Wayam mark/wordmark SVGs from BOM Sync are the right logo for this accelerator (the current `wayam-logo-*.svg` is a combined logo, identical to BOM's).
4. **Navigation groups** (needed for the top-bar eyebrow and sidebar sections). Recommend: **Project** (Project Overview, Product Hierarchy) · **Analysis** (DFMEA Workspace, AI Analysis, Risk Register, Traceability) · **Knowledge** (Knowledge Base, Document Vault) · **Delivery** (Integrations, Reports). Same 10 items, same order, same URLs. Note in the collapsed rail the flyout shows the per-item label (BOM did the same).
5. **Theme method and default.** Recommend: **light default**, dark via `data-theme="dark"` on `<html>`, storage key `pragnaai-theme`, our own ~30-line provider plus a tiny inline head script (no new dependency) and a toggle in the sidebar footer. Alternative: `next-themes` (new dependency). Alternative: ship light-only now and add the toggle later.
6. **Fonts (Geist + Michroma).** Recommend: `@fontsource/geist` and `@fontsource/michroma` (new dependencies, same loading pattern as today's Inter/Plex, works offline and on the GitHub Pages `/FMEA/` base). Alternative: Google Fonts `<link>` in `__root.tsx` head (no deps, but external request, and I'd need to edit the head config). Which do you approve? Also remove the three old `@fontsource` imports after migration? (Recommend yes; leave the packages in `package.json` unless you approve removing them.)
7. **Severity colours.** Recommend the Chronus mapping: Critical → error (red), High → warning (orange), Medium → info (blue), Low → neutral (grey). This changes Medium from yellow to blue and Low from green to grey. For the S×O **matrix zones** and **RPN histogram**, recommend zone tints: High = error, Medium = warning, Low = neutral/success surface, and a monochrome histogram with the 200+ bar in `error`. Confirm.
8. **AI violet accent.** The current identity colour for "AI" is violet (28 uses). Chronus is greyscale with purple only as chart series 6. Recommend: **drop the violet**; AI is signalled by the Sparkles icon and the "AI" label in neutral text; the FAB becomes a neutral/primary icon button. OK?
9. **Quiet-status rule application.** Recommend: Approved/Extracted/Connected/Linked/Complete/Active/Current → quiet text (+dot where health matters, e.g. hierarchy tree); solid badges for Critical, High, Failed, Syncing (info), Gap. "Under Review" = info badge, "In Progress" = quiet warning text, "Not Started" = quiet neutral. Confirm or adjust the list.
10. **Animations.** Recommend keep only state-bearing ones: `animate-spin` on the syncing icon, `animate-bounce` typing dots, and a 200ms slide for the chat drawer; remove `hover:scale-105`, shadows, gradients. Rings have no count-up animation to worry about. OK?
11. **Monospace in the AI chat replies.** The canned replies rely on monospace column alignment. Recommend: keep a monospace stack for assistant messages only (a documented exception), Geist everywhere else (IDs like `FM-0031` become Geist + `tabular`).
12. **Login brand panel.** Recommend: Chronus split layout with a solid brand-neutral panel (no hero image exists in the repo, same as BOM): left panel hidden below `lg` with logo + "PragnaAI" + a one-line description, right column form. Or keep the current centred card (less change)?
13. **Icons / marks (Step 7).** BOM Sync's PNG marks are BOM entities; none fit DFMEA. Recommend: **lucide-only** (stroke 1.75, greyscale) now, no entity marks; page header icon = sidebar icon. Supply art later if wanted.
14. **Unused files.** Recommend: leave the 44 unused shadcn files, unused dependencies and unused data exports untouched in this redesign (not restyled, as in BOM Sync), and list them in the final report for a separate clean-up ticket.
15. **Logic-adjacent edits.** Please approve: (a) value-only edits of the colour constants in `riskZone`, `RPN_BUCKETS`, `TEAM.color`, `RiskBadge`/`StatusBadge` maps; (b) moving `items` from `AppSidebar` into a shared `nav.ts` and deriving the group label from the pathname; (c) a new `expanded` rail boolean; (d) `data/*` wording/date changes (recommend: no, leave data as is).
16. **Page chrome that doesn't exist in Chronus.** "MediCore Systems" tenant tag, the project switcher pill and the user chip: recommend keeping all three, restyled as pills in the top bar (`hidden` below `md`), because they carry data (project/revision/ID, user, tenant) shown nowhere else.
17. **Keyboard activation on clickable rows** (workspace). Recommend approving a minimal `tabIndex={0}` + Enter/Space handler on the `tr` (a11y fix, small logic addition); otherwise it is recorded as a known gap.
18. **README screenshots** (`.github/assets/*.png`) will be stale. Recommend: regenerate at the end if you want (I'll not touch them without a go-ahead).
19. **Tailwind version.** Stay on **v4** (already on it; Chronus is v4). No migration.
20. **Lint baseline.** Recommend: do not reformat the existing code (it would add noise to logic files); new/rewritten files will be prettier-clean, so the error count should only go down.

---

*Stop. No edits have been made. Waiting for your approval and answers to the decisions above (at minimum 1, 5, 6, 15) before Step 1.*

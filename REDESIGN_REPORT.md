# REDESIGN_REPORT.md

Chronus-style UI redesign of PragnaAI (DFMEA platform, TanStack Start + Tailwind v4). Baseline: `8257bbb` ("baseline: pre-redesign"). Head at time of writing: the Step 7 commit (see the table).

Claims were checked against git (`git diff 8257bbb HEAD`) and in a headless browser (Playwright, Chromium) against a second dev server running the baseline commit. Where a claim could not be verified it says so.

## Commits (8257bbb..HEAD, oldest first)

| Commit | Message |
|---|---|
| 036b439 | ui: step 0b vitest and contract test |
| 879a9f7 | ui: step 1 chronus tokens and fonts |
| 000922a | ui: step 1b light default theme with data-theme attribute |
| dbdadd1 | ui: step 2 chronus app shell |
| ea2fad8 | ui: restore page-body scroll restoration |
| c4f55b4 | ui: step 3a chronus shared primitives |
| db4bc0f | ui: step 3b chronus tables (helper only) |
| 9a639f7 | ui: step 3c chronus charts |
| 2dfcc90 | ui: align risk zone medium to info |
| b4a479b | ui: step 4a login page |
| b595839 | ui: step 4b overview |
| 8c71fe6 | ui: step 4c hierarchy |
| 4ea27d3 | ui: step 4d workspace |
| 48d1497 | ui: step 4e ai-analysis |
| 4b236a3 | ui: step 4f risk-register |
| 63a5f53 | ui: step 4g traceability |
| 273f80b | ui: step 4h knowledge-base |
| a012e70 | ui: step 4i documents |
| e256699 | ui: step 4j integrations |
| 68bc20d | ui: step 4k reports |
| a4f1175 | ui: step 4l 404 and error page |
| bc50d4f | ui: fab clearance and table fit |
| a29368e | ui: step 5 wording, a11y and overlay restyle |
| 8c6a75a | ui: step 6 final QA and REDESIGN_REPORT.md |
| (Step 7) | ui: step 7 icons (one icon map, header icon, greyscale) |

## Diff stat against 8257bbb, by area

47 files changed, 4134 insertions, 1333 deletions (measured at `a29368e`).

| Area | Files | + / - | Contents |
|---|---|---|---|
| Config, deps and tests | 4 | 521 / 70 | `package.json`, `package-lock.json`, `vitest.config.ts` (new), `src/tests/contract.test.ts` (new) |
| Global styles and tokens | 2 | 321 / 143 | `src/styles.css`, `src/styles/tokens.css` (new) |
| Brand assets | 4 | 126 / 0 | four new SVGs in `public/brand/` |
| App shell and layout | 10 | 917 / 342 | `AppShell`, `AppSidebar`, `TopHeader`, `PageHeader`, `AIAssistantPanel`, `nav.ts` (new), `__root.tsx`, `router.tsx`, `entry-spa.tsx`, `use-overlay-dismiss.ts` (new) |
| Theme | 3 | 87 / 0 | `ThemeProvider`, `ThemeToggle`, `theme.ts` (all new) |
| Shared primitives and style helpers | 12 | 506 / 56 | `primitives`, `modal`, `button-styles`, `input-styles`, `table-styles`, `tone-styles`, `chartTheme`, `zoneTint`, `PageContainer`, `RiskBadge`, `StatusBadge`, `EngineerAvatar` |
| Pages | 11 | 1645 / 722 | login, overview, hierarchy, workspace, ai-analysis, risk-register, traceability, knowledge-base, documents, integrations, reports |
| Other | 1 | 11 / 0 | `src/lib/severity.ts` (new: severity to tone map) |

## New files

- `vitest.config.ts`, `src/tests/contract.test.ts`
- `src/styles/tokens.css`
- `src/components/theme/ThemeProvider.tsx`, `ThemeToggle.tsx`, `theme.ts`
- `src/components/layout/AppShell.tsx`, `PageHeader.tsx`, `nav.ts`
- `src/components/ui/primitives.tsx`, `modal.tsx`, `button-styles.ts`, `input-styles.ts`, `table-styles.ts`, `tone-styles.ts`
- `src/components/dashboard/chartTheme.ts`, `zoneTint.ts`
- `src/hooks/use-overlay-dismiss.ts`
- `src/components/icons/iconMap.ts`
- `src/lib/severity.ts`
- `public/brand/wayam-mark-light.svg`, `wayam-mark-dark.svg`, `wayam-wordmark-light.svg`, `wayam-wordmark-dark.svg`
- `REDESIGN_REPORT.md`

## Untouched files

Zero diff against 8257bbb (verified with `git diff --stat 8257bbb HEAD -- <paths>`):

`src/server.ts`, `src/start.ts`, `src/lib/error-capture.ts`, `src/lib/error-page.ts`, `src/lib/error-reporting.ts`, `src/lib/auth.ts`, `src/lib/utils.ts`, `src/hooks/use-mobile.tsx`, `src/routeTree.gen.ts`, all of `src/data/*`, `vite.config.ts`, `vite.gh-pages.config.ts`, `gh-pages.html`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `bunfig.toml`, `components.json`, `.github/`, `.gitignore`.

Approved exceptions to the do-not-touch list (the only listed files with a diff):

- `src/router.tsx`: one line, `scrollToTopSelectors: ['[data-scroll-restoration-id="page-body"]']`, so scroll restoration works with the page body as the scroll region (commit `ea2fad8`).
- `src/entry-spa.tsx`: font imports only (Inter/IBM Plex to Geist/Michroma).
- `package.json` / `package-lock.json`: the dependencies listed below, plus the `test` script.

## Login contract

Verified in `src/routes/login.tsx` against 8257bbb and by `src/tests/contract.test.ts`. Unchanged: `#email` and `#password` ids with `htmlFor` labels "Email" and "Password", the "Sign in" heading and button, the empty-field message "Enter any email and password to continue.", the placeholders `you@example.com` and `••••••••`, and the `<title>` "PragnaAI". `src/lib/auth.ts` has no diff. The Ctrl/Cmd+K assistant shortcut is unchanged.

## Dependencies

Added (all approved):

- `vitest` (dev), for the contract test and the `test` script
- `@fontsource/geist`
- `@fontsource/michroma`

No other dependency changes. The old font packages (`@fontsource/inter`, `ibm-plex-sans`, `ibm-plex-mono`) stay installed but are no longer imported.

## Icons (Step 7)

- **One map:** `src/components/icons/iconMap.ts` is the only place app code imports icons from `lucide-react` (besides the unused `ui/*` files and `src/data/integrations.ts`, a do-not-touch data file that holds the six vendor icons). Everything else uses `icons.<meaning>`; `contract.test.ts` enforces this.
- **Stroke 1.75** globally via `svg.lucide` in `styles.css`; verified at runtime on every icon (35 distinct icons on 10 pages plus the notification, help and chat overlays).
- **Greyscale:** every icon in rows, buttons, nav and overlays is a neutral token. The only coloured icon is the overdue-mitigations alert in the notifications tray (status, `text-error`). Notification icons for AI suggestions and the ready report were violet and green and are now neutral.
- **Page header icon = sidebar icon:** `PageContainer` looks up the current route in `nav.ts` and passes the nav item's icon to `PageHeader`, which draws it in the same circular puck. Verified on all 10 pages. The 404, login and error pages have no header icon.
- **One icon, one meaning:** the standards/guide rows (Help modal, Help dropdown) use `standard` (document) instead of the book, which is reserved for the Knowledge Base. The overview agent rows use hierarchy, search and risk icons rather than a second Sparkles. `ai` and `aiAnalysis` are the same icon on purpose (the page is the AI queue); a test asserts no other two keys share a component.
- **Sizes by role:** 17px nav and header pucks, 16px controls, 14px inline button icons, 12px chevrons and badge icons.

## Login hero and page marks (Step 8)

- **Assets:** generated with Google Flow. The raw sources (`login-hero.jpg`, `icons.jpg`, both 2752x1536) are kept outside the repo in `D:\PragnaAI-assets\` and were never committed. Only processed outputs are in the repo.
- **Watermark:** the hero carried a Gemini sparkle at the bottom-right. It was removed by cropping only (bottom cropped to 1390px; nothing was painted over). The icon sheet had none in any cell.
- **Hero:** `public/brand/login-hero.webp` (2560w, 159KB) and `.jpg` (290KB), plus `login-hero-1280.webp` (64KB) and `.jpg` (99KB). The same image is used in light and dark theme.
- **Marks:** 11 transparent PNGs at 144px and 88px (2x sources for 72px and 44px display) in `public/images/marks/`, 6.6KB to 21KB each. The sheet was sliced on detected gaps; backgrounds and contact shadows were removed (no halo on dark); `mark-spare` is not shipped. No WebP: the PNGs are already tiny.
- **Login:** hero in the left brand panel (`<picture>` WebP + JPG, 1280w and 2560w srcset, `object-cover`, `alt=""`, `decoding="async"`), bottom gradient `from-black/80 via-black/30 to-transparent` and a subtle top gradient. The panel text and logo are white in both themes because the image is dark (the old panel inverted with the theme). Measured contrast over the image: headline about 20:1, eyebrow about 8:1. Panel stays hidden below `lg`; form column, ids, labels and strings are unchanged.
- **Marks in the app:** `Mark` component (`<img>` with width, height, `srcset`, `aria-hidden`, `draggable={false}`), mark ids next to the lucide icons in `iconMap.ts` (`marks`) and carried on each nav item. `PageHeader` shows the page mark at 44px in place of the lucide puck on all 10 pages; `EmptyState` shows `mark-empty` at 72px. The sidebar keeps the lucide icons. No marks in rows, buttons, nav or KPI tiles.
- **Base path:** image URLs use `import.meta.env.BASE_URL`; the GitHub Pages build inlines `/FMEA/images/marks/...` and copies the files.
- **Decision 13 reversed** for page headers and empty states only: they now carry an illustration. The rest of the app stays illustration-free.

## Design system pieces

- **Tokens:** `src/styles/tokens.css` (two-tier, light default, dark via `data-theme`), mapped in `src/styles.css`. Type roles are `type-*` (not `text-*`) so tailwind-merge does not drop them next to colour classes.
- **Shell:** 68px rail that expands to 252px, off-canvas drawer below lg, h-14 top bar, page body is the single scroll region.
- **Primitives:** `Panel`, `KpiTile`, `QuietStatus`, `ToneBadge`, `StatusDot`, `EmptyState`, `Unit` (`primitives.tsx`); `buttonClass`, `inputClass`, `selectClass`, `tableStyles`; `ModalShell` (`modal.tsx`).
- **Severity map:** Critical error, High warning, Medium info, Low neutral. Normal statuses are quiet text with a dot; solid badges only for attention states.

## Before and after per page

- **Shell:** gradient and shadow chrome became a flat token-based shell. The theme toggle, rail flyouts and the mobile drawer are new. Settings and Help modals use the shared `ModalShell`.
- **Login:** card layout became a split layout with pill inputs; copy and contract unchanged.
- **Overview:** `KpiTile` strip, flat charts (no animation), token-based risk matrix, integrations popup on `ModalShell`.
- **Hierarchy:** panel layout, token-styled tree with `aria-current` and `aria-expanded`, quiet statuses.
- **Workspace:** `tableStyles`, sticky first column (pure CSS), muted low-value columns (all 13 kept, same order), drawer with scrim, Escape and focus return, keyboard-activatable rows.
- **AI analysis, Risk register, Traceability, Knowledge base, Documents, Integrations, Reports:** panels, `tableStyles`, quiet statuses, sentence-case buttons. Traceability Chain View uses a static class map (the old `border-${tone}-300` strings could not be generated by Tailwind).
- **404 and error page:** Michroma headings, `buttonClass` actions. The 404 renders inside the shell; the error page is standalone.
- **All tables:** eyebrow headers, hairline rows, tabular numbers, no sorting or pagination added.

## Behaviour changes

Approved:

1. Scroll restoration: `router.tsx` option plus `data-scroll-restoration-id="page-body"` on the page body (the document no longer scrolls).
2. Workspace drawer: closes on Escape and scrim click, focus returns to the row that opened it. Added `role="dialog"`, `aria-modal`.
3. Workspace rows: keyboard activation (`tabIndex=0`, Enter/Space call the existing handler).
4. Traceability Chain View: a Linked/Partial/Gap text label under each tile (colour is no longer the only cue).
5. `aria-pressed` on the traceability view toggle and the knowledge-base source chips.
6. Status pill wording: Syncing and Connected are sentence case instead of upper case.

Added in Step 5 (explicit asks plus the minimum needed to make them work; flagged for confirmation, see questions):

7. Settings, Help, integrations popup and chat drawer: `role="dialog"`, `aria-modal`, labelled titles; Escape closes; the scrim closes; focus returns to the opener on close.
8. Chat drawer now has a scrim (it had none) so that `aria-modal` is true.
9. Notifications and Help dropdowns: Escape closes, `aria-haspopup` and `aria-expanded` on the triggers, and below `sm` they are anchored to the viewport (they were clipped off the left edge at 390px, also at baseline).
10. Settings toggles expose `role="switch"` and `aria-checked`.
11. `PageBody` has extra bottom padding so the last content clears the floating assistant button.
12. Wording (labels and placeholders only, toast and console strings untouched): "Add failure mode", "Suggest for this component" and "Analyze this component" (the "AI:" prefix is dropped, the Sparkles icon carries it), "Edit and accept", "Flag for team", "Matrix view"/"Chain view", "Use in DFMEA workspace", "View full record", "Show residual RPN", "browse", "Uploaded by", "How Your DFMEA Is Assembled", "Failure Modes · First 6 of 18", "High (RPN 100–199)", placeholders without trailing dots.
13. Reports: recent report file names get zero-width break points after underscores (display only) so they wrap cleanly.
14. Step 7 (visual only): every page header shows its sidebar icon in a circular puck, and notification icons are neutral except the overdue alert.

Not changed: every toast string, every `console.log`, route list, filter logic, data.

## Deviations from Chronus

- Primary action colour is near-black/near-white as in Chronus; the AI accent token is mapped to a neutral, so AI controls are neutral secondary buttons with a Sparkles icon.
- Native `<select>`, radio and checkbox elements are kept (pill-styled selects, `accent-color` on radios and checkboxes) instead of custom components, to keep their `name`/`checked`/`onChange` wiring.
- The 404 page renders inside the app shell; the error page does not (it replaces the whole tree).
- The chat drawer keeps tw-animate-css's `slide-in-from-right` and the typing dots keep `animate-bounce` (state meaning); the syncing icon keeps `animate-spin`.
- Tailwind v4 CSS-first config is kept as in the repo (Chronus also uses v4).
- The workspace table is wider than the panel at 1440 and scrolls horizontally inside it (also true at baseline, see pre-existing issues).

## Unused files and dependencies left untouched

- 44 of the 51 files in `src/components/ui/` are not imported by any app code (accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, switch, table, tabs, textarea, toggle, toggle-group, tooltip). They were not restyled. The seven live ones are `sonner`, `primitives`, `modal`, `button-styles`, `input-styles`, `table-styles`, `tone-styles`.
- 41 dependencies are only used by those unused files or by nothing: the three old `@fontsource` families, `@hookform/resolvers`, `react-hook-form`, `zod`, `date-fns`, `cmdk`, `vaul`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `class-variance-authority`, `@tanstack/router-plugin`, and 24 `@radix-ui/*` packages. (Static import scan; `@tanstack/router-plugin` may be pulled in by the Start tooling, unverified.)
- `src/data/*` exports were not audited for unused entries.

## Pre-existing issues (not fixed)

1. Inert controls, same as baseline: the hierarchy tree search; the Status, Owner and Source filters on workspace; every filter on ai-analysis; the search box and the Level, Risk and Status filters on risk-register; the traceability failure-mode selector.
2. The hierarchy detail panel (stat tiles, identified functions, failure-mode table) shows the same content whichever node is selected.
3. Workspace table at 1440: 1441px of columns in a 1330px panel (baseline: 1263 in 1150), so Owner and Status sit behind horizontal scroll. Reports and risk-register fit at baseline and now.
4. Traceability matrix at 390: the 280px requirement column leaves room for one failure-mode column.
5. The floating assistant button still overlays content in the viewport until the page is scrolled to the end (clearance was added at the end of scroll only). At baseline it overlapped the last rows of workspace, risk-register, documents and integrations.
6. Error page "Try again" re-renders the same error when the cause is persistent.
7. Overview auto-opens the integrations popup on the first visit of each session.
8. Settings shows a hard-coded email (`practice@joulestowatts.com`) in the component.
9. Hierarchy and workspace subtitles and counts ("18 items", stats) are static strings.
10. Relative timestamps in components and data ("Today 09:15", "2h ago") are not ISO dates; no non-ISO absolute dates remain in components (data files untouched).
11. `text-quaternary` is about 3.4:1 on white (`#8a8a8a` on `#ffffff`, computed from the token values). That is a Chronus choice and below WCAG AA for small text.
12. Lint: 170 problems remain, all pre-existing categories: 160 prettier errors in `src/data/*` (do-not-touch), 2 prettier errors in the two vite configs (do-not-touch), 7 `react-refresh/only-export-components` warnings in unused `ui/*` files and `RiskBadge.tsx`, 1 `react-hooks/exhaustive-deps` warning in `__root.tsx`.
13. Navigating to an unknown route logs one HTTP 404 resource error in the console (expected for a 404).

## Verification

| Check | Baseline `8257bbb` | After Step 7 |
|---|---|---|
| `npm test` | no test script | 20/20 pass (16 before Step 7) |
| `npm run build` | OK | OK |
| `npm run lint` | 525 problems (517 errors, 8 warnings) | 170 problems |
| `tsc --noEmit` | not run | clean |

Browser (headless, light and dark, 1440 and 390, 12 routes = 48 combinations): no console errors (other than the expected 404 resource log on the 404 page), exactly one `<h1>` per route, no horizontal page overflow.

Per-control click recorder (every `<button>` in `<main>` clicked on a fresh page, comparing toast text, console log, URL, dialog count and row count before and after): 0 behaviour differences on ai-analysis (48 controls), risk-register, traceability (2), knowledge-base (23), documents (29), integrations (1), reports (1) and the 404 page. Only the label text of controls changed where the wording pass applies. Workspace: every risk and search filter value gives the same row counts as the baseline (18, 1, 1, 8, 8; `battery` 4, `FM-` 18, `zzz` 0, `cell` 6; combined 1), the four toast buttons fire the same strings, and the only difference is that Escape now closes the drawer.

Overlay checks: Settings, Help, integrations popup and chat all expose a labelled `role="dialog"` with `aria-modal`, close on Escape, scrim and their close/cancel buttons, and the notification and help dropdowns close on Escape and their close button. Chat accepts a typed message and returns the canned reply. Settings switches toggle by click and by label.

Screenshots: every page, light and dark, 1440 and 390, plus the workspace drawer, the traceability chain view, the 404, the error page and every overlay, were viewed after Step 5 and again after Step 7 (80 images each time).

## Questions for reviewer

1. Matrix top zone is orange because High maps to warning; rename to Critical or keep? (Decision so far: keep High = warning.)
2. Step 5 added Escape, scrim and focus return to the Settings, Help, integrations and chat overlays, and a scrim to the chat drawer (items 7 to 9). Keep?
3. The "AI:" prefix was dropped from the two AI buttons (Sparkles carries it). Keep?
4. Should the unused `ui/*` files and the 41 unused dependencies be removed in a separate ticket?
5. Should the inert filter controls and the static hierarchy panel be tracked as separate tickets?
6. The 170 remaining lint problems are in do-not-touch or unused files. Should `src/data/*` be prettier-formatted (a pure formatting diff) in a separate commit?

## Manager review (branch `ui-review-fixes`)

Follow-up to manager feedback on BOM Sync and Bridge-to-Live, applied to PragnaAI. The audit that preceded the fixes is in `AUDIT_REVIEW.md` (commit `859cec1`). One commit per point.

| # | Point | Finding | Fix | Commit |
|---|---|---|---|---|
| 1 | Login before dashboard | A fresh visit already ended on `/login`, but only through a post-hydration effect. | Client-only `beforeLoad` guard on the root route (`shouldRedirectToLogin`), same `pragnaai_auth` key, never redirects on the server. The effect stays as the SSR fallback. | `3a0f281` |
| 2 | Icons | KPI tiles, panel headers, action buttons and search fields had none. | KPI tiles (top-right, 16px, tertiary), panel headers, Accept / Edit / Reject / Flag, View / Re-extract, Use in workspace, Generate report, Sign in, search fields. All from `iconMap.ts`, greyscale; new meanings added there. | `8115e61` |
| 3 | Sidebar | Footer was four rows, nav clipped "Reports" at 800px high, dividers inset. | 2px row spacing, quiet group labels, counts right-aligned, footer is one row of four icon buttons when expanded, full-bleed rail dividers. Same 10 items and URLs, rail still 68px. | `7b0714e` |
| 4 | Casing | Title Case in table headers, KPI labels, chips and buttons; sentence case in some panel titles. | Title Case for page, nav and panel titles; sentence case for everything else. Status enum values and test-asserted strings unchanged. | `8e34ac8` |
| 5 | Tree view | Mouse worked; no keyboard, no ARIA, click on the selected node collapsed it, parent path hardcoded. | WAI-ARIA tree with roving tabindex, arrow/Home/End keys, chevron toggles, row click selects and opens, path derived from data (`src/lib/tree.ts`). Search box left inert (see below). | `3d0de37` |
| 6 | Dashes | 27 em dashes in 13 files and 2 en-dash ranges. | Replaced with colon, comma, full stop or "·"; ranges use a hyphen; empty cells show "n/a". Test: no em dash in `src/`. | `695a96a` |
| 7 | Line gaps | Matrix cells floated with 4px gaps, risk-register marker broke row rules, traceability had uneven header chips. | Continuous hairline matrix, inset-shadow marker, fixed header chip height, column rules. | `d5176ca` |
| 8 | Graphs | Grey bars, five y ticks, no legend or values. | Blue series-1 bars (error for 200+), three ticks, horizontal grid, value labels, legend, rounded tops, dark series-1 lightened. | `9660674` |
| 9 | Indicator colours | Rings were black (white in dark); "Low" badge read black beside blue. | All rings and bars use series-1 blue on the raised-2 track; neutral badge lightened. Status colours kept only for risk thresholds. | `cce6147` |
| 10 | Consistency | Integrations banner differed from overview, workspace table clipped at 1440. | Same banner style, narrower truncating columns, hierarchy tile values aligned. | `8e2a9ca` |

Not done, on purpose:

- Tree search stays inert. Wiring it needs an ancestor-aware filter with auto-expand, which is more than a one-line filter on existing data.
- Hierarchy detail stats and failure-mode table are still Battery Pack demo data for every node; headings now say so.
- Spaced hyphens used as dashes inside data titles (for example "FM-CG2-088 - ...") were not in the stated rule and are untouched.
- `In Progress` shows a warning-coloured dot (data status taxonomy), left as is.

# REDESIGN_REPORT.md

Chronus-style UI redesign of PragnaAI (DFMEA platform, TanStack Start + Tailwind v4). Baseline: `8257bbb` ("baseline: pre-redesign"). Head at time of writing: `a29368e` plus the Step 6 commit that adds this file.

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

Step 6 (this report and the final QA fixes) and Step 7 (icons) follow as their own commits.

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

| Check | Baseline `8257bbb` | After Step 5 |
|---|---|---|
| `npm test` | no test script | 16/16 pass |
| `npm run build` | OK | OK |
| `npm run lint` | 525 problems (517 errors, 8 warnings) | 170 problems |
| `tsc --noEmit` | not run | clean |

Browser (headless, light and dark, 1440 and 390, 12 routes = 48 combinations): no console errors (other than the expected 404 resource log on the 404 page), exactly one `<h1>` per route, no horizontal page overflow.

Per-control click recorder (every `<button>` in `<main>` clicked on a fresh page, comparing toast text, console log, URL, dialog count and row count before and after): 0 behaviour differences on ai-analysis (48 controls), risk-register, traceability (2), knowledge-base (23), documents (29), integrations (1), reports (1) and the 404 page. Only the label text of controls changed where the wording pass applies. Workspace: every risk and search filter value gives the same row counts as the baseline (18, 1, 1, 8, 8; `battery` 4, `FM-` 18, `zzz` 0, `cell` 6; combined 1), the four toast buttons fire the same strings, and the only difference is that Escape now closes the drawer.

Overlay checks: Settings, Help, integrations popup and chat all expose a labelled `role="dialog"` with `aria-modal`, close on Escape, scrim and their close/cancel buttons, and the notification and help dropdowns close on Escape and their close button. Chat accepts a typed message and returns the canned reply. Settings switches toggle by click and by label.

Screenshots: every page, light and dark, 1440 and 390, plus the workspace drawer, the traceability chain view, the 404, the error page and every overlay, were viewed after Step 5.

## Questions for reviewer

1. Matrix top zone is orange because High maps to warning; rename to Critical or keep? (Decision so far: keep High = warning.)
2. Step 5 added Escape, scrim and focus return to the Settings, Help, integrations and chat overlays, and a scrim to the chat drawer (items 7 to 9). Keep?
3. The "AI:" prefix was dropped from the two AI buttons (Sparkles carries it). Keep?
4. Should the unused `ui/*` files and the 41 unused dependencies be removed in a separate ticket?
5. Should the inert filter controls and the static hierarchy panel be tracked as separate tickets?
6. The 170 remaining lint problems are in do-not-touch or unused files. Should `src/data/*` be prettier-formatted (a pure formatting diff) in a separate commit?

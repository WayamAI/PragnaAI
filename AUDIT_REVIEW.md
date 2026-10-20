# AUDIT_REVIEW.md

Manager review audit of PragnaAI, taken on branch `ui-review-fixes` at `c459a6d` before any edit.
Method: Playwright (Chromium) against `vite dev` (port 5180) and the GitHub Pages SPA build served under `/FMEA/`, each case in a fresh browser context (no localStorage). Screenshots are in the scratchpad `shots/before` (all 10 routes plus login, light and dark, 1440 and 390) and `shots/zoom-before` (200% crops).

Inspected: every 1440 screenshot, light and dark (22 images); 390 pairs for overview, hierarchy, login, workspace, traceability and reports. Not yet inspected individually: 390 pairs for ai-analysis, risk-register, knowledge-base, documents, integrations. They are re-shot and inspected in Step C.

## Summary table

| # | Point | Applies | Evidence | Proposed fix |
|---|---|---|---|---|
| 1 | Login before dashboard | Partly | Fresh `/`, `/overview`, `/workspace`, `/hierarchy` all end on `/login` in dev and on the GH Pages build; navigation trace shows `/overview` first, then `/login` (`__root.tsx:146-153`, `152-157`). Gate is a post-hydration `useEffect`, so the URL flashes and a blank frame shows. Sign-out revisit also lands on `/login`. Login form submitted natively (`/login?`) when clicked before hydration. | Client-side `beforeLoad` guard so the redirect happens before first render. Same `pragnaai_auth` key. |
| 2 | Icons missing | Yes | KPI tiles: 15 (overview 6, ai-analysis 5, risk-register 4) plus 5 hierarchy stat tiles, none with an icon (`primitives.tsx:66-110`). All 9 `Panel` headers lack icons. Buttons without icons: Accept, Edit and accept, Reject, Flag for team (`ai-analysis.tsx:95-124`), Use in DFMEA workspace, View full record (`knowledge-base.tsx:119-138`), View, Re-extract (`documents.tsx:82-103`), Generate Report (`reports.tsx:103`), Open DFMEA workspace (`hierarchy.tsx:197`), Sign in, Mark all as read. Search inputs without a search icon: tree, workspace, risk register. Empty state already has the empty mark. | Add icons from `iconMap.ts` only: KPI top-right 16px tertiary, panel headers, primary and key secondary actions, search inputs. |
| 3 | Sidebar | Yes | Expanded sidebar at 800px high: nav needs 587px, has 557px, so "Reports" is clipped (`sidebar-before/expanded.png`). Footer is four stacked rows (collapse, theme, settings, help). 6px row gap plus 3 inset dividers plus 4 group labels. Dividers are inset (`AppSidebar.tsx:159`), counts have `pr-2` so they do not align with the divider edge. | Rows 2px apart, group label spacing instead of dividers when expanded, footer as one row of four icon buttons when expanded, quiet right-aligned counts. Same 10 items and URLs, rail stays 68px. |
| 4 | Casing | Yes | Title Case where sentence case is required: table headers "Failure Mode", "Effect (Patient)" (workspace, risk-register, hierarchy); KPI labels ("Total Risks", "Total Generated", "Pending Review"...); drawer fields "Effect (Local)", "Current Controls", "Owner / Due"; chips "All Sources", "FDA MDR Database", "Medical Standards", "CAPA Records", "Lessons Learned"; KB index rows; button "Generate Report"; chain labels "Failure Mode", "Root Cause", "Verification Test". Sentence case where Title Case is required: panel "Device tree" (`hierarchy.tsx:97`), "Coverage matrix", "Trace chain"; subheads "Identified Functions", "How Your DFMEA Is Assembled" are mixed. | Normalise to the rule: Title Case for page, nav and panel titles; sentence case elsewhere. Status enum values (In Progress, Under Review) are data and test-asserted, left alone. |
| 5 | Tree view | Partly | Mouse expand, collapse and select work in the browser (53 nodes initially, root collapses to 1, SpO2 expands to reveal Photodiode, selecting updates heading). Broken or missing: no arrow-key navigation (ArrowLeft/Right/Up/Down do nothing, Tab walks all 53 buttons); no `role=tree/treeitem`; clicking a row both selects and toggles, so selecting the current node collapses it; the detail panel text "Power Management System" is hardcoded for every node (`hierarchy.tsx:112`); search box is inert (typing "battery" leaves 53 nodes); no connector lines. | Roving-tabindex keyboard support, ARIA tree roles, separate chevron toggle from select, derive the parent path from the data. Search is one filter over existing data, so it is wired only if it stays a few lines (decision recorded in the fix commit). |
| 6 | Em and spaced en dashes | Yes | 27 `—` in 13 files (list below), 1 in `data/misc.ts:18`. En dashes: `overview.tsx:289` "6–11", `risk-register.tsx:18` "100–199". | Replace by full stop, comma, colon or "·"; en-dash ranges become hyphens. Keep test strings. Test: no `—` in `src/`. |
| 7 | Gaps in lines | Yes | Overview risk matrix uses `border-spacing-1`, so cells float with 4px gaps (`overview.tsx:228`, zoom `matrix.png`). Traceability swatches sit in `p-0.5` cells with no column rules, header chips have uneven heights (`trace-head.png`). Sidebar dividers are inset, not full width. Risk-register critical marker is a `border-l-2` on the first cell, so row rules stop short at the left (`risk-rows.png`). There are no tree connector lines to have gaps. | Matrix as a continuous hairline grid, fixed header chip height, full-bleed sidebar dividers, critical marker as an inset shadow that does not break the row rule. |
| 8 | Graphs messy | Yes | RPN bar chart: bars grey with one red, 5 y ticks, bars very wide, tooltip not tied to token for bar colour (`overview.tsx:117-123, 336-352`). Rings: black fill, dark theme white. Risk matrix: cramped at 390 (tier labels wrap to 4 lines). Traceability: only 1 column visible at 390. | Series-1 blue bars (error only for 200+), 4 ticks, max bar size, readable legend; rings thinner and blue; matrix tier label shortened on small screens. |
| 9 | Indicator colours | Yes | See inventory below. Rings use `--action-primary-default` (black / white in dark). "Low" risk badge uses `--feedback-neutral-badge` (#464646), reads black beside blue Medium. | One info blue for all progress, neutral badge lightened. |
| 10 | Consistency | Yes | Hierarchy stat tiles are hand-built divs, not `KpiTile`, and "Mitigations pending" wraps to two lines so the tiles differ in height; panel header heights match (44px) but filter rows use different gaps (`gap-2` vs `mt-4 gap-2`); workspace table is cut off at the right edge at 1440 (OWNER header clipped). | Use shared tile, align gaps to a 4/8/12/16 scale, equal tile heights. |

## 1. Login gate detail

| Case | Dev | GH Pages build |
|---|---|---|
| fresh `/` | `/login` via `/overview` | `/FMEA/login` via `/FMEA/overview` |
| fresh `/overview` | `/login` | `/FMEA/login` |
| fresh deep link `/workspace` | `/login` | `/FMEA/login` |
| after sign-out then `/overview` | `/login` | same logic |

The dashboard never paints, so the requirement holds, but through a client effect after hydration. Server HTML for protected routes is empty. The fix must not redirect during SSR (the server cannot read localStorage and would bounce signed-in users), so the guard runs on the client only.

## 2. Icon gaps (full list)

- KPI tiles: overview x6, ai-analysis x5, risk-register x4, hierarchy stats x5.
- Panel headers: Risk Distribution Matrix, Completion by Level, Failure Mode Distribution by RPN Range, Recent Activity, AI Agent Activity, Device Tree, Knowledge Base Index, Generate Report, Recent Reports, Coverage Matrix, Trace Chain.
- Buttons: see table row 2.
- Empty states: workspace "No failure modes match" uses the empty mark. Fine.

## 6. Dash inventory (`—`)

AIAssistantPanel.tsx:20; AppSidebar.tsx:360,364,366,367,368; TopHeader.tsx:19,46,51,91; data/misc.ts:18; auth.ts:4,31 (comments); documents.tsx:45,72; overview.tsx:147,416,421; routes/README.md:5,15,17,19; reports.tsx:66; risk-register.tsx:157; traceability.tsx:150; __root.tsx:161 (comment); server.ts:22 (comment).
Spaced hyphens used as dashes ("FM-CG2-088 - ..." titles in `data/misc.ts`, "Alarm fatigue - delayed response" in the assistant canned text) are outside the stated rule and left alone.

## 7. Gap inventory

Tree connectors: none exist. Table borders: continuous (workspace, risk register, documents, reports). Panel borders: continuous. Sidebar dividers: inset. Matrix grid: gapped. Critical marker: breaks row rule.

## 9. Indicator inventory

| Indicator | Where | Colour now | Target |
|---|---|---|---|
| Completion rings x6 | overview.tsx:317 | action primary (black, white in dark) | info blue, track raised-2 |
| RPN bars x5 | overview.tsx:117-123 | grey, 200+ red | blue, 200+ error |
| Risk badges | RiskBadge | error, warning, info, neutral #464646 | neutral lightened |
| Risk zone tints | overview | warning, info, neutral tints | unchanged (status) |
| Coverage swatches | traceability | success, warning, error | unchanged (status) |
| Status dots | StatusBadge, tree | success, warning (In Progress), neutral | unchanged, data status |
| Active nav puck, primary buttons | chrome | primary black | unchanged, actions not indicators |

## 5. Tree evidence

Playwright run on `/hierarchy`: initial 53 nodes; root click collapses to 1 and re-expands to 53; SpO2 click expands to 56; Photodiode selects (`aria-current`); ArrowDown leaves focus on the same node; ArrowLeft leaves `aria-expanded=true`; `role=tree` count 0; search "battery" leaves 53 nodes.

## Not changed on purpose

Test-asserted strings, ids, routes, handlers, status enum values, data values.

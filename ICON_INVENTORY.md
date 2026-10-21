# Icon inventory and Flow prompts

Branch `ui-review-fixes` @ `e613ce3`. Audit only: no source files were edited.
Method: every `lucide-react` import and every `icons.*` use under `src/` was read, then the running app (dev server, Chrome 155, 1440x900 light theme, plus 390x844) was opened route by route. Screenshots are in `docs/icon-audit/*.webp` (18 files, 952 KB). Sizes are the Tailwind classes in the source (`size-3` = 12px, `size-3.5` = 14px, `size-4` = 16px, `size-5` = 20px, `size-6` = 24px).

## 0. Read this first (things the brief did not assume)

1. **The app already has 3D art.** `public/images/marks/` holds 11 PNG "marks" (10 page marks + 1 empty state) rendered by `Mark.tsx`: page headers at 44px (`PageHeader.tsx:22`) and the empty state at 72px (`primitives.tsx:192`). They are dark graphite with an orange accent, so the direction already matches. They are not in this inventory as lucide, but they have to be reconciled with the new Tier A set (section 3).
2. **Tier A roles do not render at 24px today.** Nav rail icons are 17px, KPI tile icons 16px, panel header icons 16px (`primitives.tsx:48,89`). Only the upload drop zone (24px) and the AI button (20px) are near the threshold. A full 3D icon at 16 to 17px turns to mush. The sets below follow your tier rules by role (nav, KPI, panel header, footer rail = Tier A), so the next pass has to **enlarge those slots** (suggest: nav puck 36 to 40px with a 24px icon, KPI icon 28px, panel header icon 24px). If you will not enlarge them, those roles must use the flat Tier B set instead.
3. **The shadcn files are almost all dead code.** 27 files under `src/` import lucide (some type-only). Only `iconMap.ts`, `data/integrations.ts` and `ui/modal.tsx` (close X, 16px, `modal.tsx:10`) draw an icon on a route. 18 other `ui/*.tsx` files (accordion, breadcrumb, calendar, carousel, checkbox, command, context-menu, dialog, dropdown-menu, input-otp, menubar, navigation-menu, pagination, radio-group, resizable, select, sheet, sidebar, ...) are never imported by a page. To get "nothing generic remains" cheaply, delete them or route them through the icon map; no icons need to be drawn for them.
4. **Generic icons that are not lucide** (so a grep for `lucide` will miss them): native `<select>` chevrons (`ai-analysis.tsx:37-49`, `risk-register.tsx:65-71`, `traceability.tsx:151`), native checkboxes and radios (`reports.tsx:46-99`, `risk-register.tsx:76`), and Sonner's built-in toast icons (`ui/sonner.tsx`, used by `toast.success` at `TopHeader.tsx:125`). Text glyph arrows are used in labels (`SEVERITY (S) ↓`, `OCCURRENCE (O) →`, overview matrix).
5. **`contract.test.ts:234-248` enforces the current setup** (lucide only in the icon map, `svg.lucide { stroke-width: 1.75 }` in `styles.css:264`). Replacing the icons means updating that test and removing the CSS rule.
6. **Two things in the brief's example list do not exist in the UI.** There is no user icon (people are initials in `EngineerAvatar`) and no mitigation icon (the "Mitigations pending" tile reuses the clock). Both are added as recommended concepts.

## 1. Inventory (every rendered icon)

`Concept` is the merged key from section 2. Rows marked "x4" etc. repeat the same icon.

### App chrome (all authenticated routes)

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| Sidebar nav: Project Overview | `nav.ts:24` -> `AppSidebar.tsx:193` | LayoutDashboard | 17 | overview | overview |
| Sidebar nav: Product Hierarchy | `nav.ts:28` | GitBranch | 17 | device tree | hierarchy |
| Sidebar nav: DFMEA Workspace | `nav.ts:39` | Table2 | 17 | FMEA worksheet | workspace |
| Sidebar nav: AI Analysis | `nav.ts:46` | Sparkles | 17 | AI | ai |
| Sidebar nav: Risk Register | `nav.ts:53` | ShieldAlert | 17 | risk | risk |
| Sidebar nav: Traceability | `nav.ts:60` | Link | 17 | trace link | traceability |
| Sidebar nav: Knowledge Base | `nav.ts:71` | BookOpen | 17 | knowledge | knowledge |
| Sidebar nav: Document Vault | `nav.ts:74` | FolderOpen | 17 | documents | documents |
| Sidebar nav: Integrations | `nav.ts:83` | Plug | 17 | integrations | integrations |
| Sidebar nav: Reports | `nav.ts:87` | FileDown | 17 | reports | reports |
| Rail footer: collapse / expand | `AppSidebar.tsx:227-233` | PanelLeftClose / PanelLeftOpen | 17 | toggle sidebar | sidebar-toggle |
| Rail footer: theme | `AppSidebar.tsx:234-239` | Moon / Sun | 17 | switch theme | theme |
| Rail footer: settings | `AppSidebar.tsx:240` | Settings | 17 | settings | settings |
| Rail footer: help | `AppSidebar.tsx:244` | HelpCircle | 17 | help | help |
| Mobile drawer close | `AppSidebar.tsx:146` | X | 16 | close | close |
| Page header illustration (10 pages) | `PageHeader.tsx:22` | PNG mark, not lucide | 44 | page identity | (existing 3D marks) |
| Top bar: open menu (mobile) | `TopHeader.tsx:82` | Menu | 16 | menu | menu |
| Top bar: project switcher caret | `TopHeader.tsx:101` | ChevronDown | 12 | expand | chevron |
| Top bar: notifications | `TopHeader.tsx:113` | Bell | 16 | notifications | bell |
| Notification row: overdue | `TopHeader.tsx:16,143` | AlertTriangle | 16 | warning | alert |
| Notification row: AI pending | `TopHeader.tsx:23,143` | Sparkles | 16 | AI | ai |
| Notification row: report ready | `TopHeader.tsx:30,143` | FileDown | 16 | reports | reports |
| Notification footer: mark all read | `TopHeader.tsx:130` | CheckCircle2 | 12 | accept | accept |
| Top bar: help | `TopHeader.tsx:167` | HelpCircle | 16 | help | help |
| Help rows x4 | `TopHeader.tsx:40-55,194` | FileText | 16 | standard / guide | standard-doc |
| Help footer: open documentation | `TopHeader.tsx:181` | ExternalLink | 12 | opens elsewhere | external |
| Top bar: log out | `TopHeader.tsx:213` | LogOut | 16 | log out | logout |
| Dropdown close | `TopHeader.tsx:252` | X | 14 | close | close |
| Settings modal / help modal close | `ui/modal.tsx:10` | X | 16 | close | close |
| Help modal standards x4 | `AppSidebar.tsx:438` | FileText | 16 | standard | standard-doc |
| Help modal contact support | `AppSidebar.tsx:388` | ExternalLink | 12 | opens elsewhere | external |
| Toast icons (success etc.) | `ui/sonner.tsx` (library default) | Sonner SVGs, not lucide | ~16 | status | accept / reject / alert / sync |
| Brand mark and wordmark | `AppSidebar.tsx:114-134`, `login.tsx:45-87` | Wayam SVG logos | 32 | brand | (keep, brand asset) |
| Favicon | `public/favicon.svg` | SVG | - | brand | (keep) |

### AI assistant overlay (all routes)

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| Floating button | `AIAssistantPanel.tsx:60` | Sparkles | 20 | open assistant | ai |
| Panel header | `AIAssistantPanel.tsx:77` | Sparkles | 16 | AI | ai |
| Panel close | `AIAssistantPanel.tsx:95` | X | 16 | close | close |
| Send message | `AIAssistantPanel.tsx:157` | Send | 16 | send | send |

### Login (`/login`)

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| Sign in button | `login.tsx:136` | LogIn | 16 | sign in | sign-in |
| Theme button | `ThemeToggle.tsx:7,15` (used `login.tsx:92`) | Moon / Sun | 16 | switch theme | theme |
| Hero image | `login.tsx:45` | raster photo | - | atmosphere | (not an icon) |

### `/overview`

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| KPI Total DFMEA items | `overview.tsx:49` | ListChecks | 16 | item count | workspace |
| KPI Critical risks | `overview.tsx:52` | AlertTriangle | 16 | critical | alert |
| KPI AI suggestions pending | `overview.tsx:57` | Sparkles | 16 | AI | ai |
| KPI Mitigations pending | `overview.tsx:60` | Clock | 16 | pending | pending |
| KPI DFMEA completion | `overview.tsx:67` | Gauge | 16 | completion | completion |
| KPI Residual RPN reduced | `overview.tsx:74` | TrendingDown | 16 | reduction | reduction |
| Data-source banner puck | `overview.tsx:207` | Plug | 17 | integrations | integrations |
| View integrations link | `overview.tsx:219` | ChevronRight | 12 | go | chevron |
| Panel: Risk Distribution Matrix | `overview.tsx:242` | Grid3x3 | 16 | matrix | matrix |
| Panel: Completion by Level | `overview.tsx:328` | Gauge | 16 | completion | completion |
| Panel: Failure Mode Distribution | `overview.tsx:363` | BarChart3 | 16 | chart | chart |
| Panel: Recent Activity | `overview.tsx:409` | History | 16 | history | history |
| Panel: AI Agent Activity | `overview.tsx:424` | Sparkles | 16 | AI | ai |
| Agent rows x3 | `overview.tsx:156,164,173` -> `:429` | GitBranch / Search / ShieldAlert | 14 | hierarchy / search / risk | hierarchy, search, risk |
| Open AI analysis link | `overview.tsx:448` | ChevronRight | 12 | go | chevron |
| Integrations modal header | `overview.tsx:462` | Plug | 17 | integrations | integrations |
| Modal vendor rows x6 | `overview.tsx:493` | see vendor table | 17 | vendor | vendors |
| Manage integrations link | `overview.tsx:481` | ChevronRight | 12 | go | chevron |
| Syncing chip | `overview.tsx:500` | RefreshCw (spin) | 12 | syncing | sync |
| Flow arrow in modal rows | `overview.tsx:513` | ArrowRight | 12 | flows into | arrow |
| Matrix axis labels | overview matrix labels | text glyphs ↓ → | - | direction | (text, replace with arrow) |

### `/hierarchy`

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| KPI Functions | `hierarchy.tsx:20` | Workflow | 16 | functions | functions |
| KPI Failure modes | `hierarchy.tsx:21` | Zap | 16 | failure mode | failure-mode |
| KPI Critical | `hierarchy.tsx:22` | AlertTriangle | 16 | critical | alert |
| KPI Mitigations pending | `hierarchy.tsx:23` | Clock | 16 | pending (should be mitigation) | pending -> mitigation |
| KPI RPN range | `hierarchy.tsx:24` | Activity | 16 | RPN spread | chart |
| Tree row toggles | `hierarchy.tsx:122,124` | ChevronDown / ChevronRight | 12 | expand / collapse | chevron |
| Panel: Device Tree | `hierarchy.tsx:153` | GitBranch | 16 | hierarchy | hierarchy |
| Search components | `hierarchy.tsx:154` -> `primitives.tsx:205` | Search | 16 | search | search |
| Open DFMEA workspace | `hierarchy.tsx:269` | Table2 | 14 | workspace | workspace |
| Analyze this component | `hierarchy.tsx:279` | Sparkles | 14 | AI | ai |

### `/workspace`

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| Add failure mode | `workspace.tsx:85` | Plus | 14 | add | add |
| Suggest for this component | `workspace.tsx:95` | Sparkles | 14 | AI | ai |
| Export | `workspace.tsx:105` | Download | 14 | export | export |
| Approve all reviewed | `workspace.tsx:115` | CheckCircle2 | 14 | approve | accept |
| Search failure modes | `workspace.tsx:121` -> `primitives.tsx:205` | Search | 16 | search | search |
| Detail drawer close | `workspace.tsx:284` | X | 16 | close | close |
| Empty state | `workspace.tsx:256` -> `primitives.tsx:192` | PNG mark | 72 | nothing here | (existing mark-empty) |

### `/ai-analysis`

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| KPI Total generated | `ai-analysis.tsx:14` | Sparkles | 16 | AI | ai |
| KPI Accepted | `ai-analysis.tsx:15` | CheckCircle2 | 16 | accepted | accept |
| KPI Edited and accepted | `ai-analysis.tsx:16` | Pencil | 16 | edited | edit |
| KPI Pending review | `ai-analysis.tsx:17` | Clock | 16 | pending | pending |
| KPI Rejected | `ai-analysis.tsx:18` | XCircle | 16 | rejected | reject |
| Suggestion card marker x8+ | `ai-analysis.tsx:76` | Sparkles | 16 | AI-generated | ai |
| Accept / Edit and accept / Reject / Flag for team (per card) | `ai-analysis.tsx:102,109,116,123` | CheckCircle2 / Pencil / XCircle / Flag | 14 | action | accept, edit, reject, flag |
| Filter selects x5 | `ai-analysis.tsx:37-49` | native select chevron | ~12 | open list | chevron |

### `/risk-register`

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| KPI Total risks | `risk-register.tsx:18` | ShieldAlert | 16 | risk | risk |
| KPI Critical | `risk-register.tsx:21` | AlertTriangle | 16 | critical | alert |
| KPI High | `risk-register.tsx:27` | Flame | 16 | high severity | severity |
| KPI Mitigations overdue | `risk-register.tsx:31` | CalendarClock | 16 | overdue | overdue |
| Search risks | `risk-register.tsx:60` -> `primitives.tsx:205` | Search | 16 | search | search |
| Filter selects x3, residual checkbox | `risk-register.tsx:65-76` | native | ~12-16 | list / tick | chevron, check |

### `/traceability`

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| Panel: Coverage Matrix | `traceability.tsx:96` | Link | 16 | traceability | traceability |
| Panel: Trace Chain | `traceability.tsx:148` | Link | 16 | traceability | traceability |
| Failure-mode select | `traceability.tsx:151` | native chevron | ~12 | open list | chevron |
| Matrix cells (green / amber / red / empty squares) | `traceability.tsx` | coloured squares, not icons | ~24 | linked / partial / gap | (status colour, see section 5) |

### `/documents`

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| Drop zone | `documents.tsx:30` | Upload | **24** | upload | upload |
| Row action View x12+ | `documents.tsx:92` | Eye | 14 | view | view |
| Row action Re-extract x12+ | `documents.tsx:102` | ScanText | 14 | re-extract | re-extract |

### `/knowledge-base`

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| Search field | `knowledge-base.tsx:57` | Search | 16 | search | search |
| Use in DFMEA workspace (per result) | `knowledge-base.tsx:127` | Table2 | 14 | workspace | workspace |
| View full record (per result) | `knowledge-base.tsx:138` | Eye | 14 | view | view |
| Panel: Knowledge Base Index | `knowledge-base.tsx:146` | Database | 16 | store (recommend remap to `knowledge`) | database -> knowledge |

### `/integrations`

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| Sync all | `integrations.tsx:47` | RefreshCw | 14 | sync | sync |
| Syncing chip | `integrations.tsx:15` | RefreshCw (spin) | 12 | syncing | sync |
| Banner puck | `integrations.tsx:53` | Plug | 17 | integrations | integrations |
| Pipeline arrows x4 | `integrations.tsx:83` | ArrowRight | 16 | flows into | arrow |
| Vendor puck x6 | `integrations.tsx:99` | see vendor table | 17 | vendor | vendors |

Vendor icons (`data/integrations.ts:30-90`, lucide imported at `:1-4`):

| System | Lucide | Meaning | Concept |
|---|---|---|---|
| Siemens Teamcenter (PLM) | Boxes | product structure | plm |
| Jama Connect (requirements / ALM) | ClipboardList | requirements | requirements |
| Greenlight Guru (QMS) | ShieldCheck | quality system | qms |
| FDA MAUDE / MDR (regulatory) | Landmark | regulator | regulatory |
| SAP S/4HANA (ERP) | Database | enterprise data | database |
| Polarion Test Mgmt (verification) | FlaskConical | test | verification |

### `/reports`

| Location | File:line | Lucide | px | Meaning | Concept |
|---|---|---|---|---|---|
| Panel: Generate Report | `reports.tsx:35` | FileDown | 16 | reports | reports |
| Generate report button | `reports.tsx:111` | FileDown | 16 | reports | reports |
| Panel: Recent Reports | `reports.tsx:117` | History | 16 | history | history |
| Report radios x6, scope radios x4, option checkboxes x5 | `reports.tsx:46-99` | native | 16 | choose / tick | check |

Totals: 51 `icons.*` keys in `iconMap.ts:69-130`, 6 vendor icons, ~115 call sites, 4 further generic families that are not lucide (native select chevron, native checkbox/radio, Sonner toast icons, text-glyph arrows).

## 2. Unique concepts (merged by meaning)

Merges applied (one icon = one meaning):
- `ai` + `aiAnalysis` + notification AI + agent AI + assistant button = **ai** (already shared in code).
- `riskRegister` used as "Total risks" KPI and "Risk Scoring Agent" = **risk**.
- `traceability` on both panel headers = **traceability**; `integrations` on banner, modal and nav = **integrations**.
- `items` (ListChecks, "Total DFMEA items") = **workspace** (the items live in the worksheet).
- `range` (Activity, RPN range) = **chart** (a distribution).
- `themeDark` + `themeLight` = one **theme** icon (half sun, half moon); state is already carried by the label.
- `sidebarCollapse` + `sidebarExpand` = one **sidebar-toggle** icon, mirrored in CSS for the other state.
- `chevronRight`, `chevronDown`, native select chevron, tree toggles = one **chevron** icon rotated in CSS (also covers up/left in dead `ui/` files).
- `flow` (ArrowRight) and the text `→ ↓` = one **arrow**, rotated.
- `approve`, "Accepted" KPI, "Mark all read", toast success = **accept**; `reject`, "Rejected" KPI, toast error = **reject**.
- `standard` (FileText) on every help row = **standard-doc**.
- `database` on the Knowledge Base Index panel is remapped to **knowledge** (the book). `database` stays only for SAP / ERP.

Added (not in the app today): **mitigation** (the clock is overloaded on both "pending" and "mitigations pending"), **user** (owner / avatar fallback, reserve).

Result: 36 unique concepts for Tier A, 36 cells for Tier B (30 in use + 6 reserve).

## 3. Size tiers

Tier A, full 3D (nav rail, KPI tiles, panel headers, empty states, drop zone, vendor pucks) and Tier B, flat 2-tone (buttons, rows, chips, inputs, top bar, modals). A concept that is used in both tiers (ai, risk, workspace, hierarchy, integrations, reports, help, settings, theme, upload, mitigation, pending, history) is generated in both styles.

Existing 3D marks: I opened `mark-overview-144.png` and `mark-empty-144.png`. They read as the same family (graphite body, one orange element) but the Overview mark is a window-with-ring that does not say "overview". Recommendation: A1 replaces the 10 page marks (one nav icon = one page header icon), `mark-empty` stays until a side-by-side check against A1 shows a style mismatch.

| Batch | Contents |
|---|---|
| A1 | Nav rail: overview, hierarchy, workspace, ai, risk, traceability, knowledge, documents, integrations, reports + footer settings, help |
| A2 | KPI tiles: alert, severity, pending, overdue, completion, reduction, accept, edit, reject, functions, failure-mode, mitigation |
| A3 | Panels and other: chart, matrix, history, sidebar-toggle, theme, upload + vendors plm, requirements, qms, regulatory, database, verification |
| B1 | search, add, export, accept, reject, edit, flag, ai, sync, view, re-extract, sign-in |
| B2 | send, close, menu, alert, standard-doc, external, arrow, chevron, bell, help, logout, check |
| B3 | workspace, reports, hierarchy, risk, integrations, theme + reserve: user, mitigation, upload, settings, pending, history |

## 4. Flow prompts

Common wrapper for every batch:
`Sprite sheet of 12 separate icons in a 4 columns x 3 rows grid, 16:9, 3840x2160, pure white background (#FFFFFF), even spacing, each icon centred in its own cell with equal margins and identical scale, identical style across all 12. Style: <STYLE BLOCK>. Cells left to right, top to bottom: ...`

Avoid in every cell: sparkles or stars (the generic "AI" tell), question marks, exclamation marks, letters, numbers.

**Tier A style block:** `soft clay-and-glass 3D render, isometric 3/4 view, rounded bevelled edges, matte graphite and soft grey body (#2a2a2a to #d4d4d4) with exactly ONE accent element in a warm orange gradient (#DC440C → #F0731A → #FA8D23 → #FFA12B) with a subtle inner glow, soft studio light from the top-left, no shadow, minimal, premium, no text, no letters, no logos`

**Tier B style block:** `flat vector icon, 2-tone: solid graphite (#2a2a2a) shape with one solid orange (#F0731A) accent element, rounded corners, consistent 2px-equivalent stroke weight, centred, no gradient, no shadow, no text, crisp edges, designed to read at 16px`

### Batch A1: nav rail (3D)

| Cell | Concept | Object, and which part is orange |
|---|---|---|
| 1 | overview | dashboard board of four tiles; the top-right tile is orange |
| 2 | hierarchy | tree of one parent block branching to three child blocks; one child block is orange |
| 3 | workspace | worksheet slab with a grid of rows and columns; one cell is a raised orange tile |
| 4 | ai | faceted graphite chip with three small orbiting nodes (no sparkle); the core facet is orange |
| 5 | risk | bevelled shield; a gem set in its centre is orange |
| 6 | traceability | two interlocked chain links; one link is orange |
| 7 | knowledge | open book; the ribbon bookmark is orange |
| 8 | documents | filing drawer with a lock plate; the lock plate is orange |
| 9 | integrations | plug meeting a socket; the plug contacts are orange |
| 10 | reports | report sheet with a small bar chart; one bar is orange |
| 11 | settings | gear; the centre hub is orange |
| 12 | help | life ring; one segment is orange |

### Batch A2: KPI tiles (3D)

| Cell | Concept | Object, and which part is orange |
|---|---|---|
| 1 | alert | triangular warning plate with no mark on it; an inset triangle is orange |
| 2 | severity | graphite ember base; the flame is orange |
| 3 | pending | hourglass; the sand is orange |
| 4 | overdue | calendar block with a clock badge; the clock hand is orange |
| 5 | completion | round gauge dial; the arc and needle are orange |
| 6 | reduction | descending stepped bars; a downward arrow over them is orange |
| 7 | accept | round token with a check mark; the check is orange |
| 8 | edit | pencil; the tip is orange |
| 9 | reject | round token with a cross; the cross is orange |
| 10 | functions | three linked blocks (input, process, output); the middle block is orange |
| 11 | failure-mode | hex bolt or chip with a fracture; the crack glows orange |
| 12 | mitigation | open-end wrench; the jaw insert is orange |

### Batch A3: panels, toggles, vendors (3D)

| Cell | Concept | Object, and which part is orange |
|---|---|---|
| 1 | chart | bar chart of five blocks; the tallest bar is orange |
| 2 | matrix | 3x3 grid of tiles; the top-right tile is orange |
| 3 | history | clock face with a counter-clockwise arrow; the arrow is orange |
| 4 | sidebar-toggle | window slab with a narrow side column; the side column is orange |
| 5 | theme | disc half sun, half crescent moon; the sun half is orange |
| 6 | upload | open tray with an up arrow; the arrow is orange |
| 7 | plm | stack of three cubes; the top cube is orange |
| 8 | requirements | clipboard with checklist rows; the clip is orange |
| 9 | qms | rosette seal with ribbon tails; the seal centre is orange |
| 10 | regulatory | columned civic building; the central door is orange |
| 11 | database | cylinder stack; the middle ring band is orange |
| 12 | verification | lab flask; the liquid is orange |

### Batch B1: actions (flat, 16px)

| Cell | Concept | Glyph, and which part is orange |
|---|---|---|
| 1 | search | magnifying glass; the lens highlight arc is orange |
| 2 | add | plus; the centre square is orange |
| 3 | export | down arrow into a tray; the arrow is orange |
| 4 | accept | circle with a check; the check is orange |
| 5 | reject | circle with a cross; the cross is orange |
| 6 | edit | pencil; the tip is orange |
| 7 | flag | flag on a pole; the flag is orange |
| 8 | ai | small faceted chip with orbit dots (no sparkle); the core is orange |
| 9 | sync | two circular arrows; one arrow is orange |
| 10 | view | eye; the pupil is orange |
| 11 | re-extract | page corner brackets around text lines; one line is orange |
| 12 | sign-in | arrow entering a door frame; the arrow is orange |

### Batch B2: controls (flat, 16px)

| Cell | Concept | Glyph, and which part is orange |
|---|---|---|
| 1 | send | paper plane; the trailing fold is orange |
| 2 | close | cross; one stroke is orange |
| 3 | menu | three bars; the middle bar is orange |
| 4 | alert | triangle with an inner dot-less notch; the inner triangle is orange |
| 5 | standard-doc | page with a folded corner and text lines; the fold is orange |
| 6 | external | square with an arrow leaving the corner; the arrow is orange |
| 7 | arrow | right arrow; the head is orange |
| 8 | chevron | right chevron; a dot at the tip is orange |
| 9 | bell | bell; the clapper is orange |
| 10 | help | life ring; one segment is orange |
| 11 | logout | door frame with an arrow leaving; the arrow is orange |
| 12 | check | tick; the short stroke is orange |

### Batch B3: entities and reserve (flat, 16px)

| Cell | Concept | Glyph, and which part is orange |
|---|---|---|
| 1 | workspace | table with a header row; one cell is orange |
| 2 | reports | page with a down arrow; the arrow is orange |
| 3 | hierarchy | one parent node, two children; one child is orange |
| 4 | risk | shield; the centre gem is orange |
| 5 | integrations | plug; the pins are orange |
| 6 | theme | disc half sun, half moon; the sun half is orange |
| 7 | user (reserve) | head and shoulders; the head is orange |
| 8 | mitigation (reserve) | wrench; the jaw insert is orange |
| 9 | upload (reserve) | up arrow into a tray; the arrow is orange |
| 10 | settings (reserve) | gear; the hub is orange |
| 11 | pending (reserve) | hourglass; the sand is orange |
| 12 | history (reserve) | clock with a counter-clockwise arrow; the arrow is orange |

Post-processing notes for the next pass: slice each sheet on the 4x3 grid, export Tier A as transparent WebP at 2x and 3x of the final slot size, trace Tier B to SVG (so they can use `currentColor` for the graphite part). Rotate or mirror in CSS for `chevron`, `arrow`, `sidebar-toggle`.

## 5. Design weaknesses that make the UI look generic

Evidence is from screenshots I opened. File names are in `docs/icon-audit/`.

**Brand and colour**
1. **The brand orange is missing from the product.** Outside the logo (`overview.webp`, top-left) there is no orange anywhere: nav is grey circles with a black active pill, primary buttons are near-black pills, links are black. The Wayam identity (login hero is orange and graphite) disappears after sign-in, so the app reads as a neutral shadcn skin.
2. **Charts use a stock blue.** All six donuts on Overview are the same Tableau-style blue (`overview-full.webp`), and the distribution chart is five identical blue bars plus one red (`overview-bottom.webp`). Blue pills mark "Medium" risk in every table (`risk-register.webp`, `workspace.webp`, `ai-analysis.webp`). Blue carries no meaning in the brand and is the most common "AI dashboard" tell.
3. **Orange would collide with "High".** "High" risk is already orange (`risk-register.webp` row FM-0046, KPI "47"). When the brand orange is introduced it needs a semantic ramp that does not make every accent look like a warning.
4. **Traceability uses saturated green, amber and red squares** (`traceability.webp`) with a near-white "empty" cell. It looks like a traffic-light grid, not part of the palette, and the three colours are the only colour on the page.
5. **Overview heat matrix is pale blue and peach** (`overview-full.webp`): low contrast, no ramp, and blue for "Medium" is inconsistent with the risk badge scale.

**Hierarchy and layout**
6. **KPI tiles are flat.** A 16px grey outline icon sits top-right and does little (`overview-full.webp`). Labels that wrap to two lines ("AI SUGGESTIONS PENDING", "RESIDUAL RPN REDUCED") push those values about 16px lower than their neighbours, so the number baseline is not aligned across the row (280 and 14 sit higher than 23 and 43%). No deltas or sparklines are shown even though `KpiTile` supports `delta`.
7. **Hierarchy KPI tiles are a different scale.** The values on `hierarchy.webp` (4, 18, 2, 4, 18-216) are much smaller than the 280/14/23 on Overview and Risk Register, so the same component looks like two designs.
8. **Every region is the same bordered card.** Same 8px radius, hairline border, white fill, no layering, tint or elevation anywhere (all route screenshots). Nothing is visually more important than anything else.
9. **Each page header spends about 83px of 900px** on a small 44px mark and a thin grey Michroma title (`risk-register.webp`, y 56 to 138) with an empty band to the right when there are no actions. The marks are small and uneven in weight.
10. **The sidebar is the plainest element.** At 1440px it defaults to a 68px rail of 14 identical grey circles with 17px glyphs (`workspace.webp`); labels only appear on hover. There is about 285px of dead space between the last nav item and the footer (y 475 to 760). The expanded state (`expanded.webp`) is a flat list with uppercase group labels and no colour, no section icon weight and no active accent beyond a black pill.
11. **Top bar has three look-alike outlined pills** (project, user, company) plus two grey round buttons, all the same fill and border (`overview-full.webp`). Pipes are typed as text between "CardioGuard 3000 | Rev B | DFMEA-2025-001". Nothing signals which is interactive. Log out is an unlabelled icon at the far right.
12. **Login right panel is mostly empty.** About 200px of blank white above "Sign in" and a lot of unused width (`login.webp`). The logo sits tiny over the photo; the form side has no brand.

**Content and density**
13. **Truncation everywhere in the workspace table** (`workspace.webp`): Function, Effect and Mitigation are cut to about 20 characters ("Supply power at rate…", "Add runtime estimation …"), so the columns cannot be read without opening a row, while the page has 1440px of width.
14. **The AI floating button overlaps content on every page.** It covers "Not Started" and "In Progress" on FM-0045 and FM-0046 (`workspace.webp`), the last-sync date on Polarion (`integrations.webp`), and a table cell on `risk-register.webp`.
15. **AI Analysis cards are noisy** (`ai-analysis.webp`): each card has five identical outlined chips (S, O, D, RPN, Medium) and four identical outlined buttons. Accept and Reject have equal weight, so there is no primary action. The same row repeats on every card.
16. **Integrations cards are text walls** (`integrations.webp`): six equal cards, each with four stacked text blocks. The vendor icon is a generic grey lucide glyph in a grey puck, which reads as a placeholder, not a vendor.
17. **Documents is repetitive** (`documents.webp`): twelve rows with the same green "Extracted" status and the same "View" and "Re-extract" pair. The drop zone is a 140px dashed box with a tiny 24px icon in the middle: wasted space.
18. **Reports is lopsided** (`reports.webp`): a long form on the left, a narrow table with wrapped file names on the right, and about 380px of empty space under it. Native black radios and checkboxes look off-brand.
19. **Notification title is truncated although space exists** ("23 AI suggestions pending revi…", `notifications.webp`), and the "3" badge is 16px and clips the bell corner.
20. **AI assistant panel is 90% blank** with a single greeting card (`assistant.webp`). Header icon is the sparkle, the send button a black circle: it is the generic chatbot sidebar.
21. **Overview auto-opens a modal on first load** (`overview.webp`: the "Connected data sources" dialog sits over the whole page before any data is seen).

**Icons and charts**
22. **All icons are the same thin grey outline** at the same visual weight, so nothing can be recognised by shape or colour at a glance. The sparkle is the AI icon in about ten places.
23. **The existing page marks do not all say what the page is** (the Overview mark is a window with a ring, Documents a cube; `overview.webp`, `documents.webp`) and they are not repeated anywhere else, so they feel like decoration.
24. **Charts have no hierarchy**: six identical donuts in a 3x2 grid for one metric family (`overview-full.webp`), a five-bar chart across the full width (`overview-bottom.webp`), no annotation of what matters (the 14 critical).
25. **Mobile (390px)** works but is the desktop layout stacked (`mobile-risk.webp`): the title block takes 100px, the filters wrap into three rows, and the floating button overlaps table text.

## 6. Notes for the next pass (not done here)

- Update `contract.test.ts:234-248` and remove `svg.lucide` in `styles.css:264` when lucide is gone; keep the "one icon, one meaning" and "no two keys share a component" checks, now against image or SVG sources.
- Add a Sonner `icons` prop and a custom select chevron and checkbox/radio style so the native generics are covered.
- Delete or convert the 18 unused `ui/*.tsx` files.
- Enlarge the Tier A slots before swapping art (section 0.2).

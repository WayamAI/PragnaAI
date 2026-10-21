# UI review fixes (manager feedback)

Base: `main`. Branch: `ui-review-fixes`. Audit: `AUDIT_REVIEW.md`. Report: "Manager review" section of `REDESIGN_REPORT.md`.

| # | Point | Fix | Commit |
|---|---|---|---|
| 1 | Login before dashboard | Client-only root `beforeLoad` guard, same `pragnaai_auth` key | `3a0f281` |
| 2 | Icons | KPI tiles, panel headers, actions, search fields, all from `iconMap.ts` | `8115e61` |
| 3 | Sidebar | 2px rows, quiet group labels, one-row footer, no clipping at 800px | `7b0714e` |
| 4 | Casing | Title Case titles, sentence case everything else | `8e34ac8` |
| 5 | Tree view | ARIA tree, keyboard, chevron toggle, derived path | `3d0de37` |
| 6 | Dashes | No em dashes in `src/` (test added) | `695a96a` |
| 7 | Line gaps | Continuous matrix grid, unbroken row rules | `d5176ca` |
| 8 | Graphs | 3 ticks, grid, value labels, legend | `9660674` |
| 9 | Indicators | One series-1 blue, lighter neutral badge | `cce6147` |
| 10 | Consistency | Matching banners, workspace table fits at 1440 | `8e2a9ca` |

Before and after screenshots (`docs/review/*.webp`, one pair per point, 344 KB in total): 02-icons, 03-sidebar, 04-casing, 05-tree, 06-dashes, 07-gaps, 08-graphs, 09-indicators, 10-consistency. Point 1 is behavioural (see tests).

Verification: `tsc` clean, `npm test` 29/29, `npm run build`, `NITRO_PRESET=vercel npm run build` and `npm run build:gh-pages` pass. ESLint: 170 problems (162 errors, 8 warnings) over 106 files including `src/`, identical to the baseline; none from this branch (run with build output removed, since eslint does not ignore `.vercel` or `dist-gh-pages`). Click recorder against the baseline: 351 controls, 0 behavioural differences (only the 53 tree rows changed from `button` to `treeitem`).

Follow-ups in this round: spaced hyphens used as separators replaced with a middle dot (test added), ai-analysis KPI row and action buttons aligned at 390px, screenshots compressed to WebP.

Not done: tree search stays inert (needs ancestor-aware filtering); hierarchy detail panel is still Battery Pack demo data.

## Round 2: custom icons and brand pass

Custom 3D icon set (56 icons from the Flow sprite sheets, sliced to `public/images/icons`, with flat SVG fallbacks for ten keys at 16px and below) replaces every lucide and native generic icon. Then a design pass: brand orange accent (High risk moves to amber), branded sidebar with remembered state, new KPI tiles, brand charts, one project selector, the AI assistant in the top bar, an inline data-sources card instead of the first-load modal, and the VERIFY.md leftovers. Per-item detail and deviations: "Manager review, round 2" in `REDESIGN_REPORT.md`. Before and after: `docs/review/r2-*.webp`.

| Item | Change | Commit |
|---|---|---|
| Icons | `AppIcon` and the new icon map; custom select, checkbox, radio and toast icons; 18 unused shadcn files removed | `447a79a` |
| a | Brand tokens, primary buttons, focus ring, High to amber | `c8ee150` |
| b | Sidebar: 24px icons, labelled groups, remembered state | `299d88a` |
| c | KPI tiles with a brand icon puck | `7f4cb3b` |
| d | Panel header bands, 16/24 rhythm | `18399b1` |
| e | Brand rings and bars | `651c3b3` |
| f | One project selector in the top bar | `7236a43` |
| g | AI assistant button in the top bar | `6c5df27` |
| h | Inline Connected Data Sources card | `cbef50f` |
| i | Workspace fit, Login, Reports, casing, chat counts | `75dc7ae` |
| j | Consistent 32px controls, Risk Register fit | `2ffb334` |

Expected behaviour changes: the data-sources modal no longer auto-opens, the AI trigger moved to the top bar, the sidebar state is remembered per session. Click recorder against `main`: 284 controls matched, 246 identical, the other 38 explained in the report (tree rows as `treeitem`, earlier-round text changes, the intended new controls). `lucide-react` is unused but still in `package.json`.

Verification: `tsc` clean, 32 tests, both builds pass, lint 165 problems (baseline 170, all pre-existing prettier errors in `src/data` plus 7 warnings).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

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

Before and after screenshots (`docs/review/`): 02-icons, 03-sidebar, 04-casing, 05-tree, 06-dashes, 07-gaps, 08-graphs, 09-indicators, 10-consistency. Point 1 is behavioural (see tests).

Verification: `tsc` clean, `npm test` 28/28, `npm run build`, `NITRO_PRESET=vercel npm run build` and `npm run build:gh-pages` pass, eslint prints no problems. Click recorder against the baseline: 351 controls, 0 behavioural differences (only the tree rows changed from `button` to `treeitem`).

Not done: tree search stays inert (needs ancestor-aware filtering); hierarchy detail panel is still Battery Pack demo data.

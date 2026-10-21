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

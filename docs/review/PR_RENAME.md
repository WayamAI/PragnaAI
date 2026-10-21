# Rename product display name to TATVAM

Text-only change. The product's visible name goes from "PragnaAI" to "TATVAM". No behaviour, layout, colour or logic changes.

## What changed
- Page `<title>` and `og:title` in `src/routes/__root.tsx` and `gh-pages.html`.
- Login eyebrow and logo alt text; sidebar app-name line and logo alt text.
- Settings modal subtitle, top bar fallback eyebrow, "TATVAM Assistant" header.
- Overview and Integrations descriptions.
- README title.
- `contract.test.ts`: one new test asserting no visible "Pragna" text remains in `src/` outside the allowed internal identifiers.

The Wayam logo, mark and wordmark are unchanged.

## Intentionally kept internal
- Storage keys (`pragnaai_auth`, `pragnaai-theme`, `pragnaai-sidebar-groups`, `pragnaai-sidebar-expanded`) and the `pragnaai:open-assistant` event name. This keeps users signed in and keeps saved themes.
- package.json name, routes, base path `/FMEA/`, Vercel/nitro config names, repo and live-demo URLs, file names, CSS classes, two code comments.
- Historical docs (AUDIT*.md, REDESIGN_REPORT.md, VERIFY.md, docs/review/PR_BODY.md).

Full table: `RENAME_INVENTORY.md`.

## Checks
- `npm test`: 34 passed.
- `npm run build`, `NITRO_PRESET=vercel npm run build` (`.vercel` removed) and `npm run build:gh-pages`: all succeed.
- `npm run lint`: 165 problems (158 errors, 7 warnings), the same as main.
- `tsc --noEmit`: 2 errors in `__root.tsx`, identical on main (not introduced here).
- Browser run (fresh profile, headless Chromium): all 10 pages plus the 404 page in light and dark have 0 "pragna" matches in rendered DOM (scripts and styles excluded). Tab title is "TATVAM". The assistant panel shows "TATVAM Assistant".
- Signed in, set dark theme, reloaded: still signed in and still dark.
- Not run: full click recorder against main, mobile and collapsed sidebar, and every modal and toast. Those need a manual pass.

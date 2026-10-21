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

## Follow-up checks (production build, node-server preset, run locally)
- **Click recorder against main:** every button in main, header and aside on all 10 routes, clicked on a fresh page. It compared URL, dialog count, row count, toast text and console output before and after, with the product name normalised. 260 controls on each side: 260 identical, 0 behaviour differences.
- **Visual checks (light and dark, each screenshot opened):** collapsed sidebar with flyout, mobile drawer (390px), Help and Standards modal, Settings modal, notifications dropdown, help dropdown, a toast ("Opening full documentation..."), the 404 page and the error page (forced by blocking a route chunk). All show TATVAM with no layout changes.
- **Production text search:** 12 pages (10 routes, login, 404) in light and dark, 24 loads. Rendered DOM excluding scripts and styles: 0 "pragna" matches. Tab title is "TATVAM". The only remaining "pragnaai" string in served HTML is the storage key in the theme init script.

## Pre-existing tsc errors (identical on main, not from this branch)
`npx tsc --noEmit` reports 2 errors, both in `src/routes/__root.tsx`:
1. `__root.tsx(84,3)` TS2322: the `beforeLoad` callback returns void, but the route type expects a function returning never ("Type 'void' is not assignable to type 'never'"). It throws a redirect conditionally.
2. `__root.tsx(117,3)` TS2322: `ErrorComponent` is typed `({ error, reset }: { error: Error; reset: () => void })`, but TanStack's `ErrorComponentProps.error` is `unknown` ("Type 'unknown' is not assignable to type 'Error'").

Both appear with this branch's changes stashed, so they come from main.

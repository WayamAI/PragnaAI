# Rename product display name to Tatvam

The product's visible name goes from "PragnaAI" to "Tatvam" (title case, not all caps). The login brand panel gets its own type styles. No behaviour or logic changes.

## What changed
- Name text "Tatvam": page `<title>` and `og:title` (`src/routes/__root.tsx`, `gh-pages.html`), login page, sidebar app-name line, Settings subtitle, top bar fallback, "Tatvam Assistant", Overview and Integrations descriptions, logo alt text, README title.
- Uppercase removed for the product name only. The sidebar app-name line and the top bar fallback used `type-eyebrow` (forces uppercase), so they now use `type-label-sm`. Other eyebrow labels stay uppercase. The top bar keeps the eyebrow style when it shows a nav group name.
- The Wayam logo, mark and wordmark are unchanged.

## Login brand panel
The old uppercase eyebrow is replaced by the product name, so the name is not shown twice. Two new tokens in `src/styles.css`, used from `src/routes/login.tsx`:

| Token | Element | Desktop (>= lg) | Below lg |
|---|---|---|---|
| `type-display-brand` | "Tatvam" | 36px (2.25rem), Michroma 400, line-height 1.15, letter-spacing -0.02em | 28px (1.75rem) |
| `type-tagline` | "AI-assisted DFMEA for medical device risk analysis." | 14px / 20px, Geist, white, max-width 20rem (wraps to 2 lines), 8px under the name | same |

The brand panel is `hidden lg:flex`, so below 1024px it is not shown and the 28px size is never visible (the hero, gradients and Wayam logo are untouched). The form column (`#email`, `#password`, labels, "Sign in", error message) is unchanged.

Measured in the production build (computed styles, 1440px): name 36px / 41.4px line height, Michroma, weight 400, letter-spacing -0.72px, `text-transform: none`; tagline 14px / 20px, Geist, 2 lines, 8px gap. At 390px the panel is `display: none` and the name resolves to 28px. Contrast of white text against the brightest background pixel under the tagline (text hidden, hero image and gradient only): about 20:1.

## Intentionally kept internal
- Storage keys (`pragnaai_auth`, `pragnaai-theme`, `pragnaai-sidebar-groups`, `pragnaai-sidebar-expanded`) and the `pragnaai:open-assistant` event. This keeps users signed in and keeps saved themes and sidebar state.
- package.json name, routes, base path `/FMEA/`, Vercel/nitro config names, repo and live-demo URLs, file names, CSS class names, two code comments.
- Historical docs (AUDIT*.md, REDESIGN_REPORT.md, VERIFY.md, docs/review/PR_BODY.md).

Full table: `RENAME_INVENTORY.md`.

## Checks
- `npm test`: 35 passed. The product-name test now asserts the visible name is "Tatvam" and that no visible "TATVAM", "PragnaAI" or "Pragna" remains in `src/` outside the whitelisted internal identifiers. A second new test asserts the login uses the new tokens and their sizes.
- `npm run build`, `NITRO_PRESET=vercel npm run build` (`.vercel` removed), `npm run build:gh-pages` and a `node-server` build: all succeed.
- `npm run lint`: 165 problems (158 errors, 7 warnings), the same as main.
- `tsc --noEmit`: 2 errors, both pre-existing (see below).
- **Click recorder against main:** every button in main, header and aside on all 10 routes, clicked on a fresh page, comparing URL, dialog count, row count, toast text and console output (product name normalised). 260 controls on each side, 260 identical, 0 behaviour differences.
- **Screenshots (all opened, light and dark):** login at 1440 and 390; sidebar expanded, collapsed with flyout, mobile drawer; top bar; Tatvam Assistant panel; Help and Settings modals; notifications and help dropdowns; one toast; 404 page; error page. All show "Tatvam" and no layout changes. At 390 the login shows the form column only.
- **Production text search:** 12 pages (10 routes, login, 404) x light and dark = 24 loads, rendered DOM excluding scripts and styles, plus tab title: 0 "pragna" (case-insensitive), 0 "TATVAM" (case-sensitive). Tab title is "Tatvam". The only "pragnaai" left in served HTML is the storage key in the theme init script.
- Real sign-in, dark theme set, reload: still signed in (`/overview`) and still dark.

## Pre-existing tsc errors (not from this branch)
Both are in `src/routes/__root.tsx`. The file differs from main only in the two title strings (lines 91 and 97), so the same errors, at the same lines, exist on main:
1. `__root.tsx(84,3)` TS2322: the `beforeLoad` callback returns void, but the route type expects a function returning never ("Type 'void' is not assignable to type 'never'"). It throws a redirect conditionally.
2. `__root.tsx(117,3)` TS2322: `ErrorComponent` is typed `({ error, reset }: { error: Error; reset: () => void })`, but TanStack's `ErrorComponentProps.error` is `unknown` ("Type 'unknown' is not assignable to type 'Error'").

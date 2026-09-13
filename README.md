# Redhead Waifus Archive

A curated, browsable catalog of red-haired fictional characters from manga, manhwa (and, once entries exist, manhua). Flat, poster-style "Modernist" visual design — no glassmorphism, no blur, hard edges, scarlet-on-maroon. See [`PRODUCT.md`](./PRODUCT.md) for the full product/architecture writeup.

## Stack

React 18 + Vite 5 + Tailwind CSS 3. No backend — the dataset is a local JSON file imported directly by the app.

## Getting started

```bash
npm install
npm run dev       # start the Vite dev server (http://localhost:5173)
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint      # ESLint, zero warnings allowed
```

There is no automated test suite in this project. Changes are verified with `npm run lint`, `npm run build`, and manual/scripted browser checks.

## Project structure

```
src/
  App.jsx                     top-level layout + shared "featured character" state
  data/red_waifus.json        the curated dataset (32 entries)
  utils/dailyWaifu.js         deterministic UTC-day pick, seeds the initial featured character
  utils/verletRope.js         Verlet-integration rope physics (used by the character modal's chain)
  hooks/useChainPhysics.js    React hook orchestrating the rope simulation + DOM anchors
  components/
    TopNav.jsx                 top bar: wordmark, in-page anchors, shuffle, deploy link
    WaifuOfTheDay.jsx           hero band (headline + live dataset stats)
    Ticker.jsx                  infinite name marquee (used twice, forward/reversed)
    ThumbnailRow.jsx             roster strip (first 7 entries)
    CharacterSelect.jsx          always-visible bio/portrait/facts panel for the featured character
    MainArticle.jsx / WaifuCard.jsx   full filterable catalog grid
    CharacterModal.jsx            catalog-click detail modal with the chain-physics chrome
    FooterCta.jsx                 footer
```

`src/services/waifuApi.js`, `src/services/waifuData.js`, and `public/data/red_waifus.json` are leftovers from an earlier iteration that fetched from a dev-only API route; nothing in the current app imports them.

## This session's changes

Starting point was a glassmorphism redesign (dark background, blur, scarlet glow shadows, sidebar filter). This session replaced it end to end and then iterated heavily on one new feature:

**1. Full visual redesign (glassmorphism → flat "Modernist" editorial).**
Rebuilt every component against a new flat token system (Archivo type, `accent`/`paper`/`ink` colors, 2px hard borders, no blur/rounded corners/glow shadows) extracted from a reference design. Removed the sidebar; navigation became a top bar with in-page anchors. Rewrote `TopNav`, `WaifuOfTheDay` (hero), `ThumbnailRow` (roster), `CharacterSelect` (always-visible bio panel), `MainArticle`/`WaifuCard` (catalog grid), and added `FooterCta`.

**2. Catalog-triggered character detail modal (new feature, done as a full SDD cycle: explore → propose → spec → design → tasks → apply → verify → archive).**
Clicking a catalog card (only the catalog — roster and hero clicks still just move the featured cursor) opens `CharacterModal.jsx`:
- Revived and adapted the Verlet-rope physics chain (`verletRope.js` + `useChainPhysics.js`) from an earlier chromatic-aberration-era prototype, retargeting its scroll-reactivity from `window.scrollY` to the modal panel's own internal scroll (page scroll is locked while the modal is open).
- Full-color portrait (a deliberate exception to the grayscale-except-featured rule elsewhere), Series/Origin/Traits column connected to the portrait by animated rope lines.
- Body-scroll lock, Escape/backdrop/close-button dismissal, a hand-rolled focus trap, and a `prefers-reduced-motion` static fallback.
- Below the `md` breakpoint the rope/pins/SVG are unmounted entirely (not just hidden) and facts stack plainly.

**3. Iterative visual polish on the modal**, driven by direct feedback rounds (not all from the original spec):
- Added transparency with a live SVG chromatic-aberration filter (`feColorMatrix`/`feOffset`/`feBlend`) over the panel background.
- Reworked the internal layout from a two-column grid to a top-aligned flex row (bio | portrait | facts) so all three sections start at the same height and the portrait reads as genuinely centered on the whole panel, not just within a column.
- Multiple rounds of sizing/spacing tuning (portrait size, column widths, gaps, panel max-width/max-height) balancing "no dead space" against "still has scroll so the rope's scroll-reactivity is visible."
- Physics retuning for a "floating" feel (lower gravity, higher ambient wind amplitude) instead of a heavy hanging sag.

**4. Richer per-character content.** Expanded every one of the 32 dataset entries from a one-line tag to a 2–3 sentence bio (used by both `CharacterSelect` and the new modal).

**5. Catalog hover effect.** Hovering a catalog card now reveals full color plus a subtle scale/outline "power-up" pop (character-select-screen inspired), reverting to grayscale on mouse-out.

**6. Hero headline rewrite.** "Introducing new character" → "The world's finest redhead archive" — the hero now speaks to the catalog itself rather than a rotating single character.

**7. Ticker bug fix.** The name-marquee ticker previously repeated a fixed 10 copies of a short placeholder phrase, sized against a container forced to a fixed pixel width — real character names are wider, which made text overflow one track and visually overlap the next. Fixed by sizing both tracks to their natural content width (`w-max`) instead of a hardcoded percentage split, and switched the ticker's content from a generic tagline to the actual list of character names.

All changes were verified with `npm run lint`, `npm run build`, and headless-browser (Playwright) checks across desktop and mobile viewports before being considered done.

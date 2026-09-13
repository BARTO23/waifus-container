# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anime/manga fans in general, browsing to discover redhead characters — not limited to the project owner's personal use.

## Product Purpose

A curated, browsable catalog of red-haired fictional characters. Visitors land on a rotating hero, browse a small roster and a full filterable catalog, and open a per-character detail modal (portrait, bio, series/origin/traits) triggered by clicking any catalog card.

## Positioning

Multi-origin coverage by design: the catalog schema and the "Full catalog" filter UI support manga (Japan), manhwa (Korea), and manhua (China) alike, where most comparable "redhead waifu" lists only cover Japanese manga. As of this writing the curated dataset itself has 26 manga + 6 manhwa entries and 0 manhua entries yet — the manhua filter button is intentionally omitted from the UI until at least one entry exists (see `MainArticle.jsx`'s `FILTERS` comment), rather than shipping a filter that always returns nothing.

## Operating Context

Single-page app, flat "Modernist" editorial/poster visual system (Archivo type, scarlet-on-maroon palette, hard edges, no glassmorphism/blur — see `src/index.css` and `tailwind.config.js`). No sidebar and no search box; navigation is a top bar with in-page anchors. Layout top to bottom:

1. **Top nav** (`TopNav.jsx`) — wordmark, Catalog/Character/Roster anchors, Shuffle, and a link out to the live deployment.
2. **Hero** (`WaifuOfTheDay.jsx`) — static headline ("The world's finest redhead archive"), live dataset stats (character/manga/manhwa counts), and a "Next for detail" control that advances the shared featured-character cursor.
3. **Name ticker** (`Ticker.jsx`) — an infinite marquee of every character's name, used twice (forward and reversed) with different colors/speeds as a decorative band.
4. **Roster** (`ThumbnailRow.jsx`) — the first 7 catalog entries as clickable thumbnails; picking one moves the shared "featured" cursor.
5. **Character Select** (`CharacterSelect.jsx`) — an always-visible bio/portrait/facts panel for the current featured character (portrait deliberately always grayscale here, the one intentional exception to the grayscale-except-featured rule elsewhere).
6. **Full catalog** (`MainArticle.jsx` + `WaifuCard.jsx`) — the entire dataset as a filterable grid (All/Manga/Manhwa). Cards are grayscale except the featured one, and reveal full color plus a scale/outline "power-up" effect on hover. Clicking any card opens the detail modal.
7. **Character detail modal** (`CharacterModal.jsx`) — opened by a catalog click only (roster/hero clicks never open it). Full-color portrait, a longer per-character bio, and a Verlet-rope physics chain connecting the portrait to the Series/Origin/Traits column; the chain reacts to the modal panel's own internal scroll (not page scroll, which is locked while open) and to real OS window movement. The panel background uses a live SVG chromatic-aberration filter over a translucent backdrop. Dismisses via Escape, backdrop click, or the close button; below the `md` breakpoint the rope/pins are unmounted (not just hidden) and facts stack plainly.
8. **Footer CTA** (`FooterCta.jsx`).

Data is a local curated JSON file imported directly (`src/data/red_waifus.json`, loaded synchronously by `App.jsx` — no fetch, no loading state). `src/services/waifuApi.js` / `waifuData.js` and `public/data/red_waifus.json` are leftover from an earlier iteration that fetched from a dev-only `/api/waifus` middleware; nothing in the current app imports them, and no live route serves that path. Treat them as unused unless a future change reintroduces an API layer.

## Capabilities and Constraints

- SFW only: no explicit/NSFW content; characters represented respectfully.
- Dataset currently has 32 curated entries (26 manga, 6 manhwa, 0 manhua).
- Every entry has a multi-sentence bio (used both in the always-visible Character Select panel and the catalog-click detail modal) — not just a one-line tag.
- Stack: React + Vite + Tailwind CSS.
- No automated test runner in this project; changes are verified via `npm run lint`, `npm run build`, and manual/scripted browser checks (Playwright), not a test suite.

## Evidence on Hand

- Curated dataset: `src/data/red_waifus.json` (32 entries, active) and `public/data/red_waifus.json` (stale copy from the unused API path — do not treat as a second source of truth).
- Dataset validation script: `scripts/validate_dataset.cjs`.

## Product Principles

1. Multi-origin representation (manga + manhwa + manhua) is the core differentiator — the schema and filter UI must keep supporting all three even while manhua has zero entries; never hardcode manga-only assumptions.
2. SFW, respectful representation at all times.
3. Prefer a smaller, correct dataset over a larger, unverified one.
4. The character detail modal's physics/visual flourish (chain, chromatic aberration) is a deliberate identity choice for this app, not incidental decoration — preserve it when touching that surface rather than simplifying it away.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anime/manga fans in general, browsing to discover characters — not limited to the project owner's personal use.

## Product Purpose

A browsable catalog of red-haired female characters. Visitors filter by origin (manga, manhwa, manhua) and search by name/series to discover characters, then open a detail view per character.

## Positioning

Multi-origin coverage: the catalog spans manga (Japan), manhwa (Korea), and manhua (China) alike, where most comparable "redhead waifu" lists only cover Japanese manga.

## Operating Context

Single-page browsing session: sidebar filter by origin, sticky search/filter bar, responsive card grid, and a modal detail panel per character. Data is served from a local curated dataset (`src/data/red_waifus.json` / `public/data/red_waifus.json`), read through `src/services/waifuApi.js`, which calls `/api/waifus` (a dev-only Vite middleware) and falls back to client-side filtering of the same dataset when that route isn't available (e.g. in production on Vercel).

## Capabilities and Constraints

- SFW only: no explicit/NSFW content; characters represented respectfully.
- Dataset currently has 32 curated entries (`totalCount` in `App.jsx`) across manga/manhwa/manhua.
- Stack: React + Vite + Tailwind CSS (existing scaffold, not a decision to make going forward).

## Evidence on Hand

- Curated dataset: `src/data/red_waifus.json` and `public/data/red_waifus.json` (32 entries).
- Dataset validation script: `scripts/validate_dataset.cjs`.

## Product Principles

1. Multi-origin representation (manga + manhwa + manhua) is the core differentiator — never regress to manga-only.
2. SFW, respectful representation at all times.
3. Prefer a smaller, correct dataset over a larger, unverified one.

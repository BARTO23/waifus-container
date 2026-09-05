## Context

The application is a React + Vite SPA with Tailwind CSS. Currently, character data is fetched from an external third-party API (`nekos.best`) via Vite proxy, alongside a small static mock list (6 items). This setup lacks control over character attributes, cannot guarantee red-haired character traits, and lacks representation for Korean manhwa and Chinese manhua.

See `proposal.md` for motivation and `specs/red-waifus-api/spec.md` for functional requirements.

## Goals / Non-Goals

**Goals:**
- Provide a curated static and runtime dataset containing 400+ distinct red-haired waifus distributed across Japanese manga, Korean manhwa, and Chinese manhua.
- Implement an API endpoint `/api/waifus` via Vite dev server middleware (and client-side static fetch fallback for production builds) supporting pagination, medium filtering (`manga`, `manhwa`, `manhua`), and name/series search.
- Standardize the character data contract and update client data access in `src/services/waifuApi.js`.

**Non-Goals:**
- Building a standalone persistent database server (e.g., PostgreSQL or MongoDB) for a read-only showcase app.
- User authentication, image uploads, or mutating character entries on the server.

## Decisions

### Decision 1: Curated JSON repository vs External Live Scraper
- **Choice**: Ship a structured JSON catalog (`src/data/red_waifus.json` / `public/data/red_waifus.json`) with verified metadata and CDN-hosted image assets.
- **Rationale**: Live scraping external APIs (AniList, Jikan, MangaUpdates) at runtime causes rate-limiting, slow response times, and broken image links. A curated, validated JSON catalog guarantees instant response times, zero external runtime dependencies, and reliable character categorization.
- **Alternative considered**: Fetching from dynamic external APIs on every request. Rejected due to rate limits, inconsistency in hair color tags, and network fragility.

### Decision 2: API Delivery Mechanism
- **Choice**: Vite development server connect middleware for `/api/waifus` during development, paired with a client-side query handler in `waifuApi.js` that can execute both HTTP requests and fallback direct JSON querying for static deployment.
- **Rationale**: Keeps the architecture simple and zero-extra-server, matching Vite's ecosystem while exposing clean RESTful endpoint semantics (`/api/waifus?page=1&limit=20&origin=manhwa&search=`).
- **Alternative considered**: Standalone Express server. Rejected because it requires running two concurrent processes (backend + frontend) for a static read-only catalog.

### Decision 3: Character Schema & Distribution
- **Choice**: Dataset partitioned into at least 400 records with explicit `origin` field (`manga`, `manhwa`, `manhua`), unique identifier (`id`), `name`, `series`, `description`, `image`, and `tags`.
- **Rationale**: Direct compliance with UI requirements and spec contracts.

## Risks / Trade-offs

- **[Risk] Broken image URLs from external CDNs** → Mitigation: Use reliable high-uptime CDNs (e.g., Wikimedia, Cloudinary, Imgur, or direct anime database CDNs) and implement fallback placeholder avatars in `WaifuCard.jsx`.
- **[Risk] Dataset size impact on initial load** → Mitigation: Keep dataset in `public/data/` or split dynamically; paginate responses in chunks of 20 to maintain 60 FPS scrolling and low memory footprint.

## Migration Plan

1. Create the curated dataset file with 400+ characters across manga, manhwa, and manhua.
2. Implement `/api/waifus` route in `vite.config.js` with query parameter parsing.
3. Refactor `src/services/waifuApi.js` to call `/api/waifus`.
4. Update UI components (`MainArticle.jsx` and `WaifuCard.jsx`) to display origin filters and badges.
5. Rollback strategy: revert `waifuApi.js` and `vite.config.js` if necessary.

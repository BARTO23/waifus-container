## Why

The current application relies on a limited local mock list (6 items) and an external proxy to a third-party endpoint (nekos.best) that lacks character diversity and cannot guarantee a curated catalog of red-haired characters. A dedicated API serving at least 400 red-haired waifus from diverse manga, manhwa (Korean), and manhua (Chinese) origins is required to support rich catalog browsing, pagination, and filtering in the UI.

## What Changes

- Introduce a dedicated API service and dataset containing at least 400 curated red-haired waifus across Japanese manga, Korean manhwa, and Chinese manhua.
- Provide standardized character metadata: unique ID, character name, origin medium/country (manga, manhwa, manhua), source series, description, tags, and verified image URLs.
- Expose API endpoints with support for pagination (limit, page/offset), search by name or series, and filtering by origin (manga, manhwa, manhua).
- Update the client-side data service (src/services/waifuApi.js) to consume the new API instead of the external nekos proxy.

## Capabilities

### New Capabilities
- `red-waifus-api`: Internal catalog API service and dataset providing 400+ red-haired waifus across manga, manhwa, and manhua with pagination and origin filtering.

### Modified Capabilities
None.

## Impact

- **API & Data**: Adds dataset with 400+ entries and mock/server handler (Vite endpoint or server middleware) with query support.
- **Frontend Services**: Updates src/services/waifuApi.js to target the new API schema and endpoints.
- **Frontend UI**: MainArticle.jsx and WaifuCard.jsx consume rich metadata (origin badges, proper character names, and series tags).

# Design System — Redhead Waifus Archive

Source of truth: `tailwind.config.js`, `src/index.css`, `index.html`, and the component files under `src/components/`. All values below are taken directly from the current codebase — nothing invented.

## 1. Color Palette

Defined in `tailwind.config.js` (`theme.extend.colors`):

| Token | Value | Usage |
|---|---|---|
| `dark-950` | `#060608` | page background (`body`, `App.jsx` root) |
| `dark-900` | `#0c0c0e` | card / panel / modal background |
| `scarlet-50…950` | `#fff1f2` → `#4c0519` | primary accent scale (brand color) |

Plus default Tailwind `zinc` scale for neutral text/borders (`zinc-100`, `zinc-300`, `zinc-400`, `zinc-500`, `zinc-700`, `zinc-800`, `zinc-900`), and one-off semantic colors for origin badges: `indigo` (manga), `emerald` (manhwa), `amber` (manhua).

Selection highlight (`src/index.css`): `background-color: rgba(225, 29, 72, 0.3)` (scarlet-600 at 30%), text `#fecdd3` (scarlet-200).

## 2. Typography

Loaded in `index.html` via Google Fonts: `Inter` (300–700), `Manrope` (400–800), `JetBrains Mono` (400–500).

Mapped in `tailwind.config.js`:
- `font-heading` / `font-body` → `Manrope, Inter, sans-serif`
- `font-mono` → `JetBrains Mono, Fira Code, monospace`

Usage patterns observed:
- Page title: `text-3xl sm:text-5xl font-extrabold tracking-tight font-heading`
- Modal/card title: `text-xl` / `text-sm font-semibold tracking-tight font-heading`
- Body copy: `text-xs sm:text-sm text-zinc-400 leading-relaxed`
- Labels, badges, IDs, counters: `font-mono`, almost always at `text-[10px]` or `text-[11px]`, frequently with `uppercase tracking-wider`/`tracking-widest`

Base font smoothing (`src/index.css`):
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
font-feature-settings: "cv02", "cv03", "cv04", "cv11";
```

## 3. Transparency / Glassmorphism Effect

There is one shared source of truth for the "frosted glass" look in the app: the `.glass-surface` component class in `src/index.css` (`@layer components`, appended after `.linear-grid`). Every glass surface (sidebar, sticky control bar, badges, like button, modal panel) applies this class instead of an ad-hoc `bg-{color}/{opacity} + backdrop-blur-{size} + border-{color}/{opacity}` combination. Each surface still supplies its own tint/border-color and blur rung as Tailwind utility classes alongside `.glass-surface`, since the Tailwind utilities layer wins over the components layer — this is how per-origin badge hues and per-surface tint stay local and semantic while the blur/rim/grain material stays shared.

### 3.1 Modal panel (`src/components/MainArticle.jsx:260-`)

The modal is a fixed container with two children: a scrim (sibling, not ancestor, of the panel) and the panel itself.

```jsx
<div
  className="fixed inset-0 z-50 flex items-center justify-center p-4"
  onClick={() => setSelectedWaifu(null)}
>
  {/* Scrim: sibling of the panel, carries the fade, no backdrop-filter */}
  <div className="absolute inset-0 bg-black/60 animate-fade-in" />

  <div
    className="glass-surface glass-surface--grain glass-surface--rim glass-surface--elevated relative z-10 w-full max-w-2xl border border-zinc-800/60 rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]"
    onClick={(e) => e.stopPropagation()}
  >
```

The outer fixed container carries only layout and click-to-close — no `bg-*`, no `backdrop-blur-*`, no `animate-*`. This matters because `animate-fade-in` (defined in `tailwind.config.js`) animates `opacity` **and** `transform` with `forwards` fill, and either property on the panel or any of its ancestors truncates `backdrop-filter` rendering in Chromium/WebKit — so the fade lives on the scrim only, never on the panel's ancestor chain. Because the scrim is a preceding sibling of the panel (not an ancestor), the panel's `.glass-surface` blur genuinely frosts the grid content *and* the scrim behind it, at every frame of the animation, not just after it settles. `bg-black/60` on the scrim keeps enough luminance variation showing through the blur while the panel's own `dark-900/72` tint floor (from `.glass-surface`) holds body text above readable contrast.

### 3.2 Surfaces adopting `.glass-surface`

| Surface | File:line | Classes |
|---|---|---|
| Sidebar | `NavBar.jsx:57` | `glass-surface glass-surface--blur-2xl glass-surface--grain` + `bg-dark-950/80 border-r border-zinc-800/80` |
| Sticky filter/search bar | `MainArticle.jsx:127` | `glass-surface glass-surface--grain` + `bg-dark-900/80 border border-zinc-800/80` |
| Modal panel | `MainArticle.jsx:265` | `glass-surface glass-surface--grain glass-surface--rim glass-surface--elevated` + `border border-zinc-800/60` |
| Origin badge | `WaifuCard.jsx:87` | `glass-surface glass-surface--blur-md` + per-origin `bg-{color}-950/60 text-{color}-300 border-{color}-800/50` |
| Like button | `WaifuCard.jsx:99` | `glass-surface glass-surface--blur-md` + `bg-dark-950/60 border-zinc-800/80` (or the liked-state scarlet classes) |

### 3.3 Reproducible recipe

To add a new glass surface: apply `glass-surface` plus one blur-rung modifier (`glass-surface--blur-md|xl|2xl`, or the unmodified base for the 16px default), then layer your own `bg-{color}/{opacity}` and `border-{color}/{opacity}` utilities on top — the utilities layer overrides `.glass-surface`'s border-color and (if you add `backdrop-blur-*`, don't) blur, so only add tint/border, never a competing blur or `backdrop-filter` utility. Add `glass-surface--grain` for a subtle noise texture and/or `glass-surface--rim` for a gradient-mask border rim on larger panels where a stronger edge reads well; skip both on small elements (badges, buttons) where the cost isn't worth it. Add `glass-surface--elevated` for a stronger outer drop shadow on top-level panels (e.g. the modal).

**Invariant 1 — no competing shadow.** A `.glass-surface` element must never also carry a Tailwind `shadow-*` utility: `shadow-*` replaces the whole `box-shadow`, silently deleting the inset specular rim the base class defines. The sole intentional exception is `shadow-scarlet-glow` on the liked-state heart button, where the scarlet glow deliberately replaces the rim.

**Invariant 2 — surface count and blur budget.** No more than 3 concurrent large-area (`>= ~20%` of viewport) `backdrop-filter` surfaces may be visible in one view, and no surface's blur radius may exceed 16px — **except the sidebar**, which may keep its existing 40px blur because it is a static, non-scrolling surface with no scroll-performance risk. This exception is bounded to the sidebar only; it must never be used to justify exceeding 16px on the filter bar, badges, or modal.

## 4. Reusable Components / Patterns

- **`.glass-surface`** (`src/index.css`) — the shared glass material class (blur, tint floor, border-color, inset specular rim) plus its `--blur-md/xl/2xl`, `--elevated`, `--grain`, and `--rim` modifiers. See Section 3.
- **Card** (`WaifuCard.jsx`): `bg-dark-900 rounded-xl border border-zinc-800/80 hover:border-scarlet-500/50 hover:shadow-card-hover`, `aspect-[3/4]` media, bottom gradient overlay for text legibility (`bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent`).
- **Badges/tags**: `text-[10px] font-mono px-2 py-0.5 rounded(-md) border`, always with a matching `/60` or `/80` background opacity and a small colored dot (`w-1.5 h-1.5 rounded-full`).
- **Segmented control / nav buttons**: active state `bg-zinc-800 text-white border border-zinc-700/60`; inactive `text-zinc-400 hover:bg-zinc-900/50`.
- **Grid layout**: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4`.
- **Glow shadows** (`tailwind.config.js`): `shadow-scarlet-glow`, `shadow-scarlet-glow-lg`, `shadow-card-hover` — custom `boxShadow` tokens combining a soft dark shadow with a scarlet-tinted glow.
- **Background texture**: `.linear-grid` (`src/index.css`) — a 32px grid of 1px white-3% lines, applied on the app root.

## 5. How to Reproduce the Transparency Effect in a New Component

1. Add `glass-surface` to the element, plus a blur-rung modifier if the default 16px isn't right (`glass-surface--blur-md` for small elements like badges/buttons, `glass-surface--blur-xl`/`--blur-2xl` for large static or low-scroll-cost panels).
2. Layer your own `bg-{color}/{opacity}` and `border-{color}/{opacity}` utilities on top for tint and border color — never add a competing `backdrop-blur-*`/`backdrop-filter` utility once `.glass-surface` is applied.
3. Optionally add `glass-surface--grain` (noise texture) and/or `glass-surface--rim` (gradient-mask border) on larger panels; skip both on small elements.
4. Optionally add `glass-surface--elevated` for a stronger outer drop shadow on top-level panels (modals, popovers).
5. Round the corners to match context: `rounded-lg`/`rounded-xl` for small elements, `rounded-2xl` for panels/modals.
6. If it should fade in, put `animate-fade-in` on a sibling scrim or an inner wrapper — never on the `.glass-surface` element itself or any of its ancestors, since animating `opacity`/`transform` there truncates `backdrop-filter` (see Section 3.1).
7. Respect the two invariants from Section 3.3: no `shadow-*` utility on a `.glass-surface` element (except the documented `shadow-scarlet-glow` case), and no more than 3 concurrent large-area glass surfaces at <= 16px blur, with the sidebar's 40px as the sole documented exception.

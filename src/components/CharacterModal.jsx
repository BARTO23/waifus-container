import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useChainPhysics } from '../hooks/useChainPhysics';

// Duplicated from `CharacterSelect.jsx` on purpose: that file doesn't export
// this array, and it's explicitly out of scope for this change (see design
// doc). Keep the label/value pairing and the `origin` uppercasing in sync if
// `CharacterSelect.jsx` ever changes its own copy.
const FACTS = [
  { label: 'Series', get: (w) => w.series },
  { label: 'Origin', get: (w) => (w.origin || '').toUpperCase() },
  { label: 'Traits', get: (w) => (w.tags || []).join(' · ') },
];

// Keep this literal in sync with Tailwind's `md` breakpoint. Below it the
// rope/pin SVG is unmounted (not just CSS-hidden) — a `display:none` stage
// yields all-zero `getBoundingClientRect()`s, which would feed degenerate
// geometry into the physics anchors.
const WIDE_QUERY = '(min-width: 768px)';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Full-color character detail modal opened from a "Full catalog" card click.
 * Rebuilt against the current flat/Modernist tokens (no glass, no pixel
 * grid, no chromatic aberration) with a revived Verlet-rope chain connecting
 * the portrait's pins to the facts column. Renders `null` when `waifu` is
 * absent, but every hook below still runs unconditionally on every render —
 * required by the rules of hooks, since the early return happens after them.
 */
export const CharacterModal = ({ waifu, onClose = () => {} }) => {
  const isOpen = Boolean(waifu);

  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setHasError(false);
  }, [waifu?.image]);

  const [isWide, setIsWide] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(WIDE_QUERY).matches
      : true
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia(WIDE_QUERY);
    const handleChange = (e) => setIsWide(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const scrollRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const openerRef = useRef(null);

  const { stageWrapRef, svgRef, getPinRef, getFactRef, getPathRef } = useChainPhysics(
    isOpen && isWide,
    FACTS.length,
    scrollRef
  );

  // Escape-to-close + Tab-wrap focus trap, and move focus to the close
  // button on open / restore it to the opener on close.
  useEffect(() => {
    if (!isOpen) return undefined;

    openerRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (openerRef.current && typeof openerRef.current.focus === 'function') {
        openerRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Body scroll lock while open — save the exact previous inline value and
  // restore it on close/unmount, never a hardcoded assumption like `''`.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!waifu) return null;

  const nameId = `character-modal-title-${waifu.id}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/55 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Filter def only — zero-size and never painted itself, referenced by
          the panel's `backdropFilter` below. Must stay a real (non-`display:
          none`) SVG node or Chromium drops the filter reference. */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="modal-chromatic-aberration" x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="redChannel"
            />
            <feOffset in="redChannel" dx="-4" dy="0" result="redOffset" />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="greenChannel"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blueChannel"
            />
            <feOffset in="blueChannel" dx="4" dy="0" result="blueOffset" />
            <feBlend in="redOffset" in2="greenChannel" mode="screen" result="rg" />
            <feBlend in="rg" in2="blueOffset" mode="screen" />
          </filter>
        </defs>
      </svg>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={nameId}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'rgba(77, 23, 14, 0.62)',
          backdropFilter: 'url(#modal-chromatic-aberration) blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        className="relative flex flex-col w-full max-w-[820px] max-h-[min(400px,64vh)] overflow-hidden outline outline-2 outline-paper/50"
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-11 h-11 bg-transparent text-paper border-2 border-paper/50 cursor-pointer transition-colors hover-hover:hover:border-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-paper"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-full h-full p-3">
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        <div ref={scrollRef} className="overflow-y-auto overscroll-contain pl-6 pr-6 py-10 sm:pl-8 sm:pr-16 sm:py-16">
          <div ref={stageWrapRef} className={isWide ? 'relative flex items-start justify-center gap-16' : 'relative'}>
            {isWide && (
              <svg
                ref={svgRef}
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                {FACTS.map((fact, i) => (
                  <path
                    key={fact.label}
                    ref={getPathRef(i)}
                    fill="none"
                    stroke="#ec3013"
                    strokeWidth="2"
                    strokeLinecap="butt"
                  />
                ))}
              </svg>
            )}

            {/* Eyebrow + description. On wide viewports this is a top-aligned
                flex item (see the wrapper above) so it starts level with the
                portrait and facts instead of pushing them down below it. */}
            <div className={isWide ? 'w-[220px] shrink-0' : 'max-w-[340px] sm:max-w-[420px]'}>
              <h3 className="font-heading font-black uppercase text-[clamp(20px,2.4vw,28px)] leading-none text-paper mb-3">
                Character select
              </h3>
              <p className="text-sm leading-[1.65] text-paper/90">{waifu.description}</p>
            </div>

            {/* Portrait + name. On wide viewports this is the flexible middle
                flex item, top-aligned with the description and facts (no
                more mt-push below the description); it's simply taller than
                its neighbors, which is fine since flex items-start lets each
                column extend independently. On narrow viewports it keeps the
                original centered block-flow placement. */}
            <div
              className={
                isWide
                  ? 'flex flex-col items-center text-center w-[140px] shrink-0'
                  : 'flex flex-col items-center text-center w-fit mx-auto mt-2'
              }
            >
              <div className="relative outline outline-2 outline-paper/50 w-[115px] sm:w-[140px]">
                {!hasError && waifu.image ? (
                  <img
                    src={waifu.image}
                    alt={waifu.name}
                    onError={() => setHasError(true)}
                    className="w-full aspect-[1/2] object-cover block"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] flex items-center justify-center bg-accent-800 text-paper font-heading font-black text-6xl">
                    {waifu.name?.charAt(0) || '?'}
                  </div>
                )}
                {isWide &&
                  /* Pins cluster in the portrait's upper third (near the
                     head), matching the reference's converging lines,
                     instead of spreading evenly down the full height. */
                  FACTS.map((fact, i) => (
                    <span
                      key={fact.label}
                      ref={getPinRef(i)}
                      style={{ top: `${16 + i * 13}%` }}
                      className="absolute right-[-5px] w-2.5 h-2.5 bg-accent"
                    />
                  ))}
              </div>
              <h2
                id={nameId}
                className="font-heading font-black uppercase text-[clamp(20px,2.6vw,32px)] leading-[.92] text-paper mt-5"
              >
                {waifu.name}
              </h2>
            </div>

            {/* Facts. On wide viewports this is now a top-aligned flex item
                (no more absolute top-0 right-0 overlay — that trick is gone
                since the whole row is top-aligned by the flex wrapper
                itself); on narrow viewports it falls back to a plain stacked
                block below, per the mobile spec. */}
            {isWide ? (
              <div className="flex flex-col gap-6 w-[220px] shrink-0">
                {FACTS.map((fact, i) => (
                  <div key={fact.label} ref={getFactRef(i)}>
                    <div className="h-0.5 w-10 bg-paper mb-1" />
                    <div className="text-[10px] uppercase tracking-[.16em] text-accent-300 mb-0.5">
                      {fact.label}
                    </div>
                    <div className="text-[13px] leading-[1.35] text-paper">{fact.get(waifu)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6 mt-6">
                {FACTS.map((fact) => (
                  <div key={fact.label}>
                    <div className="h-0.5 w-14 bg-paper mb-2.5" />
                    <div className="text-[11px] uppercase tracking-[.16em] text-accent-300 mb-1.5">
                      {fact.label}
                    </div>
                    <div className="text-sm leading-[1.5] text-paper">{fact.get(waifu)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CharacterModal.propTypes = {
  waifu: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    origin: PropTypes.string,
    series: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func,
};

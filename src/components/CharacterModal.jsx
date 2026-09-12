import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useChainPhysics } from '../hooks/useChainPhysics';

// Facts shown per callout, in fixed priority order. `description` stays
// reserved for the bio block; the pin's vertical position is plain CSS
// placement — only the rope itself is real-pixel physics.
const FACT_DEFS = [
  { label: 'Series', get: (w) => w.series },
  { label: 'Medium', get: (w) => w.origin },
  { label: 'Known for', get: (w) => w.tags?.[0] },
];
const PIN_TOPS = ['22%', '50%', '78%'];

function buildFacts(waifu) {
  if (!waifu) return [];
  return FACT_DEFS.map((def) => ({ label: def.label, value: def.get(waifu) }))
    .filter((fact) => typeof fact.value === 'string' && fact.value.trim().length > 0)
    .slice(0, PIN_TOPS.length)
    .map((fact, i) => ({ ...fact, pinTop: PIN_TOPS[i] }));
}

/**
 * Character-detail modal: chromatic-aberration/8-bit "character select"
 * material, portrait + pixel pins + a live Verlet-rope chain to each fact
 * callout. Replaces the old inline enlarged modal that used to live in
 * MainArticle — this one is lifted to App.jsx so it can open from the hero,
 * the thumbnail row, and the archive grid alike.
 */
export const CharacterModal = ({ waifu, onClose = () => {} }) => {
  const [visible, setVisible] = useState(false);
  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const facts = buildFacts(waifu);
  const { stageWrapRef, svgRef, getPinRef, getFactRef, getPathRef } = useChainPhysics(
    !!waifu,
    facts.length
  );

  useEffect(() => {
    if (!waifu) return undefined;
    setReadMoreOpen(false);
    setHasError(false);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [waifu]);

  const closeModal = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 260); // matches the panel's 220ms stepped exit, plus a small buffer
  }, [onClose]);

  useEffect(() => {
    if (!waifu) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [waifu, closeModal]);

  if (!waifu) return null;

  const fadeClass = visible ? 'is-visible' : '';
  const initial = waifu.name?.charAt(0) || '♥';

  return (
    <div className="cs-overlay" onClick={closeModal}>
      <div className={`cs-scrim ${fadeClass}`} />

      {/* Real chromatic aberration: split into R/G/B, offset red and blue in
          opposite directions, screen them back together. Two tunings — a
          wide one for the panel backdrop, a tight one kept for parity with
          the design-canvas source (unused by the rope, which stays a flat
          single-color stroke on purpose — see `.rope-strand` in index.css). */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="chromaticGlitch" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feOffset in="r" dx="6" dy="0" result="rOff" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
          <feOffset in="b" dx="-6" dy="0" result="bOff" />
          <feBlend in="rOff" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="bOff" mode="screen" />
        </filter>
        <filter id="chromaticGlitchLine" x="-80%" y="-80%" width="260%" height="260%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feOffset in="r" dx="2.5" dy="0" result="rOff" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
          <feOffset in="b" dx="-2.5" dy="0" result="bOff" />
          <feBlend in="rOff" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="bOff" mode="screen" />
        </filter>
      </svg>

      <div
        className={`cs-panel ${fadeClass}`}
        role="dialog"
        aria-modal="true"
        aria-label={waifu.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="cs-close" aria-label="Close" onClick={closeModal}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <span className="charselect-handle mono">scarletarchive.app</span>

        <div className="charselect-grid">
          <div className="cs-bio">
            <h3>
              Character
              <br />
              Select
            </h3>
            <p>{waifu.description}</p>
            <p className="tags-line">
              #{waifu.series} · {waifu.origin}
            </p>
            <button type="button" className="cs-readmore" onClick={() => setReadMoreOpen((v) => !v)}>
              {readMoreOpen ? 'Show less' : 'Read more'}
            </button>
            {readMoreOpen && waifu.tags?.length > 0 && (
              <p style={{ marginTop: 14 }}>Tagged: {waifu.tags.join(', ')}</p>
            )}
          </div>

          <div className="cs-stage-wrap" ref={stageWrapRef}>
            <div className="cs-stage">
              <div className="cs-portrait">
                {!hasError && waifu.image ? (
                  <img
                    src={waifu.image}
                    alt={waifu.name}
                    onError={() => setHasError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="card-fallback">
                    <div className="avatar">{initial}</div>
                  </div>
                )}
                <h2 className="cs-name-overlay">{waifu.name}</h2>
                {facts.map((fact, i) => (
                  <span
                    key={fact.label}
                    className="cs-pin"
                    style={{ top: fact.pinTop }}
                    ref={getPinRef(i)}
                  />
                ))}
              </div>
            </div>

            <svg className="cs-rope-svg" ref={svgRef} aria-hidden="true">
              {facts.map((fact, i) => (
                <path key={fact.label} className="rope-strand" ref={getPathRef(i)} />
              ))}
            </svg>

            <div className="cs-callouts">
              {facts.map((fact, i) => (
                <div className="cs-fact" key={fact.label} ref={getFactRef(i)}>
                  <span className="cs-fact-label">{fact.label}</span>
                  <span className="cs-fact-value">{fact.value}</span>
                </div>
              ))}
            </div>
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

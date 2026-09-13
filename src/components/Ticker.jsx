import PropTypes from 'prop-types';

/**
 * Marquee band, generalized so the two instances on the page (see App.jsx)
 * can differ in items, color and speed while sharing the same double-track
 * `translateX(-50%)` technique (`animate-ticker-scroll` in
 * tailwind.config.js). Reduced motion is handled by the standard
 * `motion-reduce:` variant, no JS needed.
 *
 * Both the outer container and each track use `w-max` (natural content
 * width), NOT a `w-[200%]` container split into two `w-1/2` halves. The
 * old placeholder text (10 short identical copies) happened to roughly fit
 * that fixed half-width share, but real waifu names are wider than half
 * the viewport — forcing a track to `w-1/2` regardless of its actual
 * content truncates its box while the overflowing text keeps rendering
 * past it, visually landing on top of the next track's start. With `w-max`
 * on both levels, the outer container is naturally exactly 2x one track's
 * width (two identical tracks placed side by side), so `translateX(-50%)`
 * always shifts by exactly one full track-width and the loop is seamless
 * regardless of how many items or how long the names are.
 *
 * Every item also gets `shrink-0` so flexbox can't compress a span
 * narrower than its own text once the (very wide) track exceeds the
 * viewport — that compression is what caused the original glyph overlap.
 * Spacing is a trailing `mx-10` margin on each item's own separator dot
 * rather than a flex `gap`, so the seam between this track's last item and
 * the identical next track's first item gets the same spacing as any
 * other pair, instead of butting the two names together.
 */
export const Ticker = ({ items, color = 'text-paper/85', duration = 26 }) => (
  <div
    className="relative bg-accent-900 border-y-2 border-paper/25 overflow-hidden py-2.5 whitespace-nowrap"
    aria-hidden="true"
  >
    <div
      className="flex w-max animate-ticker-scroll motion-reduce:animate-none"
      style={{ animationDuration: `${duration}s` }}
    >
      {[0, 1].map((track) => (
        <div
          key={track}
          className={`flex w-max shrink-0 items-center font-heading font-extrabold text-xs uppercase tracking-[.2em] ${color}`}
        >
          {items.map((item, i) => (
            <span key={i} className="flex shrink-0 items-center">
              {item}
              <span className="w-1 h-1 shrink-0 bg-current/60 mx-10" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

Ticker.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  duration: PropTypes.number,
};

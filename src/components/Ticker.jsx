// Identical repeated text, so a translateX(-50%) loop reads as seamless even
// without literally duplicating the list — every copy looks the same.
const TICKER_ITEMS = Array.from({ length: 10 });

/**
 * "Unlocked Waifu Of The Day" marquee band. The scroll animation lives in
 * Tailwind's config (`animate-ticker-scroll`, alongside the app's other
 * keyframe-driven animations); reduced motion is handled by the standard
 * `motion-reduce:` variant, no JS needed.
 */
export const Ticker = () => (
  <div className="relative z-[2] bg-black overflow-hidden py-3.5 whitespace-nowrap" aria-hidden="true">
    <div className="inline-flex animate-ticker-scroll motion-reduce:animate-none">
      {TICKER_ITEMS.map((_, i) => (
        <span
          key={i}
          className="inline-flex items-center shrink-0 px-7 text-[13px] font-bold uppercase tracking-[.1em] text-white font-mono"
        >
          Unlocked Waifu Of The Day
          <span className="ml-7 text-scarlet-500 text-[10px]">✦</span>
        </span>
      ))}
    </div>
  </div>
);

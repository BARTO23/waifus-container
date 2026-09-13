import PropTypes from 'prop-types';

// color-mix() gradient — not expressible as a Tailwind utility, so it's set
// via inline style reading the CSS custom properties defined in index.css.
const heroBg = {
  background:
    'linear-gradient(178deg, var(--color-accent-900) 0%, color-mix(in srgb, var(--color-accent-800) 70%, var(--color-accent-900)) 62%, var(--color-accent-800) 100%)',
};

/**
 * Hero band — "Introducing new character". Kept the original filename
 * (this used to render the literal daily pick's name), but in the
 * "Redhead Waifus" redesign the h1 copy is a static headline, not
 * per-character: the only dataset-derived content here is the stats row
 * (computed live in App.jsx) and "Next for detail", which advances the
 * shared `featuredId` cursor that Character Select reads from. The actual
 * daily pick now only seeds that cursor's initial value (see App.jsx).
 */
export const WaifuOfTheDay = ({ stats, onNext = () => {} }) => (
  <section style={heroBg} className="px-6 pt-12 pb-10 sm:pt-20 sm:pb-16 md:pt-[120px] md:pb-24">
    <div className="max-w-[1180px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-2 h-2 bg-accent-500" />
        <span className="text-xs uppercase tracking-[.34em] text-paper/80">Now live</span>
      </div>

      <h1 className="font-heading font-black uppercase text-[clamp(44px,9vw,116px)] leading-[.88] tracking-[-0.02em] max-w-[15ch] [text-wrap:balance]">
        The world&apos;s finest redhead archive
      </h1>

      <div className="flex gap-3 mt-7 sm:mt-10 flex-wrap">
        <a
          href="#select"
          className="font-heading font-extrabold text-[13px] uppercase tracking-[.12em] px-[22px] py-[14px] bg-accent-900 text-paper border-2 border-accent-900 hover-hover:hover:bg-accent-800 transition-colors"
        >
          Description
        </a>
        <button
          type="button"
          onClick={onNext}
          className="font-heading font-extrabold text-[13px] uppercase tracking-[.12em] px-[22px] py-[14px] bg-transparent text-paper border-2 border-paper/60 cursor-pointer hover-hover:hover:bg-paper/10 transition-colors"
        >
          Next for detail
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6 mt-10 sm:mt-16 md:mt-[88px] pt-6 border-t-2 border-paper/30">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="font-heading font-black text-[30px]">{stat.value}</div>
            <div className="text-[11px] uppercase tracking-[.16em] text-paper/70 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

WaifuOfTheDay.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  onNext: PropTypes.func,
};

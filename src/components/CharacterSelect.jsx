import PropTypes from 'prop-types';

// color-mix() gradient, same reasoning as the hero's — see WaifuOfTheDay.jsx.
const selectBg = {
  background:
    'linear-gradient(180deg, var(--color-accent-800) 0%, color-mix(in srgb, var(--color-accent-800) 45%, var(--color-accent-900)) 100%)',
};

// Fixed priority order, per the extracted reference's `annotations` array.
const FACTS = [
  { label: 'Series', get: (w) => w.series },
  { label: 'Origin', get: (w) => (w.origin || '').toUpperCase() },
  { label: 'Traits', get: (w) => (w.tags || []).join(' · ') },
];

/**
 * "Character select" (point 6): always-rendered inline section, no modal,
 * no chain physics — three columns (bio / portrait / facts). The portrait
 * is deliberately ALWAYS grayscale here regardless of the roster/full
 * catalog's grayscale-except-featured rule — confirmed against the
 * extracted reference (resolved_clean.html lines ~713-720): this is the
 * one intentional exception in the whole page.
 */
export const CharacterSelect = ({ waifu, onNext = () => {} }) => {
  if (!waifu) return null;

  return (
    <section id="select" style={selectBg} className="px-6 py-10 sm:py-14 md:py-20">
      <div className="max-w-[1180px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 sm:gap-10 md:gap-14 items-start">
        <div>
          <h2 className="font-heading font-black uppercase text-[clamp(30px,4.4vw,52px)] leading-[.92]">
            Character select
          </h2>
          <div className="h-0.5 bg-paper/40 my-6" />
          <p className="text-[15px] leading-[1.55] text-paper/90 max-w-[34ch]">{waifu.description}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {(waifu.tags || []).map((tag) => (
              <span
                key={tag}
                className="text-[11px] uppercase tracking-[.12em] px-2.5 py-1.5 border-2 border-paper/45 text-paper"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={onNext}
            className="mt-8 block font-heading font-extrabold text-xs uppercase tracking-[.12em] px-5 py-[13px] bg-accent text-white border-2 border-accent text-left cursor-pointer hover-hover:hover:bg-accent-600 transition-colors"
          >
            Next character
          </button>
        </div>

        <div className="self-stretch flex flex-col justify-end">
          <div className="outline outline-2 outline-paper/50 grayscale">
            <img src={waifu.image} alt={waifu.name} className="w-full aspect-[3/4] object-cover block" />
          </div>
          <div className="font-heading font-black uppercase text-[clamp(24px,3.4vw,40px)] leading-none mt-4">
            {waifu.name}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <div className="h-0.5 w-14 bg-paper mb-2.5" />
              <div className="text-[11px] uppercase tracking-[.16em] text-accent-300 mb-1.5">{fact.label}</div>
              <div className="text-sm leading-[1.5] text-paper">{fact.get(waifu)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

CharacterSelect.propTypes = {
  waifu: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    origin: PropTypes.string,
    series: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  onNext: PropTypes.func,
};

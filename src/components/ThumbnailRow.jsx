import PropTypes from 'prop-types';

// color-mix() gradient, same reasoning as the hero's — see WaifuOfTheDay.jsx.
const rosterBg = {
  background:
    'linear-gradient(180deg, var(--color-accent-900) 0%, color-mix(in srgb, var(--color-accent-800) 55%, var(--color-accent-900)) 100%)',
};

/**
 * A single roster card. Active (featured) = full color, lifted, accent
 * outline; inactive = grayscale, translucent maroon fill, dim outline.
 * Selecting only moves the shared featured cursor — it does not scroll.
 */
const RosterCard = ({ waifu, isActive, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(waifu)}
    aria-pressed={isActive}
    aria-label={`Feature ${waifu.name}`}
    className={`block w-full text-left p-0 border-0 cursor-pointer transition-[transform,filter] duration-[180ms] ${
      isActive
        ? 'bg-accent outline outline-2 outline-accent grayscale-0 -translate-y-2.5'
        : 'bg-accent-900/[0.78] outline outline-2 outline-paper/30 grayscale'
    }`}
  >
    <img src={waifu.image} alt={waifu.name} loading="lazy" className="w-full aspect-[3/4] object-cover block" />
    <span className="block text-left p-2.5 font-heading font-extrabold text-[11px] uppercase tracking-[.1em] text-paper">
      {waifu.name}
    </span>
  </button>
);

RosterCard.propTypes = {
  waifu: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

/**
 * "Character to play" roster section (point 4 of the redesign spec). Shows
 * the first 7 dataset entries; clicking one sets it as the shared featured
 * character (Character Select updates in place) without scrolling.
 */
export const ThumbnailRow = ({ waifus = [], activeId = null, onSelect = () => {} }) => {
  if (waifus.length === 0) return null;

  return (
    <section id="roster" style={rosterBg} className="px-6 py-10 sm:py-14 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex items-baseline justify-between gap-4 flex-wrap pb-4 border-b-2 border-paper/30">
          <h2 className="font-heading font-black uppercase text-[clamp(26px,4vw,44px)] tracking-[-0.01em]">
            Character to play
          </h2>
          <span className="text-xs uppercase tracking-[.16em] text-paper/70">Click to select</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 mt-8">
          {waifus.map((waifu) => (
            <RosterCard key={waifu.id} waifu={waifu} isActive={waifu.id === activeId} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
};

ThumbnailRow.propTypes = {
  waifus: PropTypes.arrayOf(PropTypes.object),
  activeId: PropTypes.string,
  onSelect: PropTypes.func,
};

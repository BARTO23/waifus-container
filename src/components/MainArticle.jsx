import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { WaifuCard } from './WaifuCard';

// No "Manhua" button — the dataset currently has zero manhua entries, and
// the extracted reference deliberately omits it too (counted, not filtered).
const FILTERS = ['all', 'manga', 'manhwa'];

/**
 * "Full catalog" section (point 7). Every filtered entry, grayscale unless
 * it's the featured id; the 2px grid gap over a translucent background
 * reads as thin hairlines between cards — no per-card border on top of it.
 *
 * Deliberate deviation from the literal reference: this used to own an
 * async paginated fetch (fetchWaifus) with infinite scroll and a search
 * box. The new design has neither, and the dataset is a small local JSON
 * file (32 entries), so this now takes the full list as a prop and filters
 * it client-side — the async/loading/error machinery was dead weight for
 * a curated static catalog that always renders in full.
 */
export const MainArticle = ({
  waifus = [],
  activeFilter = 'all',
  onFilterChange = () => {},
  counts = { all: 0, manga: 0, manhwa: 0 },
  featuredId = null,
  onSelect = () => {},
}) => {
  const shown = useMemo(
    () => (activeFilter === 'all' ? waifus : waifus.filter((w) => w.origin === activeFilter)),
    [waifus, activeFilter]
  );

  return (
    <section id="gallery" className="bg-accent-900 px-6 py-10 sm:py-14 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex items-end justify-between gap-4 flex-wrap pb-4 border-b-2 border-paper/30">
          <h2 className="font-heading font-black uppercase text-[clamp(26px,4vw,44px)]">Full catalog</h2>
          <div className="flex">
            {FILTERS.map((key) => {
              const isActive = activeFilter === key;
              const label = key === 'all' ? `All ${counts.all}` : `${key[0].toUpperCase()}${key.slice(1)} ${counts[key]}`;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onFilterChange(key)}
                  aria-pressed={isActive}
                  className={`-ml-0.5 font-heading font-extrabold text-[11px] uppercase tracking-[.12em] px-4 py-2.5 border-2 border-paper/50 cursor-pointer transition-colors ${
                    isActive ? 'bg-paper text-accent-900' : 'bg-transparent text-paper'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[2px] bg-paper/20 mt-8">
          {shown.map((waifu) => (
            <WaifuCard
              key={waifu.id}
              name={waifu.name}
              image={waifu.image}
              series={waifu.series}
              isFeatured={waifu.id === featuredId}
              onSelect={() => onSelect(waifu.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

MainArticle.propTypes = {
  waifus: PropTypes.arrayOf(PropTypes.object),
  activeFilter: PropTypes.string,
  onFilterChange: PropTypes.func,
  counts: PropTypes.shape({
    all: PropTypes.number,
    manga: PropTypes.number,
    manhwa: PropTypes.number,
  }),
  featuredId: PropTypes.string,
  onSelect: PropTypes.func,
};

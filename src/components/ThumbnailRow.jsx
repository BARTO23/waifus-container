import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

/**
 * A single thumbnail. Same real-image + onError-monogram-fallback pattern as
 * `WaifuCard`, just sized down for the horizontal discovery row.
 */
const Thumb = ({ waifu, isActive, onSelect }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [waifu.image]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(waifu);
    }
  };

  return (
    <div className="shrink-0 w-[120px] sm:w-[140px]">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(waifu)}
        onKeyDown={handleKeyDown}
        aria-label={`View ${waifu.name}`}
        className={`relative w-full aspect-[3/4] rounded-[10px] overflow-hidden cursor-pointer border transition-[border-color,transform] duration-150 active:scale-95 active:ease-out-strong motion-reduce:active:scale-100 ${
          isActive
            ? 'border-scarlet-500 shadow-[0_0_0_1px_theme(colors.scarlet.500)]'
            : 'border-zinc-800/80 hover-hover:hover:border-scarlet-500/60 hover-hover:hover:-translate-y-0.5'
        }`}
      >
        {!hasError && waifu.image ? (
          <img
            src={waifu.image}
            alt={waifu.name}
            loading="lazy"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-dark-900 via-dark-950 to-black">
            <div className="w-10 h-10 rounded-full bg-scarlet-950/60 border border-scarlet-800/50 flex items-center justify-center text-[15px] text-scarlet-400 font-mono font-bold">
              {waifu.name?.charAt(0) || '♥'}
            </div>
          </div>
        )}
      </div>
      <span className="block text-center text-[10px] text-zinc-400 mt-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
        {waifu.name}
      </span>
    </div>
  );
};

Thumb.propTypes = {
  waifu: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

/**
 * "Waifus To Discover" horizontal scroll row. Selecting a thumbnail both
 * moves the hero's featured cursor and opens the character-detail modal.
 */
export const ThumbnailRow = ({ waifus = [], activeId = null, onSelect = () => {} }) => {
  if (waifus.length === 0) return null;

  return (
    <section className="relative z-[2] px-6 pt-14 pb-2 text-center" aria-label="Waifus to discover">
      <h2 className="text-[28px] font-bold text-white mb-7 font-heading">Waifus To Discover</h2>
      <div className="flex gap-3.5 overflow-x-auto [scrollbar-width:thin] px-6 pb-5 max-w-[1200px] mx-auto">
        {waifus.map((waifu) => (
          <Thumb key={waifu.id} waifu={waifu} isActive={waifu.id === activeId} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
};

ThumbnailRow.propTypes = {
  waifus: PropTypes.arrayOf(PropTypes.object),
  activeId: PropTypes.string,
  onSelect: PropTypes.func,
};

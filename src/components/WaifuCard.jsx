import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { ImageSquare, Heart } from '@phosphor-icons/react';

const originBadges = {
  manga: {
    label: 'MANGA',
    classes: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/50',
    dot: 'bg-indigo-400',
  },
  manhwa: {
    label: 'MANHWA',
    classes: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
    dot: 'bg-emerald-400',
  },
  manhua: {
    label: 'MANHUA',
    classes: 'bg-amber-950/60 text-amber-300 border-amber-800/50',
    dot: 'bg-amber-400',
  },
};

export const WaifuCard = ({
  name,
  image,
  description = '',
  origin = '',
  series = '',
  tags = [],
  onSelect = null,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [image]);

  const originKey = (origin || '').toLowerCase();
  const badge = originBadges[originKey] || {
    label: (origin || 'ANIME').toUpperCase(),
    classes: 'bg-zinc-900/80 text-zinc-300 border-zinc-700/50',
    dot: 'bg-scarlet-500',
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${name}`}
      className="group relative min-w-0 bg-dark-900 rounded-xl border border-zinc-800/80 hover-hover:hover:border-scarlet-500/50 transition duration-300 active:duration-100 active:scale-[0.97] active:ease-out-strong motion-reduce:active:scale-100 hover-hover:hover:shadow-card-hover flex flex-col overflow-hidden cursor-pointer will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-scarlet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
    >
      {/* Media container with 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] w-full min-w-0 overflow-hidden bg-dark-950">
        {/* Shimmer skeleton while loading */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-zinc-800 via-zinc-700/60 to-zinc-800 animate-pulse">
            <ImageSquare className="w-6 h-6 text-zinc-600" weight="regular" aria-hidden="true" />
          </div>
        )}

        {!hasError ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out hover-hover:group-hover:scale-[1.03] motion-reduce:!scale-100 will-change-transform ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-dark-900 via-dark-950 to-black p-4 text-center">
            <div className="w-14 h-14 rounded-full bg-scarlet-950/60 border border-scarlet-800/50 flex items-center justify-center text-xl text-scarlet-400 mb-2 font-mono font-bold">
              {name.charAt(0) || '♥'}
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              {origin || 'Red Waifu'}
            </span>
          </div>
        )}

        {/* Dark gradient overlay for text readability over character art */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/90 to-transparent pointer-events-none opacity-95 hover-hover:group-hover:opacity-100 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span
            className={`glass-surface glass-surface--blur-md inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold tracking-wider border ${badge.classes}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {badge.label}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked((prev) => !prev);
            }}
            className={`glass-surface glass-surface--blur-md pointer-events-auto w-7 h-7 rounded-lg flex items-center justify-center border transition duration-200 active:duration-100 active:scale-95 active:ease-out-strong motion-reduce:active:scale-100 ${
              isLiked
                ? 'bg-scarlet-600/90 border-scarlet-500 text-white shadow-scarlet-glow'
                : 'bg-dark-950/60 border-zinc-800/80 text-zinc-400 hover-hover:hover:text-white hover-hover:hover:border-zinc-700'
            }`}
            aria-label="Save character"
          >
            <Heart
              className={`w-3.5 h-3.5 motion-reduce:!animate-none ${isLiked ? 'animate-heart-pop' : ''}`}
              weight={isLiked ? 'fill' : 'regular'}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Bottom Metadata in Image Area */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5 pointer-events-none z-10">
          <h3 className="text-sm font-semibold text-white tracking-tight leading-snug hover-hover:group-hover:text-scarlet-300 transition-colors truncate">
            {name}
          </h3>

          {series && (
            <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5 flex items-center gap-1">
              <span className="text-scarlet-500 font-bold">•</span>
              {series}
            </p>
          )}

          {description && (
            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed opacity-80 hover-hover:group-hover:opacity-100 transition-opacity">
              {description}
            </p>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900/90 text-zinc-400 border border-zinc-800/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

WaifuCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string,
  origin: PropTypes.string,
  series: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
};
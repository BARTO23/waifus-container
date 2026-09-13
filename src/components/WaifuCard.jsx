import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

/**
 * Full-catalog tile (point 7 of the redesign spec). Flat and hard-edged:
 * grayscale unless this is the featured id, in which case it goes full
 * color plus an inset accent outline. No badges, no like button, no
 * hover-scale — the new design is flat/high-contrast, not a glassy
 * floating card. The onError fallback (flat initial-letter tile) is a
 * small deliberate addition beyond the literal reference, since these
 * images load from a remote CDN and can 404.
 */
export const WaifuCard = ({ name, image, series = '', isFeatured = false, onSelect = () => {} }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [image]);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`View ${name}`}
      className={`relative block w-full text-left p-0 border-0 cursor-pointer bg-accent-900 transition-[filter,transform] duration-[180ms] hover-hover:hover:scale-[1.03] hover-hover:hover:z-10 hover-hover:hover:outline hover-hover:hover:outline-2 hover-hover:hover:outline-accent hover-hover:hover:-outline-offset-2 ${
        isFeatured
          ? 'grayscale-0 outline outline-2 outline-accent -outline-offset-2'
          : 'grayscale hover-hover:hover:grayscale-0'
      }`}
    >
      {!hasError && image ? (
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={() => setHasError(true)}
          className="w-full aspect-[4/5] object-cover block"
        />
      ) : (
        <div className="w-full aspect-[4/5] flex items-center justify-center bg-accent-800 text-paper font-heading font-black text-2xl">
          {name?.charAt(0) || '?'}
        </div>
      )}
      <span className="block p-3 text-left">
        <span className="block font-heading font-extrabold text-sm uppercase text-paper leading-[1.1]">{name}</span>
        {series && <span className="block text-xs text-paper/70 mt-1">{series}</span>}
      </span>
    </button>
  );
};

WaifuCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  series: PropTypes.string,
  isFeatured: PropTypes.bool,
  onSelect: PropTypes.func,
};

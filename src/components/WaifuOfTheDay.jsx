import PropTypes from 'prop-types';

/**
 * Hero band for the showcase zone — ported from the design-canvas prototype:
 * eyebrow, big display name, and two actions. "Description" opens the
 * character-detail modal for whichever character is currently featured;
 * "Next for detail →" is a purely client-side cursor (see App.jsx
 * `featuredId`) that never touches the deterministic daily pick itself.
 */
export const WaifuOfTheDay = ({ waifu, onOpenDetail = () => {}, onNext = () => {} }) => {
  if (!waifu) return null;

  return (
    <section className="relative z-[2] text-center px-6 pt-14 pb-[72px] max-w-[900px] mx-auto" aria-label="Waifu del Día">
      <p className="text-[11px] font-bold uppercase tracking-[.35em] text-scarlet-400 mb-[18px] font-mono">
        ✦ Waifu Del Día ✦
      </p>
      <h1 className="text-display text-white text-[42px] sm:text-[56px] md:text-[64px]">{waifu.name}</h1>
      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          type="button"
          onClick={onOpenDetail}
          className="px-[26px] py-3 rounded-full bg-black text-white text-[13px] font-bold hover-hover:hover:bg-zinc-900 transition-colors active:scale-95 active:ease-out-strong motion-reduce:active:scale-100"
        >
          Description
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-[26px] py-3 rounded-full bg-black text-white text-[13px] font-bold hover-hover:hover:bg-zinc-900 transition-colors active:scale-95 active:ease-out-strong motion-reduce:active:scale-100"
        >
          Next for detail →
        </button>
      </div>
    </section>
  );
};

WaifuOfTheDay.propTypes = {
  waifu: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onOpenDetail: PropTypes.func,
  onNext: PropTypes.func,
};

import PropTypes from 'prop-types';

const NAV_LINKS = [
  { label: 'Catalog', href: '#gallery' },
  { label: 'Character', href: '#select' },
  { label: 'Roster', href: '#roster' },
];

// This app's own real deployed URL (also used by the footer band) — matches
// what the extracted design reference itself already pointed "For more
// info" at, since it happens to be this exact app.
const DEPLOY_URL = 'https://waifus-container.vercel.app/';

/**
 * Top nav for the "Redhead Waifus" poster/editorial redesign: wordmark +
 * three in-page anchors, Shuffle (random pick) and a "For more info" link
 * out to the app's own deployment. Flat, sharp-edged, no glass/blur.
 */
export const TopNav = ({ onShuffle = () => {} }) => (
  <nav className="relative z-10 flex items-center justify-between gap-6 flex-wrap px-6 py-4 bg-accent-900 border-b-2 border-paper/25">
    <div className="flex items-baseline gap-8 flex-wrap">
      <span className="font-heading font-black text-[15px] uppercase tracking-[.16em]">
        Redhead<span className="text-accent-500">/</span>Waifus
      </span>
      {NAV_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-[13px] uppercase tracking-[.1em] text-paper/70 hover-hover:hover:text-paper transition-colors"
        >
          {link.label}
        </a>
      ))}
    </div>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onShuffle}
        className="font-heading font-bold text-xs uppercase tracking-[.1em] px-4 py-2.5 bg-transparent text-paper border-2 border-paper/50 cursor-pointer hover-hover:hover:border-paper transition-colors active:scale-95 active:ease-out-strong motion-reduce:active:scale-100"
      >
        Shuffle
      </button>
      <a
        href={DEPLOY_URL}
        target="_blank"
        rel="noreferrer"
        className="font-heading font-bold text-xs uppercase tracking-[.1em] px-4 py-2.5 bg-accent text-white border-2 border-accent hover-hover:hover:bg-accent-600 transition-colors"
      >
        For more info
      </a>
    </div>
  </nav>
);

TopNav.propTypes = {
  onShuffle: PropTypes.func,
};

const NAV_LINKS = ['Home', 'Archive', 'Favorites', 'About'];

/**
 * Top nav for the showcase zone (replaces the old sidebar). The four links
 * are placeholders, same as in the design-canvas prototype — only the two
 * actions actually do something, scrolling down to the archive grid.
 */
export const TopNav = () => {
  const scrollToArchive = () => {
    document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="relative z-[5] flex items-center justify-between max-w-[1440px] mx-auto px-6 sm:px-10 py-5">
      <div className="hidden sm:flex items-center gap-8">
        {NAV_LINKS.map((label) => (
          <a
            key={label}
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-[13px] font-semibold text-zinc-200 hover-hover:hover:text-white transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
        <button
          type="button"
          onClick={scrollToArchive}
          className="px-5 py-2 rounded-full border border-zinc-400/40 bg-transparent text-white text-[12px] font-bold uppercase tracking-wide hover-hover:hover:border-white transition-colors active:scale-95 active:ease-out-strong motion-reduce:active:scale-100"
        >
          Search
        </button>
        <button
          type="button"
          onClick={scrollToArchive}
          className="px-5 py-2 rounded-full bg-black text-white text-[12px] font-bold uppercase tracking-wide hover-hover:hover:bg-zinc-900 transition-colors active:scale-95 active:ease-out-strong motion-reduce:active:scale-100"
        >
          Full Archive
        </button>
      </div>
    </nav>
  );
};

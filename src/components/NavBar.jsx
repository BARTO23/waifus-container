import PropTypes from 'prop-types';
import { SquaresFour, BookOpen, Sparkle, Fire } from '@phosphor-icons/react';

export const NavBar = ({
  activeFilter = 'all',
  counts = { all: 0, manga: 0, manhwa: 0, manhua: 0 },
}) => {
  const categories = [
    {
      id: 'all',
      name: 'All Waifus',
      count: counts.all,
      icon: <SquaresFour className="w-4 h-4" weight="regular" aria-hidden="true" />,
    },
    {
      id: 'manga',
      name: 'Manga (JP)',
      count: counts.manga,
      icon: <BookOpen className="w-4 h-4" weight="regular" aria-hidden="true" />,
    },
    {
      id: 'manhwa',
      name: 'Manhwa (KR)',
      count: counts.manhwa,
      icon: <Sparkle className="w-4 h-4" weight="regular" aria-hidden="true" />,
    },
    {
      id: 'manhua',
      name: 'Manhua (CN)',
      count: counts.manhua,
      icon: <Fire className="w-4 h-4" weight="regular" aria-hidden="true" />,
    },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 shrink-0 hidden md:flex flex-col glass-surface glass-surface--blur-2xl glass-surface--grain bg-dark-950/80 border-r border-zinc-800/80 text-zinc-300 p-4 select-none z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-3 mb-6 border-b border-zinc-800/80">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-scarlet-500 to-scarlet-700 flex items-center justify-center text-white">
          <span className="text-sm font-bold tracking-tighter font-mono">RW</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white tracking-tight leading-none">
            Scarlet Archive
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {counts.all} characters curated
          </p>
        </div>
      </div>

      {/* Navigation section — read-only: the sticky segmented bar next to
          search owns filter selection; this panel only reflects it. */}
      <div className="mb-6">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
            Medium Origins
          </span>
        </div>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isActive = activeFilter === cat.id;
            const isEmpty = cat.id !== 'all' && cat.count === 0;
            return (
              <div
                key={cat.id}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive ? 'text-white' : isEmpty ? 'text-zinc-500' : 'text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-scarlet-500' : isEmpty ? 'text-zinc-600' : 'text-zinc-400'}>
                    {cat.icon}
                  </span>
                  <span>{cat.name}</span>
                </div>
                {isEmpty ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-500 border border-zinc-800/80">
                    Soon
                  </span>
                ) : (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                      isActive
                        ? 'bg-scarlet-950/80 text-scarlet-400 border-scarlet-900/50'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800/80'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-zinc-800/80 text-xs text-zinc-500">
        Fan-curated archive
      </div>
    </aside>
  );
};

NavBar.propTypes = {
  activeFilter: PropTypes.string,
  counts: PropTypes.shape({
    all: PropTypes.number,
    manga: PropTypes.number,
    manhwa: PropTypes.number,
    manhua: PropTypes.number,
  }),
};

import PropTypes from 'prop-types';

export const NavBar = ({
  activeFilter = 'all',
  onSelectFilter = () => {},
  totalCount = 32,
}) => {
  const categories = [
    {
      id: 'all',
      name: 'All Waifus',
      count: totalCount,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      ),
    },
    {
      id: 'manga',
      name: 'Manga (JP)',
      count: 26,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      ),
    },
    {
      id: 'manhwa',
      name: 'Manhwa (KR)',
      count: 6,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      ),
    },
    {
      id: 'manhua',
      name: 'Manhua (CN)',
      count: 0,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 shrink-0 hidden md:flex flex-col glass-surface glass-surface--blur-2xl glass-surface--grain bg-dark-950/80 border-r border-zinc-800/80 text-zinc-300 p-4 select-none z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-3 mb-6 border-b border-zinc-800/80">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-scarlet-500 to-scarlet-700 flex items-center justify-center text-white shadow-scarlet-glow">
          <span className="text-sm font-bold tracking-tighter font-mono">RW</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white tracking-tight leading-none">
            Scarlet Archive
          </h1>
          <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mt-1">
            v2.0 • 32 Curated
          </p>
        </div>
      </div>

      {/* Navigation section */}
      <div className="mb-6">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
            Medium Origins
          </span>
        </div>
        <nav className="space-y-1">
          {categories.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectFilter(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-zinc-800/90 text-white shadow-sm border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-scarlet-500' : 'text-zinc-500 group-hover:text-scarlet-400'
                    }`}
                  >
                    {cat.icon}
                  </span>
                  <span>{cat.name}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-scarlet-950/80 text-scarlet-400 border border-scarlet-900/50'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800/80'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Specs / Distribution Card */}
      <div className="mt-2 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/70">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2 font-medium">
          Distribution
        </span>
        <div className="space-y-2 text-[11px]">
          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Manga</span>
              <span className="font-mono text-zinc-500">81.3%</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-scarlet-600 rounded-full" style={{ width: '81.3%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Manhwa</span>
              <span className="font-mono text-zinc-500">18.8%</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '18.8%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Manhua</span>
              <span className="font-mono text-zinc-500">0.0%</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '0.0%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <div className="mt-auto pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-scarlet-500 animate-pulse-subtle" />
          <span className="font-mono text-[10px] text-zinc-400">API Connected</span>
        </div>
        <span className="font-mono text-[10px] text-zinc-600">REST // 200</span>
      </div>
    </aside>
  );
};

NavBar.propTypes = {
  activeFilter: PropTypes.string,
  onSelectFilter: PropTypes.func,
  totalCount: PropTypes.number,
};


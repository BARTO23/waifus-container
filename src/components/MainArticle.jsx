import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWaifus } from '../services/waifuApi';
import { WaifuCard } from './WaifuCard';

const FILTERS = [
  { id: 'all', label: 'All', count: 32 },
  { id: 'manga', label: 'Manga', count: 26 },
  { id: 'manhwa', label: 'Manhwa', count: 6 },
  { id: 'manhua', label: 'Manhua', count: 0 },
];

export const MainArticle = ({
  activeFilter = 'all',
  onFilterChange = () => {},
}) => {
  const [waifus, setWaifus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWaifu, setSelectedWaifu] = useState(null);
  const loaderRef = useRef(null);
  const PAGE_LIMIT = 24;

  const loadInitial = useCallback(async (filter, search) => {
    setLoading(true);
    setPage(1);
    try {
      const res = await fetchWaifus({
        page: 1,
        limit: PAGE_LIMIT,
        origin: filter === 'all' ? '' : filter,
        search: search.trim(),
      });
      setWaifus(res.items || []);
      setHasMore(!!res.hasNextPage);
    } catch (error) {
      console.error('Error loading waifus:', error);
      setWaifus([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [PAGE_LIMIT]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetchWaifus({
        page: nextPage,
        limit: PAGE_LIMIT,
        origin: activeFilter === 'all' ? '' : activeFilter,
        search: searchQuery.trim(),
      });
      setWaifus((prev) => [...prev, ...(res.items || [])]);
      setPage(nextPage);
      setHasMore(!!res.hasNextPage);
    } catch (error) {
      console.error('Error loading more waifus:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, loading, page, activeFilter, searchQuery, PAGE_LIMIT]);

  // Debounced search / filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      loadInitial(activeFilter, searchQuery);
    }, 200);

    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery, loadInitial]);

  // Infinite scroll
  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '150px' }
    );

    observer.observe(currentLoader);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadMore]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedWaifu(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="relative flex-1 w-full min-h-screen px-4 sm:px-8 py-8 flex flex-col max-w-[1600px] mx-auto">
      {/* Top subtle scarlet radial gradient aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-scarlet-600/10 blur-[130px] pointer-events-none rounded-full -z-10" />

      {/* Header Section */}
      <header className="flex flex-col items-start mb-8 pt-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-scarlet-950/40 border border-scarlet-900/50 text-[11px] font-mono text-scarlet-400 mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-scarlet-500 animate-pulse" />
          <span>DATABASE // 32 REDHEAD ENTRIES</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
          Redhead <span className="text-scarlet-500">Archive</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
          High-density directory of red-haired characters curated across Japanese manga, Korean manhwa, and Chinese manhua.
        </p>
      </header>

      {/* Control Bar: Filters + Search */}
      <div className="sticky top-4 z-20 glass-surface glass-surface--grain bg-dark-900/80 border border-zinc-800/80 rounded-2xl p-2.5 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-0.5 bg-dark-950/70 rounded-xl border border-zinc-800/60">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive
                      ? 'bg-scarlet-950 text-scarlet-400 border border-scarlet-900/40'
                      : 'text-zinc-500'
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or series..."
            className="w-full pl-9 pr-8 py-1.5 bg-dark-950/70 border border-zinc-800/70 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-scarlet-500/60 focus:ring-1 focus:ring-scarlet-500/40 transition-all font-mono"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-zinc-300"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-xl bg-dark-900 border border-zinc-800/70 overflow-hidden relative animate-pulse"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-zinc-900/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 space-y-2">
                <div className="h-4 w-3/4 bg-zinc-800 rounded" />
                <div className="h-3 w-1/2 bg-zinc-800/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {waifus.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4 shadow-inner">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">No waifus found</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                No character matching &ldquo;{searchQuery}&rdquo; in this category. Try resetting your query or medium filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onFilterChange('all');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors border border-zinc-700/60"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
              {waifus.map((waifu, index) => (
                <WaifuCard
                  key={`${waifu.id}-${index}`}
                  name={waifu.name}
                  image={waifu.image}
                  description={waifu.description}
                  origin={waifu.origin}
                  series={waifu.series}
                  tags={waifu.tags}
                  onSelect={() => setSelectedWaifu(waifu)}
                />
              ))}
            </div>
          )}

          {/* Infinite Scroll Sentinel */}
          {hasMore && (
            <div ref={loaderRef} className="flex justify-center items-center py-12">
              {loadingMore && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
                  <div className="w-3.5 h-3.5 border-2 border-scarlet-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading additional records...</span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Linear-style Inspection Modal */}
      {selectedWaifu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedWaifu(null)}
        >
          {/* Scrim: sibling of the panel, carries the fade, no backdrop-filter */}
          <div className="absolute inset-0 bg-black/60 animate-fade-in" />

          <div
            className="glass-surface glass-surface--grain glass-surface--rim glass-surface--elevated relative z-10 w-full max-w-2xl border border-zinc-800/60 rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative md:w-1/2 aspect-[3/4] md:aspect-auto bg-dark-950">
              <img
                src={selectedWaifu.image}
                alt={selectedWaifu.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent to-dark-900/60 pointer-events-none" />
            </div>

            {/* Modal Info */}
            <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-scarlet-950/60 text-scarlet-400 border border-scarlet-800/50 font-bold">
                    {selectedWaifu.origin}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedWaifu(null)}
                    className="w-7 h-7 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <h2 className="text-xl font-bold text-white tracking-tight font-heading">
                  {selectedWaifu.name}
                </h2>
                <p className="text-xs font-mono text-scarlet-400 mt-1 mb-4">
                  {selectedWaifu.series}
                </p>

                <div className="border-t border-zinc-800/80 pt-3 mb-4">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block mb-1">
                    Synopsis
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {selectedWaifu.description}
                  </p>
                </div>

                {selectedWaifu.tags && selectedWaifu.tags.length > 0 && (
                  <div className="border-t border-zinc-800/80 pt-3">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block mb-2">
                      Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedWaifu.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>ID: {selectedWaifu.id}</span>
                <span className="text-zinc-600">Press ESC to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

MainArticle.propTypes = {
  activeFilter: PropTypes.string,
  onFilterChange: PropTypes.func,
};
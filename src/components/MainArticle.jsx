import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MagnifyingGlass, X, Warning, Fire } from '@phosphor-icons/react';
import { fetchWaifus } from '../services/waifuApi';
import { WaifuCard } from './WaifuCard';

export const MainArticle = ({
  activeFilter = 'all',
  onFilterChange = () => {},
  counts = { all: 0, manga: 0, manhwa: 0, manhua: 0 },
  onSelectWaifu = () => {},
}) => {
  const [waifus, setWaifus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const loaderRef = useRef(null);
  // Tracks whether the grid has ever rendered real content, so the small
  // first-load stagger never replays on a later filter/search swap.
  const hasLoadedOnceRef = useRef(false);
  const PAGE_LIMIT = 24;

  const FILTERS = useMemo(
    () => [
      { id: 'all', label: 'All', count: counts.all },
      { id: 'manga', label: 'Manga', count: counts.manga },
      { id: 'manhwa', label: 'Manhwa', count: counts.manhwa },
      { id: 'manhua', label: 'Manhua', count: counts.manhua },
    ],
    [counts]
  );

  const loadInitial = useCallback(async (filter, search) => {
    setLoading(true);
    setError(null);
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
    } catch (err) {
      console.error('Error loading waifus:', err);
      setWaifus([]);
      setHasMore(false);
      setError("Couldn't load characters right now.");
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

  useEffect(() => {
    if (!loading && !error && waifus.length > 0) {
      hasLoadedOnceRef.current = true;
    }
  }, [loading, error, waifus]);

  const isFirstLoad = !hasLoadedOnceRef.current;
  const contentKey = loading
    ? 'loading'
    : error
    ? 'error'
    : waifus.length === 0
    ? (activeFilter === 'manhua' ? 'manhua-empty' : 'search-empty')
    : 'grid';

  return (
    <main id="archive" className="relative w-full px-4 sm:px-8 py-16 flex flex-col max-w-[1600px] mx-auto">
      {/* Top subtle scarlet radial gradient aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-scarlet-600/10 blur-[130px] pointer-events-none rounded-full -z-10" />

      {/* Header Section */}
      <header className="flex flex-col items-start mb-8 pt-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white font-heading">
          Redhead <span className="text-scarlet-500">Archive</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-xl leading-relaxed">
          A hand-picked collection of {counts.all} red-haired characters from Japanese manga, Korean manhwa, and Chinese manhua.
        </p>
      </header>

      {/* Control Bar: Filters + Search */}
      <div className="sticky top-4 z-20 glass-surface glass-surface--grain bg-dark-900/80 border border-zinc-800/80 rounded-2xl p-2.5 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-0.5 bg-dark-950/70 rounded-xl border border-zinc-800/60">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            const isEmpty = filter.id !== 'all' && filter.count === 0;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                aria-pressed={isActive}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition duration-200 active:duration-100 active:scale-95 active:ease-out-strong motion-reduce:transition-none shrink-0 ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                    : isEmpty
                    ? 'text-zinc-500 hover-hover:hover:text-zinc-300 hover-hover:hover:bg-zinc-900/40'
                    : 'text-zinc-400 hover-hover:hover:text-zinc-200 hover-hover:hover:bg-zinc-900/50'
                }`}
              >
                <span>{filter.label}</span>
                {isEmpty ? (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded text-zinc-500">
                    Soon
                  </span>
                ) : (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-scarlet-950 text-scarlet-400 border border-scarlet-900/40'
                        : 'text-zinc-400'
                    }`}
                  >
                    {filter.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <MagnifyingGlass className="w-4 h-4" weight="regular" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or series…"
            className="w-full pl-9 pr-8 py-1.5 bg-dark-950/70 border border-zinc-800/70 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-scarlet-500/60 focus:ring-1 focus:ring-scarlet-500/40 transition font-mono"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover-hover:hover:text-zinc-300 transition active:scale-95 active:ease-out-strong motion-reduce:transition-none"
            >
              <X className="w-3.5 h-3.5" weight="bold" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Grid Content — keyed on the current state so it fades in fresh on every swap
          (loading/error/empty/grid), instead of teleporting between them. */}
      <div key={contentKey} className="animate-content-fade motion-reduce:animate-none">
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
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-zinc-800 flex items-center justify-center text-scarlet-400 mb-4 shadow-inner">
            <Warning className="w-6 h-6" weight="regular" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-white">{error}</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            Something went wrong while fetching the catalog. Check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => loadInitial(activeFilter, searchQuery)}
            className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 hover-hover:hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition active:scale-95 active:ease-out-strong motion-reduce:transition-none border border-zinc-700/60"
          >
            Retry
          </button>
        </div>
      ) : (
          waifus.length === 0 ? (
            activeFilter === 'manhua' ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
                  <Fire className="w-6 h-6" weight="regular" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-white">Manhua characters are coming soon</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                  We haven&rsquo;t curated any manhua characters yet. Check back soon, or browse manga and manhwa in the meantime.
                </p>
                <button
                  type="button"
                  onClick={() => onFilterChange('all')}
                  className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 hover-hover:hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition active:scale-95 active:ease-out-strong motion-reduce:transition-none border border-zinc-700/60"
                >
                  Browse all characters
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
                  <MagnifyingGlass className="w-6 h-6" weight="regular" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-white">No waifus found</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                  No character matching &ldquo;{searchQuery}&rdquo; in this category. Try resetting your query or medium filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    onFilterChange('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 hover-hover:hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition active:scale-95 active:ease-out-strong motion-reduce:transition-none border border-zinc-700/60"
                >
                  Clear all filters
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
              {waifus.map((waifu, index) => (
                <div
                  key={`${waifu.id}-${index}`}
                  className={isFirstLoad ? 'animate-content-fade motion-reduce:animate-none' : undefined}
                  style={
                    isFirstLoad
                      ? { animationDelay: `${Math.min(index, 10) * 40}ms`, animationFillMode: 'backwards' }
                      : undefined
                  }
                >
                  <WaifuCard
                    name={waifu.name}
                    image={waifu.image}
                    description={waifu.description}
                    origin={waifu.origin}
                    series={waifu.series}
                    tags={waifu.tags}
                    onSelect={() => onSelectWaifu(waifu)}
                  />
                </div>
              ))}
            </div>
          )
      )}
      </div>

      {/* Infinite Scroll Sentinel — kept outside the keyed content block so it
          isn't remounted (and its IntersectionObserver target lost) on every state swap. */}
      {!loading && !error && hasMore && (
        <div ref={loaderRef} className="flex justify-center items-center py-12">
          {loadingMore && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-900 border border-zinc-800 text-zinc-400 text-xs font-mono animate-content-fade motion-reduce:animate-none">
              <div className="w-3.5 h-3.5 border-2 border-scarlet-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading more characters…</span>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

MainArticle.propTypes = {
  activeFilter: PropTypes.string,
  onFilterChange: PropTypes.func,
  counts: PropTypes.shape({
    all: PropTypes.number,
    manga: PropTypes.number,
    manhwa: PropTypes.number,
    manhua: PropTypes.number,
  }),
  onSelectWaifu: PropTypes.func,
};
import { useState, useMemo } from 'react';
import { TopNav } from './components/TopNav';
import { WaifuOfTheDay } from './components/WaifuOfTheDay';
import { Ticker } from './components/Ticker';
import { ThumbnailRow } from './components/ThumbnailRow';
import { MainArticle } from './components/MainArticle';
import { CharacterModal } from './components/CharacterModal';
import redWaifus from './data/red_waifus.json';
import { getWaifuOfTheDay } from './utils/dailyWaifu';

const THUMBNAIL_COUNT = 7;

function App() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedWaifuId, setSelectedWaifuId] = useState(null);

  // Single source of truth for per-origin counts, derived from the actual
  // dataset so a future data change can't silently desync the filter UI.
  const counts = useMemo(() => {
    const result = { all: redWaifus.length, manga: 0, manhwa: 0, manhua: 0 };
    redWaifus.forEach((waifu) => {
      const origin = (waifu.origin || '').toLowerCase();
      if (origin in result) {
        result[origin] += 1;
      }
    });
    return result;
  }, []);

  // Deterministic UTC-epoch-day pick, same for every user on a given UTC
  // calendar day. Empty deps: intentionally does not re-poll at midnight
  // while the tab stays open (see design.md D2 — explicit non-goal).
  const waifuOfTheDay = useMemo(() => getWaifuOfTheDay(redWaifus), []);

  // Client-side-only cursor into the dataset that the hero display and the
  // thumbnail row's active state follow. Starts on the actual daily pick;
  // "Next for detail →" advances it without ever touching waifuOfTheDay
  // itself or its underlying getWaifuOfTheDay logic.
  const [featuredId, setFeaturedId] = useState(waifuOfTheDay?.id ?? null);

  const featuredWaifu = useMemo(
    () => redWaifus.find((w) => w.id === featuredId) || waifuOfTheDay,
    [featuredId, waifuOfTheDay]
  );

  const thumbnails = useMemo(() => redWaifus.slice(0, THUMBNAIL_COUNT), []);

  const handleNextFeatured = () => {
    const idx = redWaifus.findIndex((w) => w.id === featuredWaifu?.id);
    if (idx === -1) return;
    const next = redWaifus[(idx + 1) % redWaifus.length];
    setFeaturedId(next.id);
  };

  const handleSelectFeatured = (waifu) => {
    setFeaturedId(waifu.id);
    setSelectedWaifuId(waifu.id);
  };

  const selectedWaifu = useMemo(
    () => redWaifus.find((w) => w.id === selectedWaifuId) || null,
    [selectedWaifuId]
  );

  return (
    <div className="min-h-screen bg-dark-950 text-zinc-100">
      <div className="showcase-surface">
        <TopNav />
        <WaifuOfTheDay
          waifu={featuredWaifu}
          onOpenDetail={() => featuredWaifu && setSelectedWaifuId(featuredWaifu.id)}
          onNext={handleNextFeatured}
        />
        <Ticker />
        <ThumbnailRow
          waifus={thumbnails}
          activeId={featuredWaifu?.id ?? null}
          onSelect={handleSelectFeatured}
        />
        <Ticker />
      </div>

      <MainArticle
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
        onSelectWaifu={(waifu) => setSelectedWaifuId(waifu.id)}
      />

      <CharacterModal waifu={selectedWaifu} onClose={() => setSelectedWaifuId(null)} />
    </div>
  );
}

export default App;

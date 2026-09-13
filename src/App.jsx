import { useState, useMemo } from 'react';
import { TopNav } from './components/TopNav';
import { WaifuOfTheDay } from './components/WaifuOfTheDay';
import { Ticker } from './components/Ticker';
import { ThumbnailRow } from './components/ThumbnailRow';
import { CharacterSelect } from './components/CharacterSelect';
import { MainArticle } from './components/MainArticle';
import { CharacterModal } from './components/CharacterModal';
import { FooterCta } from './components/FooterCta';
import redWaifus from './data/red_waifus.json';
import { getWaifuOfTheDay } from './utils/dailyWaifu';

const ROSTER_COUNT = 7;

function App() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Single source of truth for per-origin counts, derived from the actual
  // dataset so a future data change can't silently desync the filter UI or
  // the hero stats row.
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
  // calendar day. Seeds the initial featured cursor below — the one
  // deliberate improvement over the extracted reference, which just used
  // `data[0]` for its initial featured pick.
  const waifuOfTheDay = useMemo(() => getWaifuOfTheDay(redWaifus), []);

  // Client-side cursor into the dataset that the roster row, Character
  // Select and the full catalog's color-vs-grayscale all follow. Starts on
  // the actual daily pick; clicking around (roster, catalog, Next/Shuffle)
  // moves this without ever touching the deterministic daily pick itself.
  const [featuredId, setFeaturedId] = useState(waifuOfTheDay?.id ?? null);

  const featuredWaifu = useMemo(
    () => redWaifus.find((w) => w.id === featuredId) || waifuOfTheDay,
    [featuredId, waifuOfTheDay]
  );

  // Independent cursor for the catalog-triggered detail modal. Deliberately
  // NOT the same state as `featuredId`: that id drives three always-visible
  // surfaces (hero, roster, catalog grayscale-except-featured) that must
  // stay exactly as they were behind the modal while it's open.
  const [modalWaifuId, setModalWaifuId] = useState(null);

  const modalWaifu = useMemo(
    () => redWaifus.find((w) => w.id === modalWaifuId) || null,
    [modalWaifuId]
  );

  const roster = useMemo(() => redWaifus.slice(0, ROSTER_COUNT), []);

  const heroStats = useMemo(
    () => [
      { label: 'Characters', value: counts.all },
      { label: 'Manga', value: counts.manga },
      { label: 'Manhwa', value: counts.manhwa },
      { label: 'Curated only', value: 'SFW' },
    ],
    [counts]
  );

  const handleNext = () => {
    const idx = redWaifus.findIndex((w) => w.id === featuredWaifu?.id);
    if (idx === -1) return;
    setFeaturedId(redWaifus[(idx + 1) % redWaifus.length].id);
  };

  const handleRandom = () => {
    if (redWaifus.length === 0) return;
    const random = redWaifus[Math.floor(Math.random() * redWaifus.length)];
    setFeaturedId(random.id);
  };

  const handlePick = (id) => setFeaturedId(id);

  return (
    <div className="min-h-screen bg-accent-900 text-paper">
      <TopNav onShuffle={handleRandom} />
      <WaifuOfTheDay stats={heroStats} onNext={handleNext} />
      <Ticker items={redWaifus.map((w) => w.name)} color="text-paper/85" duration={60} />
      <ThumbnailRow
        waifus={roster}
        activeId={featuredWaifu?.id ?? null}
        onSelect={(waifu) => handlePick(waifu.id)}
      />
      <Ticker
        items={redWaifus.map((w) => w.name).reverse()}
        color="text-accent-400"
        duration={75}
      />
      <CharacterSelect waifu={featuredWaifu} onNext={handleNext} />
      <MainArticle
        waifus={redWaifus}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
        featuredId={featuredWaifu?.id ?? null}
        onSelect={setModalWaifuId}
      />
      <FooterCta />
      <CharacterModal waifu={modalWaifu} onClose={() => setModalWaifuId(null)} />
    </div>
  );
}

export default App;

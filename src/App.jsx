import { useState, useMemo } from 'react';
import { NavBar } from './components/NavBar';
import { MainArticle } from './components/MainArticle';
import redWaifus from './data/red_waifus.json';

function App() {
  const [activeFilter, setActiveFilter] = useState('all');

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

  return (
    <div className="flex min-h-screen bg-dark-950 text-zinc-100">
      <NavBar activeFilter={activeFilter} counts={counts} />
      <div className="flex-1 min-w-0 flex flex-col">
        <MainArticle
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react';
import { NavBar } from './components/NavBar';
import { MainArticle } from './components/MainArticle';

function App() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="flex min-h-screen bg-dark-950 text-zinc-100 linear-grid">
      <NavBar
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        totalCount={32}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <MainArticle
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>
    </div>
  );
}

export default App;


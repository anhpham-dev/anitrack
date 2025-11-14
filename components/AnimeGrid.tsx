import React from 'react';
import { Anime } from '../types';
import AnimeCard from './AnimeCard';

interface AnimeGridProps {
  animeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
}

const AnimeGrid: React.FC<AnimeGridProps> = ({ animeList, onSelectAnime }) => {
  if (animeList.length === 0) {
    return <div className="text-center text-text-secondary py-20">No anime found. Try adjusting your filters.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {animeList.map((anime, index) => (
        <AnimeCard 
          key={anime.id} 
          anime={anime} 
          onSelectAnime={onSelectAnime} 
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
};

export default AnimeGrid;
import React from 'react';
import { Anime } from '../types';
import { StarIcon } from './ui/icons';

interface AnimeCardProps {
  anime: Anime;
  onSelectAnime: (anime: Anime) => void;
  style?: React.CSSProperties;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onSelectAnime, style }) => {
  return (
    <div
      className="bg-card rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 group opacity-0 animate-fade-in border border-transparent hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/20"
      onClick={() => onSelectAnime(anime)}
      style={style}
    >
      <div className="relative">
        <img
          src={anime.images.portrait}
          alt={anime.englishName}
          className="w-full h-auto aspect-[2/3] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
        <div className="absolute bottom-0 left-0 p-3 w-full">
          <h3 className="text-sm font-bold text-white truncate group-hover:whitespace-normal transition-all">{anime.englishName}</h3>
          {anime.rating > 0 && (
            <div className="flex items-center text-yellow-400 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <StarIcon className="w-4 h-4 mr-1" />
              <span className="text-xs font-semibold">{anime.rating}/10</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
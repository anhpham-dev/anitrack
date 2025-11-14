import React from 'react';
import { Anime, Format, StreamingLink } from '../types';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import { CalendarIcon, ClockIcon, EditIcon, LinkIcon, StarIcon, TvIcon, TrashIcon } from './ui/icons';

interface AnimeModalProps {
  anime: Anime;
  onClose: () => void;
  onEdit: (anime: Anime) => void;
  onDelete: (id: string) => void;
}

const AnimeModal: React.FC<AnimeModalProps> = ({ anime, onClose, onEdit, onDelete }) => {
  const getFormatDetails = () => {
    const { formatDetails } = anime;
    switch (formatDetails.format) {
      case Format.TV:
        return `TV - ${formatDetails.totalEpisodes} episodes (${formatDetails.season})`;
      case Format.Movie:
        return `Movie - ${formatDetails.duration} min`;
      case Format.OVA:
        return `OVA - ${formatDetails.episodeCount} eps @ ${formatDetails.durationPerEpisode} min/ep`;
    }
  };

  const statusColorMap: { [key: string]: string } = {
    'Watching': 'text-green-400',
    'Completed': 'text-blue-400',
    'On Hold': 'text-yellow-400',
    'Dropped': 'text-red-400',
    'Plan to Watch': 'text-gray-400'
  }

  return (
    <Modal isOpen={!!anime} onClose={onClose}>
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative h-48 md:h-64 rounded-t-2xl overflow-hidden group">
          <img src={anime.images.landscape} alt={anime.englishName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute inset-0 ring-1 ring-inset ring-primary/20 rounded-t-2xl"></div>
          <div className="absolute bottom-0 left-0 p-4 md:p-6">
            <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">{anime.englishName}</h2>
            {anime.alternativeTitle && <p className="text-sm md:text-md text-gray-300 drop-shadow-md">{anime.alternativeTitle}</p>}
          </div>
           <div className="absolute top-4 right-4 flex gap-2">
             <button onClick={() => onEdit(anime)} className="bg-primary/70 backdrop-blur-sm p-2 rounded-full text-white hover:bg-primary hover:shadow-glow-primary transition-all duration-300" aria-label="Edit Anime">
                <EditIcon className="w-5 h-5" />
             </button>
             <button onClick={() => onDelete(anime.id)} className="bg-red-600/70 backdrop-blur-sm p-2 rounded-full text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300" aria-label="Delete Anime">
                <TrashIcon className="w-5 h-5" />
             </button>
           </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {anime.genres.map(genre => <Badge key={genre}>{genre}</Badge>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 mb-6 text-sm text-text-secondary">
            <div className="flex items-center gap-2.5"><TvIcon className="w-5 h-5 text-primary" /> <span>{getFormatDetails()}</span></div>
            <div className="flex items-center gap-2.5"><CalendarIcon className="w-5 h-5 text-primary" /> <span>{anime.releaseYear}</span></div>
            <div className="flex items-center gap-2.5"><ClockIcon className="w-5 h-5 text-primary" /> <span className={`font-semibold ${statusColorMap[anime.status]}`}>{anime.status}</span></div>
            <div className="col-span-1 md:col-span-3 pt-2"><Badge color="gray">{anime.ageRating}</Badge></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {anime.rating > 0 &&
                <div className="flex items-center gap-2 mb-4">
                  <StarIcon className="w-8 h-8 text-yellow-400" />
                  <span className="text-2xl font-bold">{anime.rating} <span className="text-base text-text-secondary font-medium">/ 10</span></span>
                </div>
              }
              <p className="text-text-secondary mb-6 leading-relaxed">{anime.description}</p>
              {!anime.doneAiring && anime.estimatedEndDate && (
                <p className="mb-6 bg-yellow-900/50 text-yellow-300 p-3 rounded-lg text-sm">
                  <strong>Still Airing</strong> - Estimated End Date: {new Date(anime.estimatedEndDate).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><LinkIcon className="w-5 h-5" />Streaming Links</h4>
              <ul className="space-y-2">
                {anime.streamingLinks.length > 0 ? anime.streamingLinks.map((link: StreamingLink) => (
                  <li key={link.id} className="text-sm">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline hover:text-violet-400 transition-colors">
                      {link.name}{link.seasonOrPart ? ` (${link.seasonOrPart})` : ''}
                    </a>
                  </li>
                )) : <li className="text-sm text-text-secondary">No streaming links available.</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AnimeModal;
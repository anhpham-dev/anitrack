import React, { useState, useEffect, ChangeEvent } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Anime, Status, Format, AgeRating, StreamingLink, AnimeFormatDetails } from '../types';
import { ANIME_GENRES, AGE_RATINGS_OPTIONS, STATUS_OPTIONS, FORMAT_OPTIONS } from '../constants';
import Modal from './ui/Modal';
import { PlusIcon, TrashIcon, SparklesIcon, CheckIcon, XMarkIcon } from './ui/icons';

interface AnimeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (anime: Anime) => void;
  initialData?: Anime | null;
}

const emptyAnime: Omit<Anime, 'id'> = {
  englishName: '',
  alternativeTitle: '',
  genres: [],
  ageRating: AgeRating.PG13,
  releaseYear: new Date().getFullYear(),
  images: { landscape: '', portrait: '' },
  description: '',
  status: Status.PlanToWatch,
  rating: 0,
  doneAiring: true,
  estimatedEndDate: '',
  streamingLinks: [{ id: 'link-1', name: '', url: '', seasonOrPart: '' }],
  formatDetails: { format: Format.TV, totalEpisodes: 12, season: '1' },
};

type AnimeAIResponse = Partial<Omit<Anime, 'id' | 'status' | 'rating' | 'streamingLinks' | 'doneAiring' | 'formatDetails'>> & { format?: Format };

const AnimeForm: React.FC<AnimeFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Omit<Anime, 'id'>>(initialData || emptyAnime);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set(initialData?.genres || []));
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSelectedGenres(new Set(initialData.genres));
    } else {
      setFormData(emptyAnime);
      setSelectedGenres(new Set());
    }
  }, [initialData, isOpen]);
  
  const fetchAnimeInfo = async () => {
    if (!formData.englishName) {
        alert('Please enter an anime name first.');
        return;
    }
    setIsFetching(true);
    try {
        // Fix: Per coding guidelines, instantiate GoogleGenAI without `as string` cast.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const responseSchema = {
          type: Type.OBJECT,
          properties: {
            alternativeTitle: { type: Type.STRING, description: "The alternative or Japanese title. Omit if none." },
            genres: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 main genres." },
            ageRating: { type: Type.STRING, description: `The age rating. Must be one of: ${AGE_RATINGS_OPTIONS.join(', ')}` },
            releaseYear: { type: Type.INTEGER, description: "The initial release year." },
            description: { type: Type.STRING, description: "A concise, one-paragraph summary." },
            images: {
              type: Type.OBJECT,
              properties: {
                portrait: { type: Type.STRING, description: "A URL for a high-quality portrait poster." },
                landscape: { type: Type.STRING, description: "A URL for a high-quality landscape/backdrop image." },
              }
            },
            format: { type: Type.STRING, description: `The format. Must be one of: ${FORMAT_OPTIONS.join(', ')}` }
          },
        };

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Fetch details for the anime: "${formData.englishName}".`,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            systemInstruction: "You are an anime database assistant. Provide accurate data based on the provided schema."
          },
        });

        const data = JSON.parse(response.text) as AnimeAIResponse;

        setFormData(prev => ({
            ...prev,
            alternativeTitle: data.alternativeTitle || prev.alternativeTitle,
            genres: data.genres?.filter(g => ANIME_GENRES.includes(g)) || prev.genres,
            ageRating: (data.ageRating && AGE_RATINGS_OPTIONS.includes(data.ageRating)) ? data.ageRating : prev.ageRating,
            releaseYear: data.releaseYear || prev.releaseYear,
            description: data.description || prev.description,
            images: {
                portrait: data.images?.portrait || prev.images.portrait,
                landscape: data.images?.landscape || prev.images.landscape,
            },
        }));
        if (data.genres) {
            setSelectedGenres(new Set(data.genres.filter(g => ANIME_GENRES.includes(g))));
        }
        if (data.format && FORMAT_OPTIONS.includes(data.format)) {
            handleFormatChange({ target: { value: data.format } } as React.ChangeEvent<HTMLSelectElement>);
        }

    } catch (error) {
        console.error("Error fetching anime data:", error);
        alert("Failed to fetch anime information. Please try again or fill it manually.");
    } finally {
        setIsFetching(false);
    }
  };


  // Fix: Use a more robust type guard to handle different input types correctly and resolve the TypeScript error.
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: e.target.checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormatDetailsChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setFormData(prev => ({
        ...prev,
        formatDetails: {
            ...prev.formatDetails,
            [name]: isNaN(numValue) ? value : numValue
        }
    }));
  };
  
  const handleFormatChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newFormat = e.target.value as Format;
    let newFormatDetails: AnimeFormatDetails;
    switch(newFormat) {
        case Format.Movie:
            newFormatDetails = { format: newFormat, duration: 90 };
            break;
        case Format.OVA:
            newFormatDetails = { format: newFormat, episodeCount: 6, durationPerEpisode: 24 };
            break;
        case Format.TV:
        default:
            newFormatDetails = { format: newFormat, totalEpisodes: 12, season: '1' };
            break;
    }
    setFormData(prev => ({...prev, formatDetails: newFormatDetails}));
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = new Set(selectedGenres);
    if (newGenres.has(genre)) {
      newGenres.delete(genre);
    } else {
      newGenres.add(genre);
    }
    setSelectedGenres(newGenres);
    setFormData(prev => ({ ...prev, genres: Array.from(newGenres) }));
  };

  const handleStreamingLinkChange = (index: number, field: keyof StreamingLink, value: string) => {
    const newLinks = [...formData.streamingLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, streamingLinks: newLinks }));
  };

  const addStreamingLink = () => {
    setFormData(prev => ({
      ...prev,
      streamingLinks: [...prev.streamingLinks, { id: `link-${Date.now()}`, name: '', url: '', seasonOrPart: '' }]
    }));
  };

  const removeStreamingLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      streamingLinks: prev.streamingLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: initialData?.id || Date.now().toString() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl mx-auto p-2">
        <h2 className="text-2xl font-bold mb-6 px-4">{initialData ? 'Edit Anime' : 'Add New Anime'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-4 custom-scrollbar">
          
          <div className="flex items-center gap-2">
            <input name="englishName" value={formData.englishName} onChange={handleChange} placeholder="English Name" required className="input flex-grow" />
             <button
                type="button"
                onClick={fetchAnimeInfo}
                disabled={isFetching}
                className="p-2 bg-primary rounded-lg text-white hover:bg-violet-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-glow-primary"
                aria-label="Fetch anime info with AI"
                title="Fetch info with AI"
            >
                {isFetching ? <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <SparklesIcon className="w-5 h-5" />}
            </button>
          </div>
          <input name="alternativeTitle" value={formData.alternativeTitle} onChange={handleChange} placeholder="Alternative Title" className="input w-full" />
          
          <div>
            <label className="label">Genres</label>
            <div className="flex flex-wrap gap-2 p-2 bg-background rounded-lg border border-gray-700">
              {ANIME_GENRES.map(genre => (
                <button type="button" key={genre} onClick={() => handleGenreToggle(genre)} className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${selectedGenres.has(genre) ? 'bg-primary text-white font-semibold shadow-md shadow-primary/30' : 'bg-gray-700 text-text-secondary hover:bg-gray-600'}`}>{genre}</button>
              ))}
            </div>
          </div>
          
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="input w-full min-h-[100px]" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="images.portrait" value={formData.images.portrait} onChange={e => setFormData(p => ({...p, images: {...p.images, portrait: e.target.value}}))} placeholder="Portrait Image URL" required className="input" />
            <input name="images.landscape" value={formData.images.landscape} onChange={e => setFormData(p => ({...p, images: {...p.images, landscape: e.target.value}}))} placeholder="Landscape Image URL" required className="input" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select name="status" value={formData.status} onChange={handleChange} className="input"><option disabled>Status</option>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select>
            <select name="ageRating" value={formData.ageRating} onChange={handleChange} className="input"><option disabled>Age Rating</option>{AGE_RATINGS_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}</select>
            <input type="number" name="releaseYear" value={formData.releaseYear} onChange={handleChange} placeholder="Release Year" className="input" />
            <input type="number" name="rating" value={formData.rating} min="0" max="10" onChange={handleChange} placeholder="Rating (0-10)" className="input" />
          </div>

          <div>
            <label className="label">Format</label>
            <select value={formData.formatDetails.format} onChange={handleFormatChange} className="input w-full">
              {FORMAT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {formData.formatDetails.format === Format.TV && (<><input type="number" name="totalEpisodes" value={formData.formatDetails.totalEpisodes} onChange={handleFormatDetailsChange} placeholder="Total Episodes" className="input" /><input type="text" name="season" value={formData.formatDetails.season} onChange={handleFormatDetailsChange} placeholder="Season" className="input" /></>)}
              {formData.formatDetails.format === Format.Movie && <input type="number" name="duration" value={formData.formatDetails.duration} onChange={handleFormatDetailsChange} placeholder="Duration (min)" className="input" />}
              {formData.formatDetails.format === Format.OVA && (<><input type="number" name="episodeCount" value={formData.formatDetails.episodeCount} onChange={handleFormatDetailsChange} placeholder="Episode Count" className="input" /><input type="number" name="durationPerEpisode" value={formData.formatDetails.durationPerEpisode} onChange={handleFormatDetailsChange} placeholder="Duration per Episode (min)" className="input" /></>)}
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <input type="checkbox" id="doneAiring" name="doneAiring" checked={formData.doneAiring} onChange={handleChange} className="h-5 w-5 rounded text-primary bg-background border-gray-600 focus:ring-primary cursor-pointer" />
            <label htmlFor="doneAiring" className="label m-0 cursor-pointer">Done Airing?</label>
            {!formData.doneAiring && <input type="date" name="estimatedEndDate" value={formData.estimatedEndDate} onChange={handleChange} className="input flex-grow" />}
          </div>

          <div>
            <label className="label">Streaming Links</label>
            <div className="space-y-2">
            {formData.streamingLinks.map((link, index) => (
              <div key={link.id} className="flex items-center gap-2">
                <input value={link.name} onChange={e => handleStreamingLinkChange(index, 'name', e.target.value)} placeholder="Name (e.g., Netflix)" className="input w-1/4" />
                <input value={link.url} onChange={e => handleStreamingLinkChange(index, 'url', e.target.value)} placeholder="URL" className="input flex-grow" />
                <input value={link.seasonOrPart} onChange={e => handleStreamingLinkChange(index, 'seasonOrPart', e.target.value)} placeholder="Season/Part" className="input w-1/4" />
                <button type="button" onClick={() => removeStreamingLink(index)} className="p-2 text-red-500 hover:text-red-400 transition-colors"><TrashIcon className="w-5 h-5"/></button>
              </div>
            ))}
            </div>
            <button type="button" onClick={addStreamingLink} className="mt-2 flex items-center gap-2 text-primary hover:text-violet-400 font-semibold transition-colors"><PlusIcon className="w-5 h-5" /> Add Link</button>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105">
              <XMarkIcon className="w-5 h-5" /> Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary hover:bg-violet-700 font-semibold text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105">
              <CheckIcon className="w-5 h-5" /> Save Anime
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .input {
          background-color: #111827;
          border: 1px solid #4b5563;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          color: #f9fafb;
          transition: all 0.3s ease;
        }
        .input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 15px 2px rgba(109, 40, 217, 0.6);
          transform: translateY(-1px);
        }
        .label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #9ca3af;
        }
      `}</style>
    </Modal>
  );
};

export default AnimeForm;
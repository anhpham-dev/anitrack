
import { Anime, Status, Format, AgeRating } from './types';

export const ANIME_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance',
  'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'
];

export const AGE_RATINGS_OPTIONS = Object.values(AgeRating);
export const STATUS_OPTIONS = Object.values(Status);
export const FORMAT_OPTIONS = Object.values(Format);

export const initialAnimeData: Anime[] = [
  {
    id: '1',
    englishName: 'Attack on Titan',
    alternativeTitle: 'Shingeki no Kyojin',
    genres: ['Action', 'Drama', 'Fantasy', 'Horror'],
    ageRating: AgeRating.R,
    releaseYear: 2013,
    images: {
      landscape: 'https://picsum.photos/seed/aot-landscape/1280/720',
      portrait: 'https://picsum.photos/seed/aot-portrait/500/750',
    },
    description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    status: Status.Completed,
    rating: 9,
    doneAiring: true,
    streamingLinks: [
      { id: 'sl1', name: 'Crunchyroll', url: '#', seasonOrPart: 'Seasons 1-4' },
      { id: 'sl2', name: 'Hulu', url: '#', seasonOrPart: 'Seasons 1-4' },
    ],
    formatDetails: {
      format: Format.TV,
      totalEpisodes: 87,
      season: "Final Season"
    },
  },
  {
    id: '2',
    englishName: 'Jujutsu Kaisen',
    genres: ['Action', 'Supernatural', 'Fantasy'],
    ageRating: AgeRating.R,
    releaseYear: 2020,
    images: {
      landscape: 'https://picsum.photos/seed/jjk-landscape/1280/720',
      portrait: 'https://picsum.photos/seed/jjk-portrait/500/750',
    },
    description: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts and thus exorcise himself.',
    status: Status.Watching,
    rating: 10,
    doneAiring: false,
    estimatedEndDate: '2025-06-30',
    streamingLinks: [
      { id: 'sl3', name: 'Crunchyroll', url: '#', seasonOrPart: 'Season 1 & 2' },
    ],
    formatDetails: {
      format: Format.TV,
      totalEpisodes: 47,
      season: "2"
    },
  },
  {
    id: '3',
    englishName: 'Your Name',
    alternativeTitle: 'Kimi no Na wa.',
    genres: ['Drama', 'Romance', 'Supernatural'],
    ageRating: AgeRating.PG13,
    releaseYear: 2016,
    images: {
      landscape: 'https://picsum.photos/seed/yourname-landscape/1280/720',
      portrait: 'https://picsum.photos/seed/yourname-portrait/500/750',
    },
    description: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    status: Status.Completed,
    rating: 10,
    doneAiring: true,
    streamingLinks: [
      { id: 'sl4', name: 'Netflix', url: '#' },
    ],
    formatDetails: {
      format: Format.Movie,
      duration: 107,
    },
  },
  {
    id: '4',
    englishName: 'Spy x Family',
    genres: ['Action', 'Comedy', 'Slice of Life'],
    ageRating: AgeRating.PG13,
    releaseYear: 2022,
    images: {
      landscape: 'https://picsum.photos/seed/spy-landscape/1280/720',
      portrait: 'https://picsum.photos/seed/spy-portrait/500/750',
    },
    description: 'A spy on an undercover mission gets married and adopts a child, not realizing that his wife and daughter have their own secrets.',
    status: Status.OnHold,
    rating: 8,
    doneAiring: false,
    estimatedEndDate: '2024-12-25',
    streamingLinks: [
       { id: 'sl5', name: 'Crunchyroll', url: '#', seasonOrPart: 'Part 1 & 2' },
    ],
    formatDetails: {
      format: Format.TV,
      totalEpisodes: 37,
      season: '2'
    },
  },
  {
    id: '5',
    englishName: 'Cyberpunk: Edgerunners',
    genres: ['Action', 'Sci-Fi', 'Psychological'],
    ageRating: AgeRating.R,
    releaseYear: 2022,
    images: {
      landscape: 'https://picsum.photos/seed/cyberpunk-landscape/1280/720',
      portrait: 'https://picsum.photos/seed/cyberpunk-portrait/500/750',
    },
    description: 'A street kid trying to survive in a technology- and body-modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner.',
    status: Status.PlanToWatch,
    rating: 0,
    doneAiring: true,
    streamingLinks: [
      { id: 'sl6', name: 'Netflix', url: '#' }
    ],
    formatDetails: {
      format: Format.OVA,
      episodeCount: 10,
      durationPerEpisode: 24
    },
  }
];

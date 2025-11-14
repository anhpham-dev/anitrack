
export enum Status {
  Watching = 'Watching',
  Completed = 'Completed',
  OnHold = 'On Hold',
  Dropped = 'Dropped',
  PlanToWatch = 'Plan to Watch',
}

export enum Format {
  TV = 'TV',
  Movie = 'Movie',
  OVA = 'OVA',
}

export enum AgeRating {
  G = 'G - All Ages',
  PG = 'PG - Children',
  PG13 = 'PG-13 - Teens 13 or older',
  R = 'R - 17+ (violence & profanity)',
  RPlus = 'R+ - Mild Nudity',
}

export interface StreamingLink {
  id: string;
  name: string;
  url: string;
  seasonOrPart?: string;
}

export type AnimeFormatDetails =
  | { format: Format.TV; totalEpisodes: number; season: string; }
  | { format: Format.Movie; duration: number; }
  | { format: Format.OVA; episodeCount: number; durationPerEpisode: number; };

export interface Anime {
  id: string;
  englishName: string;
  alternativeTitle?: string;
  genres: string[];
  ageRating: AgeRating;
  releaseYear: number;
  images: {
    landscape: string;
    portrait: string;
  };
  description: string;
  status: Status;
  rating: number; // 1-10
  doneAiring: boolean;
  estimatedEndDate?: string;
  streamingLinks: StreamingLink[];
  formatDetails: AnimeFormatDetails;
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this should be a hash.
  role: Role;
}

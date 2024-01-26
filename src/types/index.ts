import { type Media } from "@prisma/client";

export type TrendingResponseType = {
  page: number;
  results: Media[];
  total_pages: number;
  total_results: number;
};

export type SearchResultType = {
  page: number;
  results: Media[];
  total_pages: number;
  total_results: number;
};

export type TrendingType = {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  adult?: boolean;
  overview?: string;
  release_date?: string;
  media_type?: string;
  genre_ids?: number[];
  original_title?: string;
  original_language?: string;
  backdrop_path?: string | null;
  popularity?: number;
  vote_count?: number;
  video?: boolean;
  vote_average?: number;
  first_air_date?: string;
  last_air_date?: string;
};

export type ApiErrorResponse = {
  success: boolean;
  status_code: number;
  status_message: string;
};

export type ImageType = {
  aspect_ratio: number;
  height: number;
  iso_639_1: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
};

export type VideoType = {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
};

type Language = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type SimilarOrRecommendations = {
  page: number;
  results: TrendingType[];
};

export type TMDBApiMedia = Media & {
  images: { backdrops: ImageType[]; logos: ImageType[]; posters: ImageType[] };
  videos: { results: VideoType[] };
  number_of_episodes?: number;
  number_of_seasons?: number;
  first_air_date?: string;
  last_air_date?: string;
  budget?: number;
  revenue?: number;
  tagline?: string;
  spoken_languages?: Language[];
  credits?: { cast: Cast[]; crew: Crew[] };
  similar?: SimilarOrRecommendations;
  recommendations?: SimilarOrRecommendations;
};

export type GenreType = { id: number; name: string };

export type ListIdsType = {
  favoriteIds: number[];
  watchListIds: number[];
  mylistIds: number[];
};

type CastAndCrew = {
  adult: boolean;
  gender: boolean;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
};

export type Cast = CastAndCrew & {
  cast_id: number;
  character: string;
  order: number;
};

export type Crew = CastAndCrew & {
  department: string;
  job: string;
};

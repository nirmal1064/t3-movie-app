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

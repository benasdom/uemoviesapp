import { ImageSourcePropType } from "react-native";

export interface Movie {
  id: number;
  title?: string;
  name?: string;              // TV series
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title?: string;
  original_name?: string;     // TV series
  overview: string;
  popularity: number;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;    // TV series
  video?: boolean;
  vote_average: number;
  vote_count: number;
  mediaType?: 'movie' | 'tv';
}

export interface MovieStatic {
  image: ImageSourcePropType;
  id: string;
  title: string;
}

export interface TrendingMovie {
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url: string;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  budget?: number;                // movie only
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id?: string | null;        // movie only
  original_language: string;
  original_title?: string;        // movie only
  original_name?: string;         // TV series
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date?: string;          // movie only
  first_air_date?: string;        // TV series
  last_air_date?: string;         // TV series
  revenue?: number;               // movie only
  runtime?: number | null;        // movie only
  episode_run_time?: number[];    // TV series
  number_of_episodes?: number;    // TV series
  number_of_seasons?: number;     // TV series
  seasons?: {                     // TV series
    id: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
    season_number: number;
    air_date: string | null;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title?: string;                 // movie only
  name?: string;                  // TV series
  video?: boolean;                // movie only
  vote_average: number;
  vote_count: number;
  mediaType?: 'movie' | 'tv';
}

export interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}
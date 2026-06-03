import { MovieDetails } from '@/interfaces';

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN,
  Headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN}`
  }
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, { method: "GET", headers: TMDB_CONFIG.Headers });
  if (!response.ok) throw new Error(`Failed to fetch movies: ${response.statusText}`);
  const data = await response.json();
  return data.results;
};

// ── NEW: search TV shows by query, or return popular on_the_air when empty ──
export const fetchTVShows = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/tv?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/tv/on_the_air`;

  const response = await fetch(endpoint, { method: "GET", headers: TMDB_CONFIG.Headers });
  if (!response.ok) throw new Error(`Failed to fetch TV shows: ${response.statusText}`);
  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (
  movieId: string,
  mediaType: 'movie' | 'tv' = 'movie'
): Promise<MovieDetails> => {
  const response = await fetch(`${TMDB_CONFIG.BASE_URL}/${mediaType}/${movieId}`, {
    method: 'GET',
    headers: TMDB_CONFIG.Headers
  });
  if (!response.ok) throw new Error(`Failed to fetch details: ${response.statusText}`);
  return await response.json();
};

export const fetchTrendingMovies = async () => {
  const response = await fetch(`${TMDB_CONFIG.BASE_URL}/trending/movie/week`, {
    method: "GET",
    headers: TMDB_CONFIG.Headers
  });
  if (!response.ok) throw new Error(`Failed to fetch trending: ${response.statusText}`);
  const data = await response.json();
  return data.results.reverse();
};

export const fetchNowPlayingMovies = async () => {
  const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/now_playing`, {
    method: "GET",
    headers: TMDB_CONFIG.Headers
  });
  if (!response.ok) throw new Error(`Failed to fetch now playing: ${response.statusText}`);
  const data = await response.json();
  return data.results;
};

export const fetchTVSeries = async () => {
  const response = await fetch(`${TMDB_CONFIG.BASE_URL}/tv/on_the_air`, {
    method: "GET",
    headers: TMDB_CONFIG.Headers
  });
  if (!response.ok) throw new Error(`Failed to fetch TV series: ${response.statusText}`);
  const data = await response.json();
  return data.results;
};
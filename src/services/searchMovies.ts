import { tmdb } from "./tmdb";

export const searchMovies = (query: string, page = 1) => {
  if (!query.trim()) return Promise.resolve({ results: [] });

  return tmdb(
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=en-US`
  );
};
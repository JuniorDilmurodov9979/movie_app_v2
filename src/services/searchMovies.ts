import type { Movie } from "../types/movie";
import type { TMDBPaginatedResponse } from "../types/tmdb";
import { tmdb } from "./tmdb";

export const searchMovies = (
  query: string,
  page = 1
): Promise<TMDBPaginatedResponse<Movie>> => {
  if (!query.trim()) {
    return Promise.resolve({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    });
  }

  return tmdb<TMDBPaginatedResponse<Movie>>(
    `/search/movie?query=${encodeURIComponent(
      query
    )}&page=${page}&language=en-US`
  );
};

import { useEffect, useState } from "react";
import { tmdb } from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import type { MovieSummary } from "../types/movie-summary";

interface PopularMoviesResponse {
  results: MovieSummary[];
}

export default function Movies() {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tmdb<PopularMoviesResponse>("/movie/popular")
      .then((data) => setMovies(data.results))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  return <MovieGrid type="movies" title="Popular Movies" movies={movies} />;
}

import { useEffect, useState } from "react";
import { tmdb } from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import type { TMDBPaginatedResponse } from "../types/tmdb";
import type { Movie } from "../types/movie";

export default function Trending() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tmdb<TMDBPaginatedResponse<Movie>>("/trending/movie/week")
      .then((data) => setMovies(data.results))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-20">
        Loading trending movies this week...
      </div>
    );
  }

  return (
    <MovieGrid type="trending" title="🔥 Trending This Week" movies={movies} />
  );
}

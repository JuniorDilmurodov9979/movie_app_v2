import { useEffect, useState } from "react";
import { tmdb } from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tmdb("/movie/popular")
      .then((data) => setMovies(data.results))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  return <MovieGrid type="movies" title="Popular Movies" movies={movies} />;
}

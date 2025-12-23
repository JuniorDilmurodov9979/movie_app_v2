import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../services/searchMovies";

const Search = () => {
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get("query");
    if (!q) return;

    setQuery(q);
    setLoading(true);

    searchMovies(q)
      .then((data) => setMovies(data.results))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="min-h-screen px-6 py-8 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-semibold">
          Search results for
          <span className="text-blue-400"> “{query}”</span>
        </h1>
      </div>

      {/* States */}
      {loading && (
        <div className="flex justify-center mt-20">
          <div className="animate-pulse text-white/60">Searching movies...</div>
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="flex flex-col items-center mt-24 text-white/50">
          <p className="text-lg">No movies found</p>
          <p className="text-sm mt-2">Try searching with a different title</p>
        </div>
      )}

      {/* Grid */}
      {!loading && movies.length > 0 && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard type={"movies"} key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;

import { useState } from "react";
import { Link } from "react-router-dom";

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
};

const Favorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const removeFromFavorites = (id: number) => {
    const updated = favorites.filter((movie) => movie.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">
          No favorites yet
        </h2>
        <p className="text-gray-400 mb-6">
          Start adding movies you actually like.
        </p>
        <Link
          to="/"
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-white"
        >
          Browse movies
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Your Favorites</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {favorites.map((movie) => (
          <div
            key={movie.id}
            className="group relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition"
          >
            {/* Poster */}
            <Link to={`/movies/${movie.id}`}>
              <img
                src={
                  movie.poster_path
                    ? `${TMDB_IMG}${movie.poster_path}`
                    : "/no-poster.png"
                }
                alt={movie.title}
                className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Overlay */}
            <div className="p-3">
              <h3 className="text-sm font-semibold text-white truncate">
                {movie.title}
              </h3>

              <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                <span>{movie.release_date?.slice(0, 4)}</span>
                <span className="text-yellow-400 font-medium">
                  ★ {movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeFromFavorites(movie.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition
                         bg-black/60 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-md"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;

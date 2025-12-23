// src/components/MovieCard.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie } from "@/types/movie";

interface MovieCardProps {
  type: string;
  movie: Movie;
}

export default function MovieCard({ type, movie }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const stored: Movie[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    setIsFavorite(stored.some((m) => m.id === movie.id));
  }, [movie.id]);

  const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const stored: Movie[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    if (isFavorite) {
      const updated = stored.filter((m) => m.id !== movie.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      localStorage.setItem("favorites", JSON.stringify([...stored, movie]));
      setIsFavorite(true);
    }
  };

  return (
    <Link
      to={`/${type}/${movie.id}`}
      className="group relative block rounded-xl overflow-hidden
                 backdrop-blur-md bg-white/10 border border-white/10
                 shadow-lg transition-all duration-300
                 hover:scale-[1.03]"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center
                          bg-linear-to-br from-slate-800 to-slate-900
                          text-white/60 text-sm"
          >
            No Image
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-2 left-2 z-10
            rounded-full p-2 backdrop-blur
            transition-all duration-200
            ${
              isFavorite
                ? "bg-red-600 text-white"
                : "bg-black/60 text-white/70 hover:text-red-400"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isFavorite ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z"
            />
          </svg>
        </button>

        {/* Score badge */}
        {movie.vote_average > 0 && (
          <div
            className="absolute top-2 right-2 pointer-events-none
                        bg-black/70 backdrop-blur px-2 py-1
                        rounded-lg text-xs font-semibold text-yellow-400"
          >
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-sm font-semibold line-clamp-2 text-white">
          {movie.title}
        </p>
        <p className="mt-1 text-xs text-white/60">{movie.release_date}</p>
      </div>
    </Link>
  );
}

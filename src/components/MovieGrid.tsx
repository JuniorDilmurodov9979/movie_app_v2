// src/components/MovieGrid.tsx
import MovieCard from "./MovieCard";
import type { Movie } from "@/types/movie";

type MovieGridProps = {
  title?: string;
  movies: Movie[];
  type: string;
};

export default function MovieGrid({ type, title, movies }: MovieGridProps) {
  return (
    <div className="text-white">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
        {title && <h1 className="text-2xl font-semibold mb-6">{title}</h1>}

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} type={type} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

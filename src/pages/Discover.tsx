import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import MovieCard from "../components/MovieCard";
import { tmdb } from "../services/tmdb";
import { Input } from "../components/ui/custom_input";
import type { Movie } from "../types/movie";
import type { TMDBGenreResponse } from "../types/tmdb";

type Genre = {
  id: number;
  name: string;
};

const Discover = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [sort, setSort] = useState<string>("");

  // Load genres once
  useEffect(() => {
    tmdb<TMDBGenreResponse>("/genre/movie/list")
      .then((data) => setGenres(data.genres))
      .catch(console.error);
  }, []);

  // Discover movies when filters change

  const discoverMovies = async () => {
    const params = new URLSearchParams({
      sort_by: sort,
      with_genres: genre,
      primary_release_year: year,
      "vote_average.gte": rating,
    });

    const data = await tmdb(`/discover/movie?${params}`);
    setMovies(data.results || []);
  };

  useEffect(() => {
    discoverMovies();
  }, [genre, year, rating, sort]);

  const searchMovies = async () => {
    if (!query.trim()) {
      discoverMovies();
      return;
    }

    const data = await tmdb(`/search/movie?query=${encodeURIComponent(query)}`);
    setMovies(data.results || []);
  };

  const resetFilters = () => {
    setQuery("");
    setGenre("");
    setYear("");
    setRating("");
    setSort("popularity.desc");
    discoverMovies();
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Discover Movies</h1>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="col-span-2">
          <Input
            placeholder="Search title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchMovies()}
            className="bg-white/10 text-white"
          />
        </div>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 text-white"
        >
          <option value="">Genre</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 text-white"
        >
          <option value="">Year</option>
          {Array.from({ length: 30 }, (_, i) => 2025 - i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 text-white"
        >
          <option value="">Rating</option>
          <option value="7">7+</option>
          <option value="8">8+</option>
          <option value="9">9+</option>
        </select>
      </div>

      {/* Sort */}
      <div className="mb-6 flex justify-between">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 text-white"
        >
          <option value="popularity.desc">Popular</option>
          <option value="vote_average.desc">Top Rated</option>
          {/* <option value="release_date.desc">Newest</option> */}
        </select>
        <Button variant="destructive" onClick={resetFilters}>
          Reset filters
        </Button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} type="movie" />
        ))}
      </div>
    </div>
  );
};

export default Discover;

const BASE_URL = "https://api.themoviedb.org/3";
const READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export const tmdb = async <T>(endpoint: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${READ_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("TMDB request failed");
  }

  return res.json() as Promise<T>;
};

export async function searchMovie(title: string, year?: number) {
  const res = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(title)}&year=${
      year ?? ""
    }&api_key=${import.meta.env.VITE_TMDB_API_KEY}`
  );

  const data = await res.json();
  return data.results?.[0]; // best match
}

export async function getMovieDetails(id: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
  );
  return res.json();
}

export const getImageUrl = (path: string | null): string => {
  if (!path) return "/placeholder-movie.jpg"; // Add a placeholder image
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

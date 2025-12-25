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

export const searchMovie = async (
  title: string,
  year?: number
): Promise<TMDBMovie | null> => {
  try {
    const params = new URLSearchParams({
      // api_key: TMDB_API_KEY,
      query: title,
      ...(year && { year: year.toString() }),
    });

    const response = await fetch(`${BASE_URL}/search/movie?${params}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0]; // Return best match
    }
    return null;
  } catch (error) {
    console.error("TMDB search error:", error);
    return null;
  }
};

export const getImageUrl = (path: string | null): string => {
  if (!path) return "/placeholder-movie.jpg"; // Add a placeholder image
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

import { getMovieDetails, searchMovie } from "./tmdb";

export async function getAiMovies(prompt: string) {
  const aiRes = await fetch("/api/ai-recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const aiData = await aiRes.json();

  const movies = await Promise.all(
    aiData.recommendations.map(async (rec: any) => {
      const search = await searchMovie(rec.title, rec.year);
      if (!search) return null;

      const details = await getMovieDetails(search.id);

      return {
        id: details.id,
        title: details.title,
        release_date: details.release_date,
        rating: details.vote_average,
        runtime: details.runtime,
        genres: details.genres.map((g: any) => g.name),
        poster: details.poster_path,
        reason: rec.why,
      };
    })
  );

  return movies.filter(Boolean);
}

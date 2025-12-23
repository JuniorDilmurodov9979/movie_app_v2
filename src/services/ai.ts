export async function getMovieIntent(prompt: string) {
  const res = await fetch("/api/ai/movie-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("AI request failed");
  }

  return res.json();
}
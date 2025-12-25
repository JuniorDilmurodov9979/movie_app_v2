import { useState } from "react";

export default function AIDiscover() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);

  const handleAskAI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      // 1️⃣ AI → filters
      const aiRes = await fetch("http://localhost:3000/api/ai-discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const aiFilters = await aiRes.json();
      setFilters(aiFilters);

      // 2️⃣ Filters → TMDB
      const tmdbRes = await fetch("/api/tmdb-discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiFilters),
      });

      const tmdbData = await tmdbRes.json();
      const results = tmdbData.results || [];

      if (!results.length) {
        // optional: fallback to normal search
        console.warn("AI returned no results, fallback needed");
      }

      setMovies(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function explainFilters(filters: any) {
    const reasons: string[] = [];

    if (filters?.genres?.length) {
      reasons.push(`Genres: ${filters.genres.join(", ")}`);
    }

    if (filters?.min_rating) {
      reasons.push(`Rating above ${filters.min_rating}`);
    }

    if (filters?.year_from || filters?.year_to) {
      reasons.push(
        `Release period ${filters.year_from ?? "any"} - ${
          filters.year_to ?? "any"
        }`
      );
    }

    if (filters?.sort_by) {
      reasons.push(`Sorted by ${filters.sort_by}`);
    }

    return reasons;
  }

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-white mb-4">
          AI Movie Discovery
        </h1>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to watch..."
          className="w-full h-28 rounded-xl bg-white/10 border border-white/20
                   text-white placeholder-white/50 p-4 outline-none"
        />

        <button
          onClick={handleAskAI}
          disabled={loading}
          className="mt-4 px-6 cursor-pointer py-2 rounded-xl bg-cyan-500 text-black
                   font-medium hover:bg-cyan-400 transition disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {/* Debug: what AI understood */}
        {filters && (
          <div className="mt-6 rounded-xl bg-white/10 border border-white/20 p-4">
            <p className="text-sm font-semibold text-white mb-2">
              Recommended because:
            </p>
            <ul className="text-sm text-white/80 space-y-1">
              {explainFilters(filters).map((reason, i) => (
                <li key={i}>• {reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Movies */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="rounded-xl bg-white/10 border border-white/20 p-3"
            >
              <p className="text-sm text-white">{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

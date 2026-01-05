import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type AIFilters = {
  genres?: string[];
  min_rating?: number;
  year_from?: number;
  year_to?: number;
  sort_by?: string;
  max_runtime?: number;
  keywords?: string[];
};

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
};

type SavedState = {
  prompt: string;
  filters: AIFilters | null;
  movies: Movie[];
  timestamp: number;
};

type RateLimitInfo = {
  limit: number;
  remaining: number;
  resetAt: string | null;
  retryAfter?: number;
};

const EXAMPLE_PROMPTS = [
  "Dark sci-fi movies like Blade Runner, high rating",
  "Fast-paced action movies after 2018",
  "Underrated thrillers from the 2000s",
  "Romantic dramas with strong female lead",
  "Comedy movies under 2 hours, popular",
];

const STORAGE_KEY = "ai_discover_state";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const BASE_URL = "https://server-movie-app-v2.vercel.app";

export default function AIDiscover() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AIFilters | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({
    limit: 20,
    remaining: 20,
    resetAt: null,
  });

  // Load from state on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setPrompt(saved.prompt);
      setFilters(saved.filters);
      setMovies(saved.movies);
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (filters || movies.length > 0) {
      saveState({ prompt, filters, movies, timestamp: Date.now() });
    }
  }, [prompt, filters, movies]);

  // Rotate placeholder text
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % EXAMPLE_PROMPTS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  function saveState(state: SavedState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("Failed to save state:", err);
    }
  }

  function loadState(): SavedState | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const state: SavedState = JSON.parse(saved);

      if (Date.now() - state.timestamp > CACHE_DURATION) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return state;
    } catch (err) {
      console.warn("Failed to load state:", err);
      return null;
    }
  }

  function clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setPrompt("");
      setFilters(null);
      setMovies([]);
      setError(null);
    } catch (err) {
      console.warn("Failed to clear state:", err);
    }
  }

  function updateRateLimitFromHeaders(headers: Headers) {
    const limit = headers.get("X-RateLimit-Limit");
    const remaining = headers.get("X-RateLimit-Remaining");
    const resetAt = headers.get("X-RateLimit-Reset");

    if (limit || remaining || resetAt) {
      setRateLimit({
        limit: limit ? parseInt(limit) : 20,
        remaining: remaining ? parseInt(remaining) : 20,
        resetAt: resetAt || null,
      });
    }
  }

  function formatResetTime(resetAt: string): string {
    const resetDate = new Date(resetAt);
    const now = new Date();
    const diffMs = resetDate.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMinutes = Math.ceil(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`;
    }

    return `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
  }

  const handleAskAI = async (customPrompt?: string) => {
    const finalPrompt = customPrompt ?? prompt;
    if (!finalPrompt.trim() || loading) return;

    setLoading(true);
    setMovies([]);
    setFilters(null);
    setError(null);
    setPrompt(finalPrompt);

    try {
      // 1️⃣ AI → filters
      const aiRes = await fetch(`${BASE_URL}/api/ai-discover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      // Update rate limit from headers
      updateRateLimitFromHeaders(aiRes.headers);

      if (aiRes.status === 429) {
        const errorData = await aiRes.json();
        setRateLimit({
          limit: errorData.limit || 20,
          remaining: 0,
          resetAt: errorData.resetAt,
          retryAfter: errorData.retryAfter,
        });
        throw new Error(errorData.message || "Rate limit exceeded");
      }

      if (!aiRes.ok) {
        const errorData = await aiRes.json().catch(() => ({}));
        throw new Error(errorData.error || "AI request failed");
      }

      const aiFilters: AIFilters = await aiRes.json();
      setFilters(aiFilters);

      // 2️⃣ Filters → TMDB
      const tmdbRes = await fetch(`${BASE_URL}/api/tmdb-discover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiFilters),
      });

      if (!tmdbRes.ok) {
        const errorData = await tmdbRes.json().catch(() => ({}));
        throw new Error(errorData.error || "TMDB request failed");
      }

      const tmdbData = await tmdbRes.json();
      setMovies(tmdbData.results ?? []);

      if (tmdbData.results?.length === 0) {
        setError(
          "No movies found matching your criteria. Try a different description."
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function explainFilters(filters: AIFilters) {
    const reasons: string[] = [];

    if (filters.genres?.length) {
      reasons.push(`Genres: ${filters.genres.join(", ")}`);
    }

    if (filters.min_rating) {
      reasons.push(`Rating above ${filters.min_rating}`);
    }

    if (filters.year_from || filters.year_to) {
      reasons.push(
        `Release period ${filters.year_from ?? "any"} – ${
          filters.year_to ?? "any"
        }`
      );
    }

    if (filters.max_runtime) {
      reasons.push(`Runtime under ${filters.max_runtime} minutes`);
    }

    if (filters.keywords?.length) {
      reasons.push(`Keywords: ${filters.keywords.join(", ")}`);
    }

    return reasons;
  }

  const isRateLimited = rateLimit.remaining === 0;
  const isLowOnRequests = rateLimit.remaining <= 5 && rateLimit.remaining > 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-white">
          AI Movie Discovery
        </h1>
        {(filters || movies.length > 0) && (
          <button
            onClick={clearState}
            className="text-xs px-3 cursor-pointer py-1 rounded-full
             border border-white/30 text-white/80
             hover:bg-white/10 hover:text-white
             transition"
          >
            Clear results
          </button>
        )}
      </div>
      <p className="text-sm text-white/60 mb-6">
        Describe what you feel like watching — genres, mood, era, or rating.
      </p>

      {/* Rate Limit Status */}
      <div
        className={`mb-4 rounded-xl p-3 border ${
          isRateLimited
            ? "bg-red-500/20 border-red-500/40"
            : isLowOnRequests
            ? "bg-yellow-500/20 border-yellow-500/40"
            : "bg-white/10 border-white/20"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                isRateLimited
                  ? "text-red-200"
                  : isLowOnRequests
                  ? "text-yellow-200"
                  : "text-white/80"
              }`}
            >
              {isRateLimited ? "🚫" : isLowOnRequests ? "⚠️" : "✨"}{" "}
              {rateLimit.remaining} / {rateLimit.limit} requests remaining
            </span>
          </div>
          {rateLimit.resetAt && (
            <span
              className={`text-xs ${
                isRateLimited
                  ? "text-red-300/80"
                  : isLowOnRequests
                  ? "text-yellow-300/80"
                  : "text-white/60"
              }`}
            >
              Resets in {formatResetTime(rateLimit.resetAt)}
            </span>
          )}
        </div>
        {isRateLimited && rateLimit.resetAt && (
          <p className="text-xs text-red-300/80 mt-1">
            Daily limit reached. Try again {formatResetTime(rateLimit.resetAt)}{" "}
            from now.
          </p>
        )}
      </div>

      {/* Prompt input */}
      <textarea
        value={prompt}
        disabled={loading || isRateLimited}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && e.ctrlKey && !isRateLimited && handleAskAI()
        }
        placeholder={EXAMPLE_PROMPTS[placeholderIndex]}
        className="w-full h-28 rounded-xl bg-white/10 border border-white/20
                 text-white placeholder-white/40 p-4 outline-none resize-none
                 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-white/40">
          Tip: try genres, year range, mood, or rating • Ctrl + Enter
        </span>
        <button
          onClick={() => handleAskAI()}
          disabled={loading || isRateLimited}
          className="px-6 py-2 rounded-xl bg-cyan-500 text-black
                   font-medium hover:bg-cyan-400 transition disabled:opacity-50
                   disabled:cursor-not-allowed"
        >
          {loading ? "Thinking…" : isRateLimited ? "Limit Reached" : "Ask AI"}
        </button>
      </div>

      {/* Example prompt chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {EXAMPLE_PROMPTS.map((text) => (
          <button
            key={text}
            onClick={() => handleAskAI(text)}
            disabled={loading || isRateLimited}
            className="text-xs px-3 py-1.5 rounded-full
                     bg-white/10 border border-white/20
                     text-white/80 hover:bg-white/20 transition 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {text}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-8 rounded-xl bg-red-500/20 border border-red-500/40 p-4">
          <p className="text-sm font-semibold text-red-200 mb-1">Error</p>
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* AI Interpretation */}
      {filters && !error && (
        <div className="mt-8 rounded-xl bg-white/10 border border-white/20 p-4">
          <p className="text-sm font-semibold text-white mb-2">
            AI interpreted your request as:
          </p>
          <ul className="text-sm text-white/80 space-y-1">
            {explainFilters(filters).map((reason, i) => (
              <li key={i}>• {reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {!loading && movies.length === 0 && filters && !error && (
        <p className="mt-6 text-sm text-white/60">
          No movies found. Try changing your description.
        </p>
      )}

      {/* Movies */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <Link
            to={`/movies/${movie.id}`}
            key={movie.id}
            className="rounded-xl bg-white/10 border border-white/20 p-3
                       hover:bg-white/20 transition block cursor-pointer"
          >
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg mb-2"
              />
            )}
            <p className="text-sm text-white font-medium mb-1">{movie.title}</p>
            <div className="flex items-center justify-between text-xs text-white/60">
              {movie.release_date && (
                <span>{movie.release_date.substring(0, 4)}</span>
              )}
              {movie.vote_average !== undefined && (
                <span>⭐ {movie.vote_average.toFixed(1)}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-white px-6">
      <div className="text-center max-w-md">
        {/* Big title */}
        <h1 className="text-7xl font-bold tracking-widest text-white/90">
          404
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-lg text-white/70">This scene doesn’t exist.</p>

        {/* Description */}
        <p className="mt-2 text-sm text-white/50">
          The page you’re looking for was removed, renamed, or never made it
          past the cutting room floor.
        </p>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/"
            className="
              rounded-lg px-5 py-2
              bg-white text-black font-medium
              transition hover:bg-white/90
            "
          >
            Go home
          </Link>

          <Link
            to="/movies"
            className="
              rounded-lg px-5 py-2
              border border-white/20 text-white
              transition hover:border-white/40
            "
          >
            Browse movies
          </Link>
        </div>
      </div>
    </div>
  );
}

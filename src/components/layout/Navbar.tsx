import { Link, NavLink } from "react-router-dom";
import {
  FilmIcon,
  FireIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?query=${encodeURIComponent(search)}`);
    setSearch("");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 text-sm font-medium transition
   ${
     isActive
       ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]"
       : "text-white/70 hover:text-white"
   }`;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav
          className="flex items-center justify-between rounded-2xl
                        backdrop-blur-xl bg-white/10 border border-white/20
                        shadow-lg"
        >
          {/* Logo */}
          <Link to="/" className="px-5 py-3 text-lg font-semibold text-white">
            🎬 MovieDB
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 px-5 py-3">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur
               border border-white/20 rounded-xl px-3 py-2"
            >
              <MagnifyingGlassIcon className="h-4 w-4 text-white/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="bg-transparent text-sm text-white placeholder-white/50
                 outline-none w-40"
              />
            </form>

            <NavLink to="/" className={linkClass}>
              <HomeIcon className="h-4 w-4" />
              Home
            </NavLink>

            <NavLink to="/discover" className={linkClass}>
              <FunnelIcon className="h-4 w-4" />
              Discover
            </NavLink>

            <NavLink to="/movies" className={linkClass}>
              <FilmIcon className="h-4 w-4" />
              Movies
            </NavLink>

            <NavLink to="/trending" className={linkClass}>
              <FireIcon className="h-4 w-4" />
              Trending
            </NavLink>

            <NavLink to="/favorites" className={linkClass}>
              <HeartIcon className="h-4 w-4" />
              Favorites
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

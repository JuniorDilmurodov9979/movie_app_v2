import { Link, NavLink } from "react-router-dom";
import {
  FilmIcon,
  FireIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

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
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-3 text-lg font-semibold
                       text-white hover:text-sky-400 transition"
          >
            <span className="tracking-wide">MovieDB</span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 px-5 py-3">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur
               border border-white/20 rounded-xl px-3 py-2"
            >
              <MagnifyingGlassIcon className="h-4 w-4 text-white/60" />

              <div className="relative">
                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="bg-transparent text-sm text-white placeholder-white/50
                   outline-none w-40 pr-10"
                />

                <span
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2
                   text-[11px] text-white/40 border border-white/20 rounded px-1.5 py-0.5"
                >
                  ⌘K
                </span>
              </div>
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
            <NavLink to="/ai-discover" className={linkClass}>
              AI Discover
            </NavLink>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className={`md:hidden px-4 py-3 transition ${
              mobileOpen
                ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </nav>

        {mobileOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden mt-3 rounded-2xl border border-white/20
                          bg-white/10 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
              <span className="text-sm font-semibold text-white">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-2 px-5 py-4">
              <NavLink
                onClick={() => setMobileOpen(false)}
                to="/"
                className={linkClass}
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </NavLink>

              <NavLink
                onClick={() => setMobileOpen(false)}
                to="/discover"
                className={linkClass}
              >
                <FunnelIcon className="h-4 w-4" />
                Discover
              </NavLink>

              <NavLink
                onClick={() => setMobileOpen(false)}
                to="/movies"
                className={linkClass}
              >
                <FilmIcon className="h-4 w-4" />
                Movies
              </NavLink>

              <NavLink
                onClick={() => setMobileOpen(false)}
                to="/trending"
                className={linkClass}
              >
                <FireIcon className="h-4 w-4" />
                Trending
              </NavLink>

              <NavLink
                onClick={() => setMobileOpen(false)}
                to="/favorites"
                className={linkClass}
              >
                <HeartIcon className="h-4 w-4" />
                Favorites
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

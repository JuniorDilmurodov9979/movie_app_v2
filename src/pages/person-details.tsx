// src/pages/person-details.tsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { tmdb } from "../services/tmdb";
import { CalendarIcon, MapPinIcon, FilmIcon } from "@heroicons/react/24/solid";

export default function PersonDetails() {
  const { id } = useParams();
  interface PersonDetails {
    id: number;
    name: string;
    profile_path: string | null;
    known_for_department: string;
    birthday: string | null;
    place_of_birth: string | null;
    biography: string | null;
  }

  interface PersonMovieCredit {
    id: number;
    title: string;
    poster_path: string | null;
    popularity: number;
  }

  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [movies, setMovies] = useState<PersonMovieCredit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    Promise.all([
      tmdb<PersonDetails>(`/person/${id}`),
      tmdb<{ cast: PersonMovieCredit[] }>(`/person/${id}/movie_credits`),
    ])
      .then(([personData, creditsData]) => {
        setPerson(personData);
        setMovies(creditsData.cast || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const age = useMemo(() => {
    if (!person?.birthday) return null;

    const birthTime = new Date(person.birthday).getTime();
    const now = Date.now();

    return Math.floor((now - birthTime) / (1000 * 60 * 60 * 24 * 365.25));
  }, [person?.birthday]);

  if (loading) {
    return <p className="text-white text-center py-32">Loading person...</p>;
  }

  if (!person) {
    return <p className="text-white text-center py-32">Person not found</p>;
  }

  return (
    <div className="relative text-white overflow-hidden rounded-xl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-slate-900/80 to-indigo-950/90" />
      <div className="absolute inset-0 backdrop-blur-xl bg-white/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_60%)]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Profile image */}
          <img
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : "https://placehold.co/500x750?text=No+Image"
            }
            alt={person.name}
            className="rounded-2xl shadow-2xl"
          />

          {/* Info */}

          <div className="md:col-span-2 h-135 overflow-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {person.name}
            </h1>

            <p className="text-white/60 mb-6">{person.known_for_department}</p>

            {/* Meta */}
            <div className="flex flex-wrap gap-6 text-sm text-white/70 mb-8">
              {person.birthday && (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {person.birthday}
                    {age && ` (${age} years)`}
                  </span>
                </div>
              )}

              {person.place_of_birth && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{person.place_of_birth}</span>
                </div>
              )}
            </div>

            {/* Biography */}
            {person.biography && (
              <p className="text-white/80 leading-relaxed max-w-3xl">
                {person.biography}
              </p>
            )}
          </div>
        </div>

        {/* Known for */}
        {movies.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2">
              <FilmIcon className="w-6 h-6" />
              Known For
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {movies
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 10)
                .map((movie) => (
                  <Link
                    key={movie.id}
                    to={`/movies/${movie.id}`}
                    className="group"
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : "https://placehold.co/300x450?text=No+Image"
                      }
                      alt={movie.title}
                      className="rounded-xl shadow-lg
                                 group-hover:scale-105 transition"
                    />
                    <p className="mt-2 text-sm text-white/80 truncate">
                      {movie.title}
                    </p>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

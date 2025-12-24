// src/pages/movie-details.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tmdb } from "../services/tmdb";
import {
  ClockIcon,
  CalendarIcon,
  StarIcon,
  LinkIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { HoverEffect } from "../components/ui/custom_card-hover-effect";
import { GlareCard } from "../components/ui/custom_glare-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/swiper.css";

import { InfiniteMovingCards } from "../components/ui/custom_infinite-moving-cards";
import type { CastMember } from "../types/cast";
import type { MovieDetails, MovieSummary } from "../types/movie-summary";
import type { MovieImages } from "../types/movie-image";
import type { Review } from "../types/reviews";
import type { WatchProvider } from "../types/provider";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similar, setSimilar] = useState<MovieSummary[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [images, setImages] = useState<MovieImages>({
    backdrops: [],
    posters: [],
  });
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [providers, setProviders] = useState<WatchProvider[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      tmdb<MovieDetails>(`/movie/${id}`),

      tmdb<{ cast: CastMember[] }>(`/movie/${id}/credits`),

      tmdb<{ results: MovieSummary[] }>(`/movie/${id}/similar`),

      tmdb<{ results: { key: string; site: string; type: string }[] }>(
        `/movie/${id}/videos`
      ),

      tmdb<MovieImages>(`/movie/${id}/images`),

      tmdb<{
        results: {
          US?: { flatrate?: WatchProvider[] };
          GB?: { flatrate?: WatchProvider[] };
        };
      }>(`/movie/${id}/watch/providers`),

      tmdb<{ results: Review[] }>(`/movie/${id}/reviews`),
    ])
      .then(
        ([
          movieData,
          creditsData,
          similarData,
          videosData,
          imagesData,
          providersData,
          reviewsData,
        ]) => {
          setMovie(movieData);
          setCast(creditsData.cast);
          setSimilar(similarData.results);
          setImages(imagesData);

          const region = providersData.results.US || providersData.results.GB;

          setProviders(region?.flatrate || []);

          const trailer = videosData.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );

          setTrailerKey(trailer?.key ?? null);
          setReviews(reviewsData.results);
        }
      )
      .finally(() => setLoading(false));

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImage(null);
        setShowTrailer(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [id]);

  if (loading) {
    return <p className="text-white text-center py-32">Loading movie...</p>;
  }

  if (!movie) {
    return <p className="text-white text-center py-32">Movie not found</p>;
  }

  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;

  const formatMoney = (n: number) =>
    n && n > 0 ? `$${n.toLocaleString()}` : "N/A";

  console.log(providers);

  return (
    <>
      <div className="relative text-white border-transparent rounded-xl overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Poster */}
            <GlareCard className="rounded-2xl">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-[480px] sm:h-[540px] md:h-[620px]
                           rounded-2xl shadow-2xl object-cover"
              />
            </GlareCard>

            {/* Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {movie.title}
              </h1>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="text-xs font-medium px-3 py-1 rounded-full
                               bg-white/15 backdrop-blur-md
                               border border-white/20"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="text-white/80 leading-relaxed mb-8 max-w-3xl">
                {movie.overview}
              </p>

              {/* Main stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>

                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    {hours}h {minutes}m
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{movie.release_date}</span>
                </div>
              </div>

              {/* Status + language */}
              <div className="flex flex-wrap gap-6 text-sm text-white/70 mb-8">
                <div>
                  <span className="text-white/40">Status:</span>{" "}
                  <span className="text-white">{movie.status}</span>
                </div>
                <div>
                  <span className="text-white/40">Language:</span>{" "}
                  <span className="text-white">
                    {movie.spoken_languages?.[0]?.english_name || "—"}
                  </span>
                </div>
              </div>

              {/* Budget / Revenue */}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-xl">
                  <p className="text-xs text-white/50">Budget</p>
                  <p className="font-semibold text-sm">
                    {formatMoney(movie.budget)}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-xl">
                  <p className="text-xs text-white/50">Revenue</p>
                  <p className="font-semibold text-sm">
                    {formatMoney(movie.revenue)}
                  </p>
                </div>
              </div>

              {/* Homepage and Trailer */}
              <div className="flex flex-wrap items-center gap-6">
                {trailerKey && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="inline-flex items-center gap-2
                               bg-red-600/90 hover:bg-red-600
                               text-white text-sm font-medium
                               px-5 py-2.5 rounded-full
                               transition backdrop-blur"
                  >
                    <PlayIcon className="w-4 h-4" />
                    Watch Trailer
                  </button>
                )}

                {movie.homepage && (
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm
                             text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Official website
                  </a>
                )}
              </div>

              {/* Streaming Availability */}
              {providers.length > 0 && (
                <div className="mt-8">
                  <p className="text-sm text-white/60 mb-3">Available on</p>
                  <div className="flex flex-wrap gap-4">
                    {providers.map((p) => (
                      <div
                        key={p.provider_id}
                        className="flex items-center gap-3
                                   bg-white/10 backdrop-blur
                                   border border-white/15
                                   rounded-xl px-4 py-2"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                          alt={p.provider_name}
                          className="w-6 h-6 object-contain"
                        />
                        <span className="text-sm">{p.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Collection */}
          {movie.belongs_to_collection && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Part of a collection
              </h2>

              <div
                className="flex items-center gap-6 bg-white/10 backdrop-blur
                         rounded-2xl p-6 border border-white/15"
              >
                {movie.belongs_to_collection.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.belongs_to_collection.poster_path}`}
                    alt={movie.belongs_to_collection.name}
                    className="w-24 rounded-xl shadow-lg"
                  />
                )}

                <div>
                  <p className="text-lg font-medium">
                    {movie.belongs_to_collection.name}
                  </p>
                  <p className="text-sm text-white/60 mt-1">Movie collection</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Image Gallery */}
      {images.backdrops.length > 0 && (
        <section className="mt-10">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-white mb-8">
              Image Gallery
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {images.backdrops.slice(0, 10).map((img) => (
                <button
                  key={img.file_path}
                  onClick={() =>
                    setActiveImage(
                      `https://image.tmdb.org/t/p/original${img.file_path}`
                    )
                  }
                  className="relative min-w-[280px] md:min-w-[360px]
                                 rounded-2xl overflow-hidden
                                 border border-white/10
                                 hover:border-white/30 transition"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                    alt="Movie backdrop"
                    className="w-full h-full object-cover
                                   hover:scale-105 transition duration-500"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}

      {reviews.length > 0 && (
        <section className="mt-14 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-white mb-8">
              User Reviews
            </h2>

            <InfiniteMovingCards
              items={reviews.map((r) => ({
                id: r.id,
                author: r.author,
                content: r.content,
                rating: r.author_details?.rating ?? undefined,
                url: r.url,
              }))}
              direction="left"
              speed="slow"
              pauseOnHover={true}
            />
          </div>
        </section>
      )}

      {/* Cast */}
      {cast.length > 0 && (
        <section className="mt-10">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-white ">Top Cast</h2>

            <HoverEffect
              items={cast.slice(0, 12).map((person) => ({
                title: person.name,
                description: person.character,
                link: `/person/${person.id}`,
                image: person.profile_path
                  ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                  : "https://placehold.co/300x450?text=No+Image",
              }))}
              className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            />
          </div>
        </section>
      )}

      {/* Similar Movies */}
      {similar.length > 0 && (
        <section className="mt-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-white mb-8">
              Similar Movies
            </h2>

            <Swiper
              modules={[Autoplay, FreeMode]}
              slidesPerView="auto"
              spaceBetween={20}
              freeMode
              loop
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              speed={6000}
              className="!overflow-visible"
            >
              {similar.map((movie) => (
                <SwiperSlide
                  key={movie.id}
                  className="!w-[160px] sm:!w-[180px] md:!w-[200px] md:!h-[300px]"
                >
                  <a
                    href={`/movies/${movie.id}`}
                    className="group h-full block"
                  >
                    <div
                      className="relative rounded-2xl h-full overflow-hidden
                                 bg-white/5 backdrop-blur-xl
                                 border border-white/10
                                 group-hover:border-white/30 transition"
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "https://placehold.co/300x450?text=No+Image"
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover
                                   group-hover:scale-105 transition duration-500"
                      />

                      <div
                        className="absolute inset-0 bg-gradient-to-t
                                   from-black/70 via-black/20 to-transparent
                                   opacity-0 group-hover:opacity-100 transition"
                      />

                      <p
                        className="absolute bottom-2 left-2 right-2
                                   text-xs text-white font-medium
                                   opacity-0 group-hover:opacity-100 transition
                                   truncate"
                      >
                        {movie.title}
                      </p>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {showTrailer && trailerKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur">
          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-3 right-3 z-10
                         bg-black/60 hover:bg-black
                         rounded-full p-2 transition"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Movie trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/90 backdrop-blur"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="max-w-6xl w-full px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt="Gallery fullscreen"
              className="w-full max-h-[90vh]
                         object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

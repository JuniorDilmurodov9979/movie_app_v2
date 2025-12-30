export function ImageGallery({
  images,
  onSelect,
}: {
  images: { file_path: string }[];
  onSelect: (url: string) => void;
}) {
  if (!images?.length) return null;

  return (
    <section className="mt-10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-white mb-8">
          Image Gallery
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {images.slice(0, 10).map((img) => (
            <button
              key={img.file_path}
              onClick={() =>
                onSelect(`https://image.tmdb.org/t/p/original${img.file_path}`)
              }
              className="relative min-w-[280px] md:min-w-[360px]
                         rounded-2xl overflow-hidden
                         border border-white/10
                         hover:border-white/30 transition"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                alt=""
                className="w-full h-full object-cover
                           hover:scale-105 transition duration-500"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

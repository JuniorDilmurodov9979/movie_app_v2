import { XMarkIcon } from "@heroicons/react/24/solid";

export function TrailerModal({
  trailerKey,
  onClose,
}: {
  trailerKey: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur">
      <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black">
        <button
          onClick={onClose}
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
  );
}
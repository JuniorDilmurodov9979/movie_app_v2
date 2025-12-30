import {
  ClockIcon,
  CalendarIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

export function MovieStats({
  rating,
  runtime,
  releaseDate,
}: {
  rating: number;
  runtime: number;
  releaseDate: string;
}) {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
        <StarIcon className="w-4 h-4 text-yellow-400" />
        <span>{rating.toFixed(1)}</span>
      </div>

      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
        <ClockIcon className="w-4 h-4" />
        <span>
          {hours}h {minutes}m
        </span>
      </div>

      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
        <CalendarIcon className="w-4 h-4" />
        <span>{releaseDate}</span>
      </div>
    </div>
  );
}